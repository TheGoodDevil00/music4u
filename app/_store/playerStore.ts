import { create } from 'zustand';
import type { Track } from '../_types/track';

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  queue: Track[];
  queueIndex: number;
  volume: number;
  isMuted: boolean;
  progress: number; // in ms
  duration: number; // in ms
  isShuffle: boolean;
  isRepeat: 'none' | 'one' | 'all';
  
  // Actions
  playTrack: (track: Track, contextQueue?: Track[]) => void;
  togglePlay: () => void;
  setPlaying: (playing: boolean) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (trackId: string) => void;
  clearQueue: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  setQueue: (queue: Track[]) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  queue: [],
  queueIndex: -1,
  volume: 0.8,
  isMuted: false,
  progress: 0,
  duration: 0,
  isShuffle: false,
  isRepeat: 'none',

  playTrack: (track, contextQueue) => {
    const state = get();
    let newQueue = contextQueue ? [...contextQueue] : [...state.queue];
    
    // Ensure the track is in the queue
    let index = newQueue.findIndex(t => t.id === track.id);
    if (index === -1) {
      newQueue.push(track);
      index = newQueue.length - 1;
    }

    set({
      currentTrack: track,
      isPlaying: true,
      queue: newQueue,
      queueIndex: index,
      progress: 0,
      duration: track.durationMs,
    });
  },

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  
  setPlaying: (playing) => set({ isPlaying: playing }),

  nextTrack: () => {
    const { queue, queueIndex, isShuffle, isRepeat } = get();
    if (queue.length === 0) return;

    let nextIndex = queueIndex;

    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = queueIndex + 1;
      if (nextIndex >= queue.length) {
        if (isRepeat === 'all') {
          nextIndex = 0;
        } else {
          // No more tracks and repeat is off/one (handle one in audio player element)
          set({ isPlaying: false, progress: 0 });
          return;
        }
      }
    }

    const nextTrack = queue[nextIndex];
    set({
      currentTrack: nextTrack,
      queueIndex: nextIndex,
      isPlaying: true,
      progress: 0,
      duration: nextTrack.durationMs,
    });
  },

  prevTrack: () => {
    const { queue, queueIndex, progress } = get();
    if (queue.length === 0) return;

    // If track has been playing for more than 3 seconds, restart it
    if (progress > 3000) {
      set({ progress: 0 });
      return;
    }

    let prevIndex = queueIndex - 1;
    if (prevIndex < 0) {
      prevIndex = queue.length - 1; // loop back to end
    }

    const prevTrack = queue[prevIndex];
    set({
      currentTrack: prevTrack,
      queueIndex: prevIndex,
      isPlaying: true,
      progress: 0,
      duration: prevTrack.durationMs,
    });
  },

  addToQueue: (track) => {
    const { queue } = get();
    if (queue.some(t => t.id === track.id)) return; // Avoid duplicates
    set({ queue: [...queue, track] });
  },

  removeFromQueue: (trackId) => {
    const { queue, queueIndex, currentTrack } = get();
    const newQueue = queue.filter(t => t.id !== trackId);
    
    let newIndex = newQueue.findIndex(t => t.id === currentTrack?.id);
    
    set({
      queue: newQueue,
      queueIndex: newIndex,
    });
  },

  clearQueue: () => set({ queue: [], queueIndex: -1 }),

  setVolume: (volume) => set({ volume, isMuted: volume === 0 }),

  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

  setProgress: (progress) => set({ progress }),

  setDuration: (duration) => set({ duration }),

  toggleShuffle: () => set((state) => ({ isShuffle: !state.isShuffle })),

  toggleRepeat: () => set((state) => {
    const nextRepeat: Record<PlayerState['isRepeat'], PlayerState['isRepeat']> = {
      'none': 'all',
      'all': 'one',
      'one': 'none',
    };
    return { isRepeat: nextRepeat[state.isRepeat] };
  }),

  setQueue: (queue) => set({ queue, queueIndex: 0 }),
}));
