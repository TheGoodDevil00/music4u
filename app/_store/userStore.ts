import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  userId: string;
  likedTrackIds: string[];
  listeningHistoryIds: string[];
  hasCompletedOnboarding: boolean;
  spotifyUser: {
    name: string;
    avatarUrl: string;
  } | null;
  
  // Actions
  toggleLikeTrack: (trackId: string) => void;
  isLiked: (trackId: string) => boolean;
  addToHistory: (trackId: string) => void;
  clearHistory: () => void;
  setCompletedOnboarding: (val: boolean) => void;
  setSpotifyUser: (user: { name: string; avatarUrl: string } | null) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      userId: 'user-123',
      likedTrackIds: ['track-1', 'track-3', 'track-4', 'track-13', 'track-25'],
      listeningHistoryIds: [],
      hasCompletedOnboarding: false,
      spotifyUser: null,

      toggleLikeTrack: (trackId) => set((state) => {
        const alreadyLiked = state.likedTrackIds.includes(trackId);
        const newLikes = alreadyLiked
          ? state.likedTrackIds.filter(id => id !== trackId)
          : [...state.likedTrackIds, trackId];
        return { likedTrackIds: newLikes };
      }),

      isLiked: (trackId) => {
        return get().likedTrackIds.includes(trackId);
      },

      addToHistory: (trackId) => set((state) => {
        const filteredHistory = state.listeningHistoryIds.filter(id => id !== trackId);
        return {
          listeningHistoryIds: [trackId, ...filteredHistory].slice(0, 50), // keep last 50
        };
      }),

      clearHistory: () => set({ listeningHistoryIds: [] }),

      setCompletedOnboarding: (val) => set({ hasCompletedOnboarding: val }),

      setSpotifyUser: (user) => set({ spotifyUser: user }),
    }),
    {
      name: 'music4u-user-store',
    }
  )
);
