import { USE_MOCK_API } from '../config';
import { apiClient } from './client';
import { mockTracks } from '../mock/tracks';
import type { Track } from '../../_types/track';

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
      .filter(t => t.id !== trackId)
      .filter(t => 
        t.genre.some(g => currentTrack.genre.includes(g)) || 
        t.mood.some(m => currentTrack.mood.includes(m))
      )
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
    await new Promise(r => setTimeout(r, 300));
    const lowerQuery = query.toLowerCase();

    // Import mock datasets inline to prevent circular dependencies
    const { mockArtists } = await import('../mock/artists');
    const { mockAlbums } = await import('../mock/albums');

    // Filter tracks
    let tracks = mockTracks.filter(t => 
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
    const artists = mockArtists.filter(a => 
      a.name.toLowerCase().includes(lowerQuery) ||
      a.genres.some(g => g.toLowerCase().includes(lowerQuery))
    );

    // Filter albums
    const albums = mockAlbums.filter(al => 
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
