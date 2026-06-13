'use client';

import React from 'react';
import { useUserProfile } from '../_hooks/useUsers';
import { useUserStore } from '../_store/userStore';
import { mockTracks } from '../_lib/mock/tracks';
import TrackCard from '../_components/cards/TrackCard';
import ArtistCard from '../_components/cards/ArtistCard';
import { Heart, History, User2, Sliders, Music } from 'lucide-react';
import Image from 'next/image';


export default function ProfilePage() {
  const { data: profile, isLoading, isError } = useUserProfile('user-123');
  
  // Connect with Client Store for local updates
  const { likedTrackIds, listeningHistoryIds, clearHistory } = useUserStore();

  // Combine static mock tracks and Spotify-synced tracks for full lookup resolution
  const allKnownTracks = [
    ...mockTracks,
    ...(profile?.listeningHistory || [])
  ].filter((t, idx, self) => self.findIndex(x => x.id === t.id) === idx);

  const likedTracks = allKnownTracks.filter(t => likedTrackIds.includes(t.id));
  
  // If the user has local store history, map it. Otherwise, fall back to the Spotify history.
  const historyTracks = listeningHistoryIds.length > 0
    ? listeningHistoryIds
        .map(id => allKnownTracks.find(t => t.id === id))
        .filter((t): t is typeof mockTracks[0] => !!t)
    : profile?.listeningHistory || [];

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-64 bg-surface-container/30 rounded-structural border border-steel-accent/15" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-48 bg-surface-container rounded" />
          <div className="h-48 bg-surface-container rounded" />
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="p-8 text-center rounded-structural bg-surface-container/30 border border-error/20">
        <p className="font-interface text-sm text-error">Failed to load taste profile data sheet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <title>Taste Profile - Music4U</title>
      {/* Editorial Profile Header */}
      <section className="relative rounded-structural bg-gradient-to-r from-surface-container-low to-void-eclipse border border-steel-accent/15 overflow-hidden p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center md:items-end">
        {/* Glow backlight */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-midnight-slate/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-36 h-36 rounded-full overflow-hidden ghost-border flex-shrink-0">
          <Image
            src={profile.avatarUrl}
            alt={profile.name}
            fill
            sizes="144px"
            className="object-cover"
          />
        </div>

        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-slate-hint">
            <User2 size={14} className="text-white" />
            <span className="caption-tech text-[10px] uppercase font-bold text-white tracking-widest">TACTICAL TASTE SPECTRUM</span>
          </div>

          <h1 className="font-editorial text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            {profile.name}
          </h1>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-xs">
            <div className="flex items-center gap-1.5 text-slate-hint">
              <Heart size={14} fill="white" className="text-white" />
              <span className="font-technical text-white">{likedTrackIds.length} Saved Signals</span>
            </div>
            
            <div className="flex items-center gap-1.5 text-slate-hint">
              <History size={14} />
              <span className="font-technical">{listeningHistoryIds.length} Recent Interactions</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-hint">
              <Sliders size={14} />
              <span className="font-technical">Avg: {profile.tasteProfile.averageBpm} BPM ({profile.tasteProfile.preferredKey})</span>
            </div>
          </div>
        </div>
      </section>

      {/* Taste Summary Visualizers */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Genre Bar Charts (SVG rendered) */}
        <div className="p-6 rounded-structural bg-surface-container/20 border border-steel-accent/15 space-y-6">
          <div>
            <span className="caption-tech text-[10px] text-slate-hint uppercase">Genre Distribution</span>
            <h3 className="font-editorial text-lg text-white font-bold mt-1">Acoustic Centroid Metrics</h3>
          </div>
          
          <div className="space-y-4">
            {profile.tasteProfile.topGenres.map((g) => (
              <div key={g.genre} className="space-y-1">
                <div className="flex justify-between text-xs font-interface">
                  <span className="text-white font-medium">{g.genre}</span>
                  <span className="text-slate-hint font-technical">{g.weight}%</span>
                </div>
                <div className="w-full bg-steel-accent/20 h-1.5 rounded-full">
                  <div 
                    className="bg-white h-1.5 rounded-full transition-all duration-500" 
                    style={{ width: `${g.weight}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Favorite Artists */}
        <div className="p-6 rounded-structural bg-surface-container/20 border border-steel-accent/15 space-y-6">
          <div>
            <span className="caption-tech text-[10px] text-slate-hint uppercase">Top Artists</span>
            <h3 className="font-editorial text-lg text-white font-bold mt-1">Primary Node Weights</h3>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {profile.tasteProfile.topArtists.slice(0, 3).map((artist) => (
              <div key={artist.id} className="text-center space-y-2 group">
                <div className="relative w-16 h-16 rounded-full overflow-hidden ghost-border mx-auto">
                  <Image 
                    src={artist.imageUrl} 
                    alt={artist.name} 
                    fill 
                    sizes="64px"
                    className="object-cover transition-transform group-hover:scale-105" 
                  />
                </div>
                <p className="font-interface text-[11px] font-semibold text-white truncate group-hover:underline">
                  {artist.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Liked Tracks Schema */}
      <section className="space-y-5">
        <div className="border-b border-steel-accent/15 pb-2.5">
          <h2 className="section-header text-white font-bold tracking-tight">
            Saved Signals
          </h2>
          <p className="font-interface text-xs text-slate-hint mt-1">
            Tracks you have marked positive feedback to refine the ML model.
          </p>
        </div>

        {likedTracks.length === 0 ? (
          <div className="p-8 text-center bg-surface-container/20 rounded-structural border border-steel-accent/10">
            <p className="text-sm text-slate-hint">No saved tracks. Browse recommendations to save signals.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {likedTracks.map((track, i) => (
              <TrackCard 
                key={track.id} 
                track={track} 
                variant="list" 
                index={i}
                contextQueue={likedTracks}
              />
            ))}
          </div>
        )}
      </section>

      {/* Local Listening History */}
      <section className="space-y-5">
        <div className="border-b border-steel-accent/15 pb-2.5 flex justify-between items-end">
          <div>
            <h2 className="section-header text-white font-bold tracking-tight">
              Interaction Log
            </h2>
            <p className="font-interface text-xs text-slate-hint mt-1">
              Sequence of your recent playback events.
            </p>
          </div>
          {historyTracks.length > 0 && (
            <button 
              type="button"
              onClick={clearHistory}
              className="caption-tech text-[10px] text-slate-hint hover:text-white uppercase transition-colors"
            >
              Clear Log
            </button>
          )}
        </div>

        {historyTracks.length === 0 ? (
          <div className="p-8 text-center bg-surface-container/20 rounded-structural border border-steel-accent/10">
            <p className="text-sm text-slate-hint">No recent interactions. Play tracks to populate this log.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {historyTracks.slice(0, 10).map((track, i) => (
              <TrackCard 
                key={`${track.id}-${i}`} 
                track={track} 
                variant="list" 
                index={i}
                contextQueue={historyTracks}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
