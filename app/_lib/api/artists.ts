import { USE_MOCK_API } from '../config';
import { apiClient } from './client';
import { mockArtists } from '../mock/artists';
import { mockTracks } from '../mock/tracks';
import type { Artist } from '../../_types/artist';
import type { Track } from '../../_types/track';

export interface ArtistDetail {
  artist: Artist;
  topTracks: Track[];
}

export async function getArtist(artistId: string): Promise<ArtistDetail> {
  if (USE_MOCK_API) {
    await new Promise(r => setTimeout(r, 450));
    const artist = mockArtists.find(a => a.id === artistId);
    if (!artist) throw new Error(`Artist not found: ${artistId}`);

    // Get top tracks for this artist
    const topTracks = mockTracks.filter(t => t.artistId === artistId).slice(0, 5);

    return { artist, topTracks };
  }

  // Future route: GET /artists/{artist_id}
  return apiClient<ArtistDetail>(`/artists/${artistId}`);
}

export async function getSimilarArtists(artistId: string): Promise<Artist[]> {
  if (USE_MOCK_API) {
    await new Promise(r => setTimeout(r, 500));
    const currentArtist = mockArtists.find(a => a.id === artistId);
    if (!currentArtist) return mockArtists.slice(0, 4);

    // Find artists with overlapping genres
    return mockArtists
      .filter(a => a.id !== artistId && a.genres.some(g => currentArtist.genres.includes(g)))
      .slice(0, 5);
  }

  // Future route: GET /artists/{artist_id}/similar
  return apiClient<Artist[]>(`/artists/${artistId}/similar`);
}
