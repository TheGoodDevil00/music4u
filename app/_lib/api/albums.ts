import { USE_MOCK_API } from '../config';
import { apiClient } from './client';
import { mockAlbums } from '../mock/albums';
import { mockTracks } from '../mock/tracks';
import type { Album } from '../../_types/album';

export async function getAlbum(albumId: string): Promise<Album> {
  if (USE_MOCK_API) {
    await new Promise(r => setTimeout(r, 400));
    const album = mockAlbums.find(al => al.id === albumId);
    if (!album) throw new Error(`Album not found: ${albumId}`);

    // Populate tracks in the album
    const tracks = mockTracks.filter(t => album.trackIds.includes(t.id));

    return {
      ...album,
      tracks,
    };
  }

  // Future route: GET /albums/{album_id}
  return apiClient<Album>(`/albums/${albumId}`);
}

export async function getSimilarAlbums(albumId: string): Promise<Album[]> {
  if (USE_MOCK_API) {
    await new Promise(r => setTimeout(r, 450));
    const currentAlbum = mockAlbums.find(al => al.id === albumId);
    if (!currentAlbum) return mockAlbums.slice(0, 4);

    return mockAlbums
      .filter(al => al.id !== albumId)
      .filter(al => al.genres.some(g => currentAlbum.genres.includes(g)))
      .slice(0, 5);
  }

  // Future route: GET /albums/{album_id}/similar or similar search logic
  return mockAlbums.slice(0, 4); // Standard mock or fetch mapping
}
