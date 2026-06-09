import { useQuery } from '@tanstack/react-query';
import { getTrack, getSimilarTracks, searchAll, type SearchFilters } from '../_lib/api/tracks';

export function useTrack(trackId: string) {
  return useQuery({
    queryKey: ['track', trackId],
    queryFn: () => getTrack(trackId),
    enabled: !!trackId,
    staleTime: 1000 * 60 * 10, // 10 min
  });
}

export function useSimilarTracks(trackId: string) {
  return useQuery({
    queryKey: ['similar-tracks', trackId],
    queryFn: () => getSimilarTracks(trackId),
    enabled: !!trackId,
    staleTime: 1000 * 60 * 10,
  });
}

export function useSearch(query: string, filters: SearchFilters = {}) {
  return useQuery({
    queryKey: ['search', query, filters],
    queryFn: () => searchAll(query, filters),
    enabled: true, // we want to be able to fetch even with empty query to show default recommendations/browse categories
    staleTime: 1000 * 60 * 2, // 2 min
  });
}
