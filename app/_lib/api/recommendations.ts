import { USE_MOCK_API } from '../config';
import { apiClient } from './client';
import { mockRecommendations } from '../mock/recommendations';
import type { Recommendation } from '../../_types/recommendation';

export async function getRecommendations(userId: string): Promise<Recommendation[]> {
  if (USE_MOCK_API) {
    // Simulate network latency so loading states are tested
    await new Promise(r => setTimeout(r, 600));
    return mockRecommendations;
  }

  // Future route: GET /recommendations/{user_id}
  return apiClient<Recommendation[]>(`/recommendations/${userId}`);
}

export async function submitFeedback(
  trackId: string,
  signal: 'like' | 'dislike' | 'skip' | 'save'
): Promise<{ success: boolean; message: string }> {
  if (USE_MOCK_API) {
    await new Promise(r => setTimeout(r, 300));
    return { success: true, message: `Feedback '${signal}' submitted for track ${trackId}` };
  }

  // Future route: POST /feedback
  return apiClient<{ success: boolean; message: string }>('/feedback', {
    method: 'POST',
    body: JSON.stringify({ track_id: trackId, signal }),
  });
}
