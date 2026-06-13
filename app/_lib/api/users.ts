import { USE_MOCK_API } from '../config';
import { apiClient } from './client';
import { mockTracks } from '../mock/tracks';
import { mockArtists } from '../mock/artists';
import type { Track } from '../../_types/track';
import type { Artist } from '../../_types/artist';

export interface GenreWeight {
  genre: string;
  weight: number; // 0-100
}

export interface UserProfile {
  id: string;
  name: string;
  avatarUrl: string;
  tasteProfile: {
    topGenres: GenreWeight[];
    topArtists: Artist[];
    averageBpm: number;
    preferredKey: string;
  };
  listeningHistory: Track[];
  likedTrackIds: string[];
}

export async function getUserProfile(userId: string): Promise<UserProfile> {
  if (USE_MOCK_API) {
    try {
      // Check if there is a Spotify-synced profile session
      const res = await fetch('/api/auth/spotify/session');
      const { data } = await res.json();
      if (data) {
        return data;
      }
    } catch (err) {
      console.warn('Could not retrieve Spotify session, falling back to mock profile:', err);
    }

    await new Promise(r => setTimeout(r, 500));
    
    // Pick some tracks for history
    const history = [
      mockTracks[0], // Let It Happen
      mockTracks[3], // Everything In Its Right Place
      mockTracks[7], // One More Time
      mockTracks[13], // So What
      mockTracks[25], // We Ain't Feeling Time
    ];

    // Pick top artists
    const topArtists = [
      mockArtists[0], // Tame Impala
      mockArtists[1], // Radiohead
      mockArtists[2], // Daft Punk
    ];

    return {
      id: userId,
      name: 'Alex Mercer',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&h=200&fit=crop',
      tasteProfile: {
        topGenres: [
          { genre: 'Electronic', weight: 45 },
          { genre: 'Indie', weight: 30 },
          { genre: 'Jazz', weight: 15 },
          { genre: 'R&B', weight: 10 },
        ],
        topArtists,
        averageBpm: 114,
        preferredKey: 'D min',
      },
      listeningHistory: history,
      likedTrackIds: ['track-1', 'track-3', 'track-4', 'track-13', 'track-25'],
    };
  }

  // Future route: GET /users/{user_id}/profile
  return apiClient<UserProfile>(`/users/${userId}/profile`);
}
