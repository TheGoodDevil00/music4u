import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '../_lib/api/users';

export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: ['user-profile', userId],
    queryFn: () => getUserProfile(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
}
