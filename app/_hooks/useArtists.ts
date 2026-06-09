import { useQuery } from '@tanstack/react-query';
import { getArtist, getSimilarArtists } from '../_lib/api/artists';

export function useArtist(artistId: string) {
  return useQuery({
    queryKey: ['artist', artistId],
    queryFn: () => getArtist(artistId),
    enabled: !!artistId,
    staleTime: 1000 * 60 * 10,
  });
}

export function useSimilarArtists(artistId: string) {
  return useQuery({
    queryKey: ['similar-artists', artistId],
    queryFn: () => getSimilarArtists(artistId),
    enabled: !!artistId,
    staleTime: 1000 * 60 * 10,
  });
}
