import { USE_MOCK_API } from '../config';
import { apiClient } from './client';
import { mockTracks } from '../mock/tracks';
import type { Track } from '../../_types/track';
import { useUserStore } from '../../_store/userStore';

export async function getTrack(trackId: string): Promise<Track> {
  if (USE_MOCK_API) {
    await new Promise(r => setTimeout(r, 400));
    const track = mockTracks.find(t => t.id === trackId);
    if (!track) throw new Error(`Track not found: ${trackId}`);
    return track;
  }

  // Future route: GET /tracks/{track_id}
  return apiClient<Track>(`/tracks/${trackId}`);
}

export async function getSimilarTracks(trackId: string): Promise<Track[]> {
  if (USE_MOCK_API) {
    await new Promise(r => setTimeout(r, 500));
    const currentTrack = mockTracks.find(t => t.id === trackId);
    if (!currentTrack) return mockTracks.slice(0, 5);

    // Find tracks with overlapping genres or moods, excluding the current track
    return mockTracks
      .filter(t => {
        if (t.id === trackId) return false;
        return t.genre.some(g => currentTrack.genre.includes(g)) || 
          t.mood.some(m => currentTrack.mood.includes(m));
      })
      .slice(0, 6);
  }

  // Future route: GET /tracks/{track_id}/similar
  return apiClient<Track[]>(`/tracks/${trackId}/similar`);
}

export interface SearchFilters {
  genre?: string;
  mood?: string;
  bpmMin?: number;
  bpmMax?: number;
  era?: string; // e.g., "1950s", "2000s", "2010s", "2020s"
}

export async function searchAll(
  query: string,
  filters: SearchFilters = {}
): Promise<{ tracks: Track[]; artists: any[]; albums: any[] }> {
  if (USE_MOCK_API) {
    let sourceTracks = mockTracks;
    let sourceArtists: any[] = [];
    let sourceAlbums: any[] = [];
    let isSpotify = false;

    try {
      const res = await fetch('/api/auth/spotify/session');
      const { data } = await res.json();
      if (data && data.listeningHistory && data.listeningHistory.length > 0) {
        sourceTracks = data.listeningHistory;
        isSpotify = true;
      }
    } catch (err) {
      console.warn('Could not read Spotify session for search, trying local fallback:', err);
    }

    if (!isSpotify) {
      const persistedProfile = useUserStore.getState().spotifyProfile;
      if (persistedProfile && persistedProfile.listeningHistory && persistedProfile.listeningHistory.length > 0) {
        sourceTracks = persistedProfile.listeningHistory;
        isSpotify = true;
      }
    }

    if (isSpotify) {
      // Dynamically extract unique artists and albums from Spotify tracks
      const artistsMap = new Map();
      const albumsMap = new Map();

      sourceTracks.forEach((t: any) => {
        if (!artistsMap.has(t.artistId)) {
          artistsMap.set(t.artistId, {
            id: t.artistId,
            name: t.artistName,
            imageUrl: t.albumArtUrl,
            genres: t.genre,
            bio: 'Spotify artist from your history',
            popularity: 85,
            followers: 250000,
          });
        }
        if (!albumsMap.has(t.albumId)) {
          albumsMap.set(t.albumId, {
            id: t.albumId,
            title: t.albumTitle,
            artistId: t.artistId,
            artistName: t.artistName,
            albumArtUrl: t.albumArtUrl,
            releaseYear: t.releaseYear,
            genres: t.genre,
          });
        }
      });

      sourceArtists = Array.from(artistsMap.values());
      sourceAlbums = Array.from(albumsMap.values());
    }

    if (!isSpotify) {
      // Import mock datasets inline to prevent circular dependencies
      const { mockArtists } = await import('../mock/artists');
      const { mockAlbums } = await import('../mock/albums');
      sourceArtists = mockArtists;
      sourceAlbums = mockAlbums;
    }

    await new Promise(r => setTimeout(r, 300));
    const lowerQuery = query.toLowerCase();

    // Filter tracks
    let tracks = sourceTracks.filter(t => 
      t.title.toLowerCase().includes(lowerQuery) ||
      t.artistName.toLowerCase().includes(lowerQuery) ||
      t.albumTitle.toLowerCase().includes(lowerQuery)
    );

    // Apply filters
    if (filters.genre) {
      tracks = tracks.filter(t => t.genre.some(g => g.toLowerCase() === filters.genre!.toLowerCase()));
    }
    if (filters.mood) {
      tracks = tracks.filter(t => t.mood.some(m => m.toLowerCase() === filters.mood!.toLowerCase()));
    }
    if (filters.bpmMin !== undefined) {
      tracks = tracks.filter(t => t.bpm >= filters.bpmMin!);
    }
    if (filters.bpmMax !== undefined) {
      tracks = tracks.filter(t => t.bpm <= filters.bpmMax!);
    }
    if (filters.era) {
      if (filters.era === '1950s') {
        tracks = tracks.filter(t => t.releaseYear >= 1950 && t.releaseYear < 1960);
      } else if (filters.era === '2000s') {
        tracks = tracks.filter(t => t.releaseYear >= 2000 && t.releaseYear < 2010);
      } else if (filters.era === '2010s') {
        tracks = tracks.filter(t => t.releaseYear >= 2010 && t.releaseYear < 2020);
      } else if (filters.era === '2020s') {
        tracks = tracks.filter(t => t.releaseYear >= 2020);
      }
    }

    // Filter artists
    const artists = sourceArtists.filter(a => 
      a.name.toLowerCase().includes(lowerQuery) ||
      (a.genres && a.genres.some((g: string) => g.toLowerCase().includes(lowerQuery)))
    );

    // Filter albums
    const albums = sourceAlbums.filter(al => 
      al.title.toLowerCase().includes(lowerQuery) ||
      al.artistName.toLowerCase().includes(lowerQuery)
    );

    return { tracks, artists, albums };
  }

  // Future route: GET /search?q=&genre=&mood=&...
  const queryParams = new URLSearchParams({ q: query });
  if (filters.genre) queryParams.append('genre', filters.genre);
  if (filters.mood) queryParams.append('mood', filters.mood);
  if (filters.bpmMin !== undefined) queryParams.append('bpm_min', String(filters.bpmMin));
  if (filters.bpmMax !== undefined) queryParams.append('bpm_max', String(filters.bpmMax));
  if (filters.era) queryParams.append('era', filters.era);

  return apiClient<{ tracks: Track[]; artists: any[]; albums: any[] }>(`/search?${queryParams.toString()}`);
}
