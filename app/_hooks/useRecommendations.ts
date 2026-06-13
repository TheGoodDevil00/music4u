import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRecommendations, submitFeedback } from '../_lib/api/recommendations';

export function useRecommendations(userId: string) {
  return useQuery({
    queryKey: ['recommendations', userId],
    queryFn: () => getRecommendations(userId),
    staleTime: 1000 * 60 * 5, // 5 min
  });
}

function useSubmitFeedback() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ trackId, signal }: { trackId: string; signal: 'like' | 'dislike' | 'skip' | 'save' }) =>
      submitFeedback(trackId, signal),
    onSuccess: (_, variables) => {
      // Invalidate queries to refresh data if necessary
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
  });
}
