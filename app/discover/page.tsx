'use client';

import React, { useState } from 'react';
import { useRecommendations } from '../_hooks/useRecommendations';
import TrackCard from '../_components/cards/TrackCard';
import ReasonChip from '../_components/recommendation/ReasonChip';
import { Disc, Layers, ListFilter } from 'lucide-react';

export default function DiscoverPage() {
  const { data: recommendations, isLoading, isError } = useRecommendations('user-123');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const moodsList = ['Dreamy', 'Chill', 'Energetic', 'Dark', 'Groovy', 'Introspective'];

  // Flatten mock recommendations from sections or get them directly
  const allRecs = recommendations || [];
  
  const filteredRecs = selectedMood 
    ? allRecs.filter(r => r.track.mood.includes(selectedMood))
    : allRecs;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-steel-accent/15 pb-6">
        <h1 className="display-hero text-white tracking-tight leading-none mb-4">
          Discover
        </h1>
        <p className="font-interface text-sm text-slate-hint max-w-xl">
          Deep-dive into the entire machine learning auditory output. Explore recommendations based on mathematical audio dimensions and mood characteristics.
        </p>
      </div>

      {/* Mood Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 text-slate-hint">
          <ListFilter size={14} />
          <span className="caption-tech text-xs uppercase font-semibold">Filter Auditory Mood:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedMood(null)}
            className={`caption-tech text-xs uppercase px-3 py-1 rounded-full border transition-all ${
              selectedMood === null
                ? 'bg-white text-void-eclipse border-white'
                : 'bg-transparent text-slate-hint border-steel-accent/30 hover:border-steel-accent hover:text-white'
            }`}
          >
            All Tracks
          </button>
          {moodsList.map((mood) => (
            <button
              key={mood}
              onClick={() => setSelectedMood(mood)}
              className={`caption-tech text-xs uppercase px-3 py-1 rounded-full border transition-all ${
                selectedMood === mood
                  ? 'bg-white text-void-eclipse border-white'
                  : 'bg-transparent text-slate-hint border-steel-accent/30 hover:border-steel-accent hover:text-white'
              }`}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Layout */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="h-[360px] bg-surface-container/30 rounded-structural border border-steel-accent/10" />
          ))}
        </div>
      ) : isError ? (
        <div className="p-8 text-center rounded-structural bg-surface-container/30 border border-error/20">
          <p className="font-interface text-sm text-error">Failed to fetch recommendations.</p>
        </div>
      ) : filteredRecs.length === 0 ? (
        <div className="p-12 text-center rounded-structural bg-surface-container/30 border border-steel-accent/20">
          <p className="font-interface text-sm text-slate-hint">No tracks matched the selected audio mood filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredRecs.map((rec) => (
            <div key={rec.id} className="flex flex-col justify-between">
              <TrackCard 
                track={rec.track} 
                variant="grid" 
                contextQueue={filteredRecs.map(r => r.track)}
              />
              <div className="mt-2 flex flex-wrap gap-1 items-center">
                {rec.signals.slice(0, 2).map((sig) => (
                  <ReasonChip key={sig} signal={sig} />
                ))}
                <span className="caption-tech text-[8px] ml-auto text-slate-hint font-technical">
                  {(rec.score * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
