'use client';

import React from 'react';
import { useRecommendations } from './_hooks/useRecommendations';
import RecommendationFeed from './_components/recommendation/RecommendationFeed';
import { mockRecommendationSections } from './_lib/mock/recommendations';
import { Disc, Activity, RefreshCw } from 'lucide-react';
import Link from 'next/link';
export default function HomePage() {
  const { data: sections, isLoading, isError, refetch } = useRecommendations('user-123');

  return (
    <div className="space-y-12">
      <title>Music4U - Curated Sonic Engine</title>
      {/* Editorial Hero Banner */}
      <section className="relative py-12 md:py-20 border-b border-steel-accent/10 overflow-hidden">
        {/* Subtle decorative grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(58,79,99,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(58,79,99,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="caption-tech text-xs text-slate-hint uppercase tracking-widest">System Status: Active</span>
          </div>
          
          <h1 className="display-hero text-white tracking-tight leading-none">
            Music4U
          </h1>
          <p className="headline-lg text-silver-mist uppercase font-bold max-w-2xl leading-none">
            CURATED SONIC ENGINE.
          </p>
          
          <p className="font-interface text-sm md:text-base text-slate-hint max-w-xl leading-relaxed">
            Welcome to Music4U. An advanced machine learning model has analyzed your auditory signals—mapping danceability, spectral centroid, and temporal rhythm—to craft these editorial recommendation layers.
          </p>

          {/* Quick Metrics Dashboard */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 max-w-3xl">
            <div className="p-4 rounded-control bg-surface-container/20 border border-steel-accent/15">
              <span className="caption-tech text-[10px] text-slate-hint block mb-1">ACCURACY INDEX</span>
              <span className="font-technical text-lg font-bold text-white">98.4%</span>
            </div>
            <div className="p-4 rounded-control bg-surface-container/20 border border-steel-accent/15">
              <span className="caption-tech text-[10px] text-slate-hint block mb-1">SIGNAL BPM MEAN</span>
              <span className="font-technical text-lg font-bold text-white">114 BPM</span>
            </div>
            <div className="p-4 rounded-control bg-surface-container/20 border border-steel-accent/15">
              <span className="caption-tech text-[10px] text-slate-hint block mb-1">GENRE SPECTRUM</span>
              <span className="font-technical text-lg font-bold text-white">5 Active</span>
            </div>
            <div className="p-4 rounded-control bg-surface-container/20 border border-steel-accent/15">
              <span className="caption-tech text-[10px] text-slate-hint block mb-1">LATENCY STATE</span>
              <span className="font-technical text-lg font-bold text-white">Optimal</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Recommendations Feed */}
      <div>
        {isLoading ? (
          /* Skeleton Loader */
          <div className="space-y-12 animate-pulse">
            {[1, 2].map((s) => (
              <div key={s} className="space-y-4">
                <div className="h-8 bg-surface-container-high rounded w-1/4" />
                <div className="h-4 bg-surface-container rounded w-1/3" />
                <div className="flex gap-4 overflow-x-hidden pt-4">
                  {[1, 2, 3, 4].map((c) => (
                    <div key={c} className="w-[240px] h-[340px] bg-surface-container/30 rounded-structural flex-shrink-0 border border-steel-accent/10" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="p-8 text-center rounded-structural bg-surface-container/40 border border-error/20 max-w-xl mx-auto space-y-4">
            <p className="font-interface text-sm text-error">Failed to synchronize auditory profile with recommendation servers.</p>
            <button 
              type="button"
              onClick={() => refetch()}
              className="px-4 py-2 bg-midnight-slate text-white rounded-control text-xs font-semibold hover:bg-midnight-slate/80 transition-all flex items-center gap-2 mx-auto"
            >
              <RefreshCw size={12} /> Retry Profile Synch
            </button>
          </div>
        ) : (
          <RecommendationFeed sections={mockRecommendationSections} />
        )}
      </div>
    </div>
  );
}
