'use client';

import React, { useEffect, useReducer } from 'react';
import { useSearch } from '../_hooks/useTracks';
import TrackCard from '../_components/cards/TrackCard';
import ArtistCard from '../_components/cards/ArtistCard';
import AlbumCard from '../_components/cards/AlbumCard';
import { Search, SlidersHorizontal, Check } from 'lucide-react';
import type { SearchFilters } from '../_lib/api/tracks';


const genres = ['Pop', 'Alternative', 'Electronic', 'Jazz', 'Indie', 'Psych-Rock', 'R&B', 'Hip-Hop'];
const moods = ['Dreamy', 'Chill', 'Energetic', 'Dark', 'Groovy', 'Introspective', 'Sensual', 'Melancholic'];
const eras = ['1950s', '2000s', '2010s', '2020s'];

interface SearchState {
  inputValue: string;
  debouncedQuery: string;
  activeTab: 'tracks' | 'artists' | 'albums';
  genre: string | undefined;
  mood: string | undefined;
  bpmRange: 'all' | 'low' | 'mid' | 'high';
  era: string | undefined;
  showFilters: boolean;
}

type SearchAction =
  | { type: 'SET_INPUT_VALUE'; payload: string }
  | { type: 'SET_DEBOUNCED_QUERY'; payload: string }
  | { type: 'SET_ACTIVE_TAB'; payload: 'tracks' | 'artists' | 'albums' }
  | { type: 'TOGGLE_FILTERS' }
  | { type: 'SET_GENRE'; payload: string | undefined }
  | { type: 'SET_MOOD'; payload: string | undefined }
  | { type: 'SET_BPM_RANGE'; payload: 'all' | 'low' | 'mid' | 'high' }
  | { type: 'SET_ERA'; payload: string | undefined }
  | { type: 'RESET_FILTERS' };

const initialSearchState: SearchState = {
  inputValue: '',
  debouncedQuery: '',
  activeTab: 'tracks',
  genre: undefined,
  mood: undefined,
  bpmRange: 'all',
  era: undefined,
  showFilters: false
};

function searchReducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case 'SET_INPUT_VALUE':
      return { ...state, inputValue: action.payload };
    case 'SET_DEBOUNCED_QUERY':
      return { ...state, debouncedQuery: action.payload };
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'TOGGLE_FILTERS':
      return { ...state, showFilters: !state.showFilters };
    case 'SET_GENRE':
      return { ...state, genre: action.payload };
    case 'SET_MOOD':
      return { ...state, mood: action.payload };
    case 'SET_BPM_RANGE':
      return { ...state, bpmRange: action.payload };
    case 'SET_ERA':
      return { ...state, era: action.payload };
    case 'RESET_FILTERS':
      return {
        ...state,
        genre: undefined,
        mood: undefined,
        bpmRange: 'all',
        era: undefined
      };
    default:
      return state;
  }
}

export default function SearchPage() {
  const [state, dispatch] = useReducer(searchReducer, initialSearchState);
  const {
    inputValue,
    debouncedQuery,
    activeTab,
    genre,
    mood,
    bpmRange,
    era,
    showFilters
  } = state;

  // Debounce input value changes by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: 'SET_DEBOUNCED_QUERY', payload: inputValue });
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue]);

  // Construct filters object
  const filters: SearchFilters = {};
  if (genre) filters.genre = genre;
  if (mood) filters.mood = mood;
  if (era) filters.era = era;
  
  if (bpmRange === 'low') {
    filters.bpmMin = 0;
    filters.bpmMax = 99;
  } else if (bpmRange === 'mid') {
    filters.bpmMin = 100;
    filters.bpmMax = 120;
  } else if (bpmRange === 'high') {
    filters.bpmMin = 121;
    filters.bpmMax = 250;
  }

  const { data: searchResults, isLoading, isError } = useSearch(debouncedQuery, filters);

  const resultsCount = searchResults 
    ? {
        tracks: searchResults.tracks.length,
        artists: searchResults.artists.length,
        albums: searchResults.albums.length
      }
    : { tracks: 0, artists: 0, albums: 0 };

  const handleResetFilters = () => {
    dispatch({ type: 'RESET_FILTERS' });
  };

  return (
    <div className="space-y-8">
      <title>Search - Music4U</title>
      {/* Header & Search Bar */}
      <div className="border-b border-steel-accent/15 pb-6 space-y-6">
        <div>
          <h1 className="display-hero text-white tracking-tight leading-none mb-2">
            Search
          </h1>
          <p className="font-interface text-sm text-slate-hint">
            Query the recommendation matrix. Filter down by genres, musical BPM, recording era, and moods.
          </p>
        </div>

        {/* Input & Filter Trigger */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-hint">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search tracks, artists, or albums..."
              value={inputValue}
              onChange={(e) => dispatch({ type: 'SET_INPUT_VALUE', payload: e.target.value })}
              aria-label="Search query"
              className="w-full bg-surface-container-low border border-steel-accent/25 rounded-control py-3 pl-12 pr-4 text-white font-interface text-sm focus:outline-none focus:border-white transition-all"
            />
          </div>
          <button
            type="button"
            onClick={() => dispatch({ type: 'TOGGLE_FILTERS' })}
            className={`flex items-center gap-2 px-4 py-3 rounded-control border text-sm font-semibold transition-all ${
              showFilters || genre || mood || bpmRange !== 'all' || era
                ? 'bg-midnight-slate text-white border-steel-accent/50'
                : 'bg-transparent text-slate-hint border-steel-accent/20 hover:border-steel-accent hover:text-white'
            }`}
          >
            <SlidersHorizontal size={16} />
            <span>Filters</span>
          </button>
        </div>

        {/* Expanded Filters Drawer */}
        {showFilters && (
          <div className="p-6 rounded-structural bg-surface-container/30 border border-steel-accent/15 space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-steel-accent/10 pb-3">
              <span className="caption-tech text-xs uppercase font-bold text-white">Refine Recommendations</span>
              <button 
                type="button"
                onClick={handleResetFilters}
                className="caption-tech text-[10px] text-slate-hint hover:text-white uppercase transition-colors"
              >
                Clear All Filters
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Genre Filter */}
              <div className="space-y-2">
                <span className="caption-tech text-[10px] text-slate-hint uppercase">Genre</span>
                <div className="flex flex-wrap gap-1.5">
                  {genres.map((g) => (
                    <button
                      type="button"
                      key={g}
                      onClick={() => dispatch({ type: 'SET_GENRE', payload: genre === g ? undefined : g })}
                      className={`caption-tech text-[9px] uppercase px-2.5 py-1 rounded-full border transition-all ${
                        genre === g
                          ? 'bg-white text-void-eclipse border-white font-bold'
                          : 'bg-transparent text-slate-hint border-steel-accent/20 hover:border-steel-accent'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mood Filter */}
              <div className="space-y-2">
                <span className="caption-tech text-[10px] text-slate-hint uppercase">Mood</span>
                <div className="flex flex-wrap gap-1.5">
                  {moods.map((m) => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => dispatch({ type: 'SET_MOOD', payload: mood === m ? undefined : m })}
                      className={`caption-tech text-[9px] uppercase px-2.5 py-1 rounded-full border transition-all ${
                        mood === m
                          ? 'bg-white text-void-eclipse border-white font-bold'
                          : 'bg-transparent text-slate-hint border-steel-accent/20 hover:border-steel-accent'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* BPM Range Filter */}
              <div className="space-y-2">
                <span className="caption-tech text-[10px] text-slate-hint uppercase">BPM Speed</span>
                <div className="flex flex-col gap-1.5">
                  {(['all', 'low', 'mid', 'high'] as const).map((range) => {
                    const label = {
                      all: 'All BPM',
                      low: 'Low (< 100 BPM)',
                      mid: 'Mid (100 - 120 BPM)',
                      high: 'High (> 120 BPM)'
                    }[range];
                    return (
                      <button
                        type="button"
                        key={range}
                        onClick={() => dispatch({ type: 'SET_BPM_RANGE', payload: range })}
                        className={`caption-tech text-[9px] text-left uppercase px-3 py-2 rounded border transition-all flex justify-between items-center ${
                          bpmRange === range
                            ? 'bg-white/10 text-white border-white'
                            : 'bg-transparent text-slate-hint border-steel-accent/15 hover:border-steel-accent'
                        }`}
                      >
                        <span>{label}</span>
                        {bpmRange === range && <Check size={10} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Era Filter */}
              <div className="space-y-2">
                <span className="caption-tech text-[10px] text-slate-hint uppercase">Release Era</span>
                <div className="flex flex-wrap gap-1.5">
                  {eras.map((e) => (
                    <button
                      type="button"
                      key={e}
                      onClick={() => dispatch({ type: 'SET_ERA', payload: era === e ? undefined : e })}
                      className={`caption-tech text-[9px] uppercase px-2.5 py-1 rounded-full border transition-all ${
                        era === e
                          ? 'bg-white text-void-eclipse border-white font-bold'
                          : 'bg-transparent text-slate-hint border-steel-accent/20 hover:border-steel-accent'
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-steel-accent/10">
        {(['tracks', 'artists', 'albums'] as const).map((tab) => (
          <button
            type="button"
            key={tab}
            onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab })}
            className={`caption-tech text-xs uppercase px-6 py-3 border-b-2 font-semibold transition-all relative ${
              activeTab === tab
                ? 'border-white text-white font-bold'
                : 'border-transparent text-slate-hint hover:text-white'
            }`}
          >
            <span>{tab}</span>
            <span className="ml-1.5 px-1.5 py-0.2 text-[8px] bg-steel-accent/25 rounded-full text-slate-hint font-technical">
              {resultsCount[tab]}
            </span>
          </button>
        ))}
      </div>

      {/* Results Display */}
      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-16 bg-surface-container/20 rounded border border-steel-accent/10" />
          ))}
        </div>
      ) : isError ? (
        <div className="p-8 text-center rounded-structural bg-surface-container/30 border border-error/20">
          <p className="font-interface text-sm text-error">Search server synchronization error.</p>
        </div>
      ) : (
        <div className="min-h-[300px]">
          {/* Tracks Tab */}
          {activeTab === 'tracks' && (
            searchResults?.tracks.length === 0 ? (
              <p className="text-sm text-slate-hint py-8 text-center">No track results match the search parameters.</p>
            ) : (
              <div className="space-y-2">
                {searchResults?.tracks.map((track, i) => (
                  <TrackCard 
                    key={track.id} 
                    track={track} 
                    variant="list" 
                    index={i} 
                    contextQueue={searchResults.tracks}
                  />
                ))}
              </div>
            )
          )}

          {/* Artists Tab */}
          {activeTab === 'artists' && (
            searchResults?.artists.length === 0 ? (
              <p className="text-sm text-slate-hint py-8 text-center">No artist results match the search parameters.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {searchResults?.artists.map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </div>
            )
          )}

          {/* Albums Tab */}
          {activeTab === 'albums' && (
            searchResults?.albums.length === 0 ? (
              <p className="text-sm text-slate-hint py-8 text-center">No album results match the search parameters.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {searchResults?.albums.map((album) => (
                  <AlbumCard key={album.id} album={album} />
                ))}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
