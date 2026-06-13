import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error || !code) {
    return NextResponse.redirect(new URL('/?error=spotify_auth_failed', request.url));
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

  try {
    // 1. Exchange auth code for tokens
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
      },
      body: new URLSearchParams({
        code: code,
        redirect_uri: redirectUri!,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok) {
      throw new Error(tokenData.error_description || 'Failed to exchange token');
    }

    const accessToken = tokenData.access_token;

    // 2. Fetch user profile info
    const meResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const meData = await meResponse.json();
    const userName = meData.display_name || 'Spotify User';
    const userAvatar = meData.images?.[0]?.url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&h=200&fit=crop';

    // 3. Fetch recently played tracks
    const recentlyPlayedResponse = await fetch(
      'https://api.spotify.com/v1/me/player/recently-played?limit=50',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    const recentlyPlayedData = await recentlyPlayedResponse.json();
    const items = recentlyPlayedData.items || [];

    if (items.length === 0) {
      return NextResponse.redirect(new URL('/?onboarding=complete&empty=true', request.url));
    }

    // Extract unique track IDs for fetching audio features
    const trackIds = Array.from(new Set(items.map((item: any) => item.track.id)));

    // 4. Batch-fetch Audio Features
    const featuresResponse = await fetch(
      `https://api.spotify.com/v1/audio-features?ids=${trackIds.join(',')}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    const featuresData = await featuresResponse.json();
    const featuresMap = new Map(
      (featuresData.audio_features || [])
        .filter((f: any) => f !== null)
        .map((f: any) => [f.id, f])
    );

    // 5. Transform data to fit the project's Track model format
    const transformedTracks = items.map((item: any) => {
      const t = item.track;
      const feat: any = featuresMap.get(t.id) || {};
      
      const pitchKeys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
      const keyStr = feat.key !== undefined && feat.key >= 0 
        ? `${pitchKeys[feat.key]} ${feat.mode === 1 ? 'maj' : 'min'}` 
        : 'C maj';

      const genres = t.artists[0]?.genres || [];

      return {
        id: t.id,
        title: t.name,
        artistId: t.artists[0]?.id || 'unknown-artist',
        artistName: t.artists[0]?.name || 'Unknown Artist',
        albumId: t.album.id,
        albumTitle: t.album.name,
        albumArtUrl: t.album.images?.[0]?.url || '/api/placeholder/400/400',
        durationMs: t.duration_ms,
        genre: genres.length > 0 ? genres : ['Pop'],
        mood: feat.valence > 0.5 ? ['Energetic', 'Chill'] : ['Melancholy', 'Dark'],
        bpm: Math.round(feat.tempo || 120),
        key: keyStr,
        energy: feat.energy || 0.5,
        danceability: feat.danceability || 0.5,
        previewUrl: t.preview_url || null,
        playCount: Math.round((feat.instrumentalness || 0.1) * 1000) + 10,
        releaseYear: parseInt(t.album.release_date?.substring(0, 4)) || 2024,
      };
    });

    // 6. Compute user profile taste vector
    const bpms = transformedTracks.map((t: any) => t.bpm);
    const avgBpm = Math.round(bpms.reduce((a: number, b: number) => a + b, 0) / bpms.length) || 120;
    
    const keys = transformedTracks.map((t: any) => t.key);
    const preferredKey = keys.sort((a: any, b: any) =>
      keys.filter((v: any) => v === a).length - keys.filter((v: any) => v === b).length
    ).pop() || 'C maj';

    const rawGenres = transformedTracks.flatMap((t: any) => t.genre);
    const genreCounts: Record<string, number> = {};
    rawGenres.forEach((g: string) => {
      genreCounts[g] = (genreCounts[g] || 0) + 1;
    });

    const topGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([genre, count]) => ({
        genre,
        weight: Math.round((count / rawGenres.length) * 100),
      }));

    const topArtists = Array.from(new Set(transformedTracks.map((t: any) => JSON.stringify({
      id: t.artistId,
      name: t.artistName,
      imageUrl: t.albumArtUrl,
      genres: t.genre,
      bio: `Spotify imported artist, popular in your listening history.`,
      popularity: 80,
      followers: 100000
    })))).map((s: any) => JSON.parse(s));

    const updatedProfile = {
      id: 'user-123',
      name: userName,
      avatarUrl: userAvatar,
      tasteProfile: {
        topGenres: topGenres.length > 0 ? topGenres : [
          { genre: 'Electronic', weight: 45 },
          { genre: 'Indie', weight: 35 },
          { genre: 'Pop', weight: 20 }
        ],
        topArtists: topArtists.slice(0, 3),
        averageBpm: avgBpm,
        preferredKey: preferredKey,
      },
      listeningHistory: transformedTracks,
      likedTrackIds: transformedTracks.slice(0, 5).map((t: any) => t.id),
    };

    // Store in global memory for local/Vercel session retrieval
    (globalThis as any).cachedSpotifyData = updatedProfile;

    // Send to backend if config tells us to use the FastAPI server
    if (process.env.NEXT_PUBLIC_USE_MOCK_API !== 'true') {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/user-123/spotify-sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tracks: transformedTracks }),
        });
      } catch (backendErr) {
        console.error('Failed to update FastAPI backend:', backendErr);
      }
    }

    // Redirect to homepage with a query param triggering data retrieval
    const baseUrl = request.nextUrl.origin;
    return NextResponse.redirect(new URL('/?spotify_sync=true', baseUrl));
  } catch (err: any) {
    console.error('Spotify Auth Callback error:', err);
    const baseUrl = request.nextUrl.origin;
    return NextResponse.redirect(new URL(`/?error=${encodeURIComponent(err.message)}`, baseUrl));
  }
}

