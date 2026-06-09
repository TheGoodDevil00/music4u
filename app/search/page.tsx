'use client';

import React, { useState, useEffect } from 'react';
import { useSearch } from '../_hooks/useTracks';
import TrackCard from '../_components/cards/TrackCard';
import ArtistCard from '../_components/cards/ArtistCard';
import AlbumCard from '../_components/cards/AlbumCard';
import { Search, SlidersHorizontal, Check } from 'lucide-react';
import type { SearchFilters } from '../_lib/api/tracks';

export default function SearchPage() {
  const [inputValue, setInputValue] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'tracks' | 'artists' | 'albums'>('tracks');
  
  // Filters State
  const [genre, setGenre] = useState<string | undefined>(undefined);
  const [mood, setMood] = useState<string | undefined>(undefined);
  const [bpmRange, setBpmRange] = useState<'all' | 'low' | 'mid' | 'high'>('all');
  const [era, setEra] = useState<string | undefined>(undefined);
  const [showFilters, setShowFilters] = useState(false);

  // Debounce input value changes by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(inputValue);
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

  const genres = ['Pop', 'Alternative', 'Electronic', 'Jazz', 'Indie', 'Psych-Rock', 'R&B', 'Hip-Hop'];
  const moods = ['Dreamy', 'Chill', 'Energetic', 'Dark', 'Groovy', 'Introspective', 'Sensual', 'Melancholic'];
  const eras = ['1950s', '2000s', '2010s', '2020s'];

  const resultsCount = searchResults 
    ? {
        tracks: searchResults.tracks.length,
        artists: searchResults.artists.length,
        albums: searchResults.albums.length
      }
    : { tracks: 0, artists: 0, albums: 0 };

  const handleResetFilters = () => {
    setGenre(undefined);
    setMood(undefined);
    setBpmRange('all');
    setEra(undefined);
  };

  return (
    <div className="space-y-8">
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
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-surface-container-low border border-steel-accent/25 rounded-control py-3 pl-12 pr-4 text-white font-interface text-sm focus:outline-none focus:border-white transition-all"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
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
                      key={g}
                      onClick={() => setGenre(genre === g ? undefined : g)}
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
                      key={m}
                      onClick={() => setMood(mood === m ? undefined : m)}
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
                        key={range}
                        onClick={() => setBpmRange(range)}
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
                      key={e}
                      onClick={() => setEra(era === e ? undefined : e)}
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
            key={tab}
            onClick={() => setActiveTab(tab)}
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
