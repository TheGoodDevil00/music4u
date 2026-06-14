'use client';

import React, { useReducer, useSyncExternalStore, useEffect } from 'react';
import { useUserStore } from '../../_store/userStore';
import { Music, Check, ArrowRight, Loader2, Sparkles, Sliders, X } from 'lucide-react';

let onboardingCompleted = typeof window !== 'undefined'
  ? localStorage.getItem('music4u-onboarding-completed') === 'true'
  : true;

const listeners = new Set<() => void>();

const onboardingStore = {
  subscribe(callback: () => void) {
    listeners.add(callback);
    return () => {
      listeners.delete(callback);
    };
  },
  getSnapshot() {
    return onboardingCompleted;
  },
  getServerSnapshot() {
    return true;
  },
  complete() {
    localStorage.setItem('music4u-onboarding-completed', 'true');
    onboardingCompleted = true;
    listeners.forEach((l) => l());
  }
};

function completeOnboarding() {
  onboardingStore.complete();
  useUserStore.getState().setCompletedOnboarding(true);
}

function handleManualSubmit(e: React.FormEvent) {
  e.preventDefault();
  completeOnboarding();
}

interface State {
  step: 'options' | 'spotify-syncing' | 'manual-form';
  syncStatus: string;
  selectedGenres: string[];
  preferredBpm: 'low' | 'mid' | 'high';
  preferredMood: string;
}

type Action =
  | { type: 'SET_STEP'; payload: 'options' | 'spotify-syncing' | 'manual-form' }
  | { type: 'SET_SYNC_STATUS'; payload: string }
  | { type: 'TOGGLE_GENRE'; payload: string }
  | { type: 'SET_PREFERRED_BPM'; payload: 'low' | 'mid' | 'high' }
  | { type: 'SET_PREFERRED_MOOD'; payload: string }
  | { type: 'RESET' };

const initialState: State = {
  step: 'options',
  syncStatus: '',
  selectedGenres: [],
  preferredBpm: 'mid',
  preferredMood: 'Chill'
};

function onboardingReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'SET_SYNC_STATUS':
      return { ...state, syncStatus: action.payload };
    case 'TOGGLE_GENRE':
      return {
        ...state,
        selectedGenres: state.selectedGenres.includes(action.payload)
          ? state.selectedGenres.filter((g) => g !== action.payload)
          : [...state.selectedGenres, action.payload]
      };
    case 'SET_PREFERRED_BPM':
      return { ...state, preferredBpm: action.payload };
    case 'SET_PREFERRED_MOOD':
      return { ...state, preferredMood: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export default function OnboardingModal() {
  const completed = useSyncExternalStore(
    onboardingStore.subscribe,
    onboardingStore.getSnapshot,
    onboardingStore.getServerSnapshot
  );

  const [state, dispatch] = useReducer(onboardingReducer, initialState);
  const { step, syncStatus, selectedGenres, preferredBpm, preferredMood } = state;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('spotify_sync') === 'true') {
      dispatch({ type: 'SET_STEP', payload: 'spotify-syncing' });
      dispatch({ type: 'SET_SYNC_STATUS', payload: 'Finalizing taste profile extraction...' });
      
      // Fetch session data
      fetch('/api/auth/spotify/session')
        .then(res => res.json())
        .then(({ data }) => {
          if (data) {
            const userStore = useUserStore.getState();
            if (data.likedTrackIds) {
              // Update Zustand client store with liked track IDs from Spotify sync
              data.likedTrackIds.forEach((id: string) => {
                if (!userStore.likedTrackIds.includes(id)) {
                  userStore.likedTrackIds.push(id);
                }
              });
            }
            if (data.name && data.avatarUrl) {
              userStore.setSpotifyUser({
                name: data.name,
                avatarUrl: data.avatarUrl,
              });
            }
          }
          dispatch({ type: 'SET_SYNC_STATUS', payload: 'Sync complete! Taste profile generated.' });
          setTimeout(() => {
            // Remove search param from URL
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
            completeOnboarding();
          }, 1500);
        })
        .catch(err => {
          console.error(err);
          dispatch({ type: 'SET_SYNC_STATUS', payload: 'Error during finalizing. Completing onboarding...' });
          setTimeout(() => {
            completeOnboarding();
          }, 1500);
        });
    }
  }, []);

  if (completed) return null;

  const handleSpotifySync = () => {
    dispatch({ type: 'SET_STEP', payload: 'spotify-syncing' });
    dispatch({ type: 'SET_SYNC_STATUS', payload: 'Redirecting to Spotify authorization portal...' });
    setTimeout(() => {
      window.location.href = '/api/auth/spotify';
    }, 800);
  };

  const toggleGenre = (genre: string) => {
    dispatch({ type: 'TOGGLE_GENRE', payload: genre });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-void-eclipse/90 backdrop-blur-md p-4 select-none">
      <div className="w-full max-w-lg rounded-structural bg-surface border border-steel-accent/35 p-6 md:p-8 relative overflow-hidden shadow-2xl shadow-black">
        {/* Close Button on Top Right */}
        <button
          type="button"
          onClick={completeOnboarding}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-surface-container text-slate-hint hover:text-white transition-all cursor-pointer z-50"
          aria-label="Dismiss Onboarding"
        >
          <X size={16} />
        </button>

        {/* Decorative subtle ambient background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-midnight-slate/10 rounded-full blur-3xl pointer-events-none" />

        {/* Step 1: Option Choices */}
        {step === 'options' && (
          <div className="space-y-6 text-center">
            <div className="w-12 h-12 rounded-control bg-midnight-slate flex items-center justify-center ghost-border mx-auto">
              <Music size={22} className="text-white animate-pulse" />
            </div>
            
            <div className="space-y-2">
              <h1 className="font-editorial text-3xl md:text-4xl text-white font-bold tracking-tight">
                Welcome to Music4U
              </h1>
              <p className="caption-tech text-[10px] text-slate-hint uppercase tracking-widest">
                Curated Sonic Engine
              </p>
            </div>

            <p className="font-interface text-sm text-slate-hint max-w-md mx-auto leading-relaxed">
              Music4U leverages advanced auditory classifiers to map your acoustic profile. Choose how to initialize your listening preferences.
            </p>

            <div className="grid grid-cols-1 gap-4 pt-4 text-left">
              {/* Option A: Spotify Link */}
              <button 
                type="button"
                onClick={handleSpotifySync}
                className="group p-5 rounded-structural bg-surface-container-low/60 hover:bg-surface-container border border-steel-accent/15 hover:border-steel-accent/40 text-left transition-all relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="label-mono text-xs text-white uppercase tracking-wider font-semibold">Option 01: Connect Spotify</span>
                  <Sparkles size={16} className="text-slate-hint group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-interface text-sm font-bold text-white mb-1">Instant Synchronized Profile</h3>
                <p className="font-interface text-xs text-slate-hint leading-relaxed">
                  Handshake securely with Spotify to import your listening counts, favorite genres, and acoustic centroid coefficients.
                </p>
                <div className="absolute bottom-2 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] uppercase font-technical">
                  <span>Connect</span>
                  <ArrowRight size={10} />
                </div>
              </button>

              {/* Option B: Manual input */}
              <button 
                type="button"
                onClick={() => dispatch({ type: 'SET_STEP', payload: 'manual-form' })}
                className="group p-5 rounded-structural bg-surface-container-low/60 hover:bg-surface-container border border-steel-accent/15 hover:border-steel-accent/40 text-left transition-all relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="label-mono text-xs text-white uppercase tracking-wider font-semibold">Option 02: Manual Selection</span>
                  <Sliders size={16} className="text-slate-hint group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-interface text-sm font-bold text-white mb-1">Custom Auditory Inputs</h3>
                <p className="font-interface text-xs text-slate-hint leading-relaxed">
                  Specify your preferred BPM speeds, favorite keys, and mood parameters manually to custom-build your recommendation seed.
                </p>
                <div className="absolute bottom-2 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] uppercase font-technical">
                  <span>Configure</span>
                  <ArrowRight size={10} />
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Spotify Sync Loading Animation */}
        {step === 'spotify-syncing' && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative flex items-center justify-center">
              <Loader2 size={40} className="text-white animate-spin" />
              <div className="absolute w-12 h-12 border border-white/20 rounded-full animate-ping" />
            </div>

            <div className="space-y-2">
              <h2 className="font-editorial text-2xl text-white font-bold">Synchronizing...</h2>
              <p className="caption-tech text-[10px] text-slate-hint uppercase">Handshake Verification</p>
            </div>

            {/* Sync Logger terminal mockup */}
            <div className="w-full max-w-sm p-4 rounded bg-void-eclipse border border-steel-accent/20 text-left font-technical text-xs text-slate-hint h-24 overflow-hidden flex flex-col justify-end">
              <span className="text-white animate-pulse">&gt; {syncStatus || 'Initializing connection parameters...'}</span>
            </div>
          </div>
        )}

        {/* Step 3: Manual Input Form */}
        {step === 'manual-form' && (
          <form onSubmit={handleManualSubmit} className="space-y-6">
            <div>
              <h2 className="font-editorial text-2xl text-white font-bold">Configure Taste Vector</h2>
              <p className="caption-tech text-[10px] text-slate-hint uppercase">Manual Calibration</p>
            </div>

            {/* Favorite Genres (Multi-select) */}
            <div className="space-y-2">
              <span className="caption-tech text-[10px] text-slate-hint uppercase">Select Preferred Genres</span>
              <div className="flex flex-wrap gap-1.5">
                {['Pop', 'Electronic', 'Jazz', 'Indie', 'Psych-Rock', 'R&B'].map((genre) => {
                  const selected = selectedGenres.includes(genre);
                  return (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => toggleGenre(genre)}
                      className={`caption-tech text-[9px] uppercase px-3 py-1.5 rounded-full border transition-all ${
                        selected
                          ? 'bg-white text-void-eclipse border-white font-bold'
                          : 'bg-transparent text-slate-hint border-steel-accent/20 hover:border-steel-accent'
                      }`}
                    >
                      {genre}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preferred BPM speed */}
            <div className="space-y-2">
              <span className="caption-tech text-[10px] text-slate-hint uppercase">Preferred BPM Range</span>
              <div className="grid grid-cols-3 gap-2">
                {(['low', 'mid', 'high'] as const).map((bpm) => {
                  const label = { low: 'Low (<100)', mid: 'Mid (100-120)', high: 'High (>120)' }[bpm];
                  const selected = preferredBpm === bpm;
                  return (
                    <button
                      key={bpm}
                      type="button"
                      onClick={() => dispatch({ type: 'SET_PREFERRED_BPM', payload: bpm })}
                      className={`caption-tech text-[9px] uppercase px-2 py-2 rounded border transition-all ${
                        selected
                          ? 'bg-white/10 text-white border-white'
                          : 'bg-transparent text-slate-hint border-steel-accent/15 hover:border-steel-accent'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preferred Mood */}
            <div className="space-y-2">
              <span className="caption-tech text-[10px] text-slate-hint uppercase">Preferred Auditory Mood</span>
              <select
                value={preferredMood}
                onChange={(e) => dispatch({ type: 'SET_PREFERRED_MOOD', payload: e.target.value })}
                className="w-full bg-void-eclipse border border-steel-accent/20 rounded py-2 px-3 text-xs text-silver-mist focus:outline-none focus:border-white font-interface"
              >
                {['Dreamy', 'Chill', 'Energetic', 'Dark', 'Groovy', 'Introspective'].map((mood) => (
                  <option key={mood} value={mood}>{mood}</option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => dispatch({ type: 'SET_STEP', payload: 'options' })}
                className="px-4 py-2 border border-steel-accent/20 rounded-control text-xs text-slate-hint hover:text-white transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-white hover:bg-silver-mist text-void-eclipse rounded-control font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Submit Taste Schema</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
