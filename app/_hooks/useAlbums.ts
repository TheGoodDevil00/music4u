import { useQuery } from '@tanstack/react-query';
import { getAlbum, getSimilarAlbums } from '../_lib/api/albums';

export function useAlbum(albumId: string) {
  return useQuery({
    queryKey: ['album', albumId],
    queryFn: () => getAlbum(albumId),
    enabled: !!albumId,
    staleTime: 1000 * 60 * 10,
  });
}

export function useSimilarAlbums(albumId: string) {
  return useQuery({
    queryKey: ['similar-albums', albumId],
    queryFn: () => getSimilarAlbums(albumId),
    enabled: !!albumId,
    staleTime: 1000 * 60 * 10,
  });
}
