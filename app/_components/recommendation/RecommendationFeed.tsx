'use client';

import React from 'react';
import type { RecommendationSection } from '../../_types/recommendation';
import TrackCard from '../cards/TrackCard';
import ReasonChip from './ReasonChip';
import Link from 'next/link';

interface RecommendationFeedProps {
  sections: RecommendationSection[];
}

export default function RecommendationFeed({ sections }: RecommendationFeedProps) {
  return (
    <div className="space-y-12">
      {sections.map((section) => (
        <section key={section.id} className="relative">
          {/* Section Header */}
          <div className="flex items-end justify-between mb-5 border-b border-steel-accent/15 pb-2.5">
            <div>
              <h2 className="section-header text-white font-bold tracking-tight mb-1">
                {section.title}
              </h2>
              {section.description && (
                <p className="font-interface text-xs text-slate-hint">
                  {section.description}
                </p>
              )}
            </div>
            <Link 
              href="/discover" 
              className="caption-tech text-xs text-slate-hint hover:text-white uppercase tracking-wider transition-colors hover:underline"
            >
              See all
            </Link>
          </div>

          {/* Horizontal scroll slider */}
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin snap-x scroll-smooth -mx-4 px-4 md:-mx-0 md:px-0">
            {section.recommendations.map((rec) => (
              <div 
                key={rec.id} 
                className="w-[200px] md:w-[240px] flex-shrink-0 snap-start"
              >
                <div className="h-full flex flex-col justify-between">
                  <TrackCard 
                    track={rec.track} 
                    variant="grid" 
                    contextQueue={section.recommendations.map(r => r.track)}
                  />
                  {/* Signals badge display below track details (or inside the card) */}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {rec.signals.slice(0, 2).map((sig) => (
                      <ReasonChip key={sig} signal={sig} />
                    ))}
                    <span className="caption-tech text-[8px] ml-auto text-slate-hint flex items-center font-technical">
                      {(rec.score * 100).toFixed(0)}% Match
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
