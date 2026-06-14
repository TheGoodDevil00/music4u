import { USE_MOCK_API } from '../config';
import { apiClient } from './client';
import { mockRecommendations } from '../mock/recommendations';
import type { Recommendation } from '../../_types/recommendation';

export async function getRecommendations(userId: string): Promise<Recommendation[]> {
  if (USE_MOCK_API) {
    try {
      const res = await fetch('/api/auth/spotify/session');
      const { data } = await res.json();
      if (data && data.listeningHistory && data.listeningHistory.length > 0) {
        // Generate dynamic recommendations from Spotify listening history
        const history = data.listeningHistory;
        return history.map((track: any, i: number) => {
          let sectionId = 'rec-recent';
          if (i >= 5 && i < 10) sectionId = 'rec-genre';
          else if (i >= 10) sectionId = 'rec-chill';

          return {
            id: `rec-spotify-${track.id}-${i}`,
            track,
            score: parseFloat((0.99 - (i * 0.005)).toFixed(3)),
            reason: `Based on your recent listening of ${track.artistName}`,
            signals: ['spotify_sync', 'acoustic_overlap', 'user_preference'],
            sectionId,
          };
        });
      }
    } catch (err) {
      console.warn('Could not load Spotify session for recommendations, using mock:', err);
    }

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
