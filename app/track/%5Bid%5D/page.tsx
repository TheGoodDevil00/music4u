'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useTrack, useSimilarTracks } from '../../_hooks/useTracks';
import { usePlayerStore } from '../../_store/playerStore';
import TrackCard from '../../_components/cards/TrackCard';
import { Play, Plus, Check, Clock, Radio, Activity, Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';


const formatDuration = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export default function TrackDetailPage() {
  const params = useParams();
  const trackId = params.id as string;

  const { data: track, isLoading: trackLoading, isError: trackError } = useTrack(trackId);
  const { data: similarTracks, isLoading: similarLoading } = useSimilarTracks(trackId);
  
  const { currentTrack, isPlaying, playTrack, togglePlay, addToQueue, queue } = usePlayerStore();

  const isCurrent = currentTrack?.id === trackId;
  const isCurrentlyPlaying = isCurrent && isPlaying;
  const isInQueue = queue.some(t => t.id === trackId);

  const handlePlayClick = () => {
    if (!track) return;
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(track);
    }
  };

  const handleQueueClick = () => {
    if (!track) return;
    addToQueue(track);
  };

  if (trackLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-64 bg-surface-container/30 rounded-structural border border-steel-accent/15" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-24 bg-surface-container rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (trackError || !track) {
    return (
      <div className="p-8 text-center rounded-structural bg-surface-container/30 border border-error/20">
        <p className="font-interface text-sm text-error">Failed to synchronize track data with recommendation servers.</p>
      </div>
    );
  }


  return (
    <div className="space-y-12">
      <title>Track - Music4U</title>
      {/* Editorial Header */}
      <section className="relative rounded-structural bg-gradient-to-r from-surface-container-low to-void-eclipse border border-steel-accent/15 overflow-hidden p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center md:items-end">
        {/* Glow backlight */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-midnight-slate/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-48 h-48 rounded-lg overflow-hidden ghost-border flex-shrink-0">
          <Image
            src={track.albumArtUrl}
            alt={track.title}
            fill
            priority
            sizes="192px"
            className="object-cover"
          />
        </div>

        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-slate-hint">
            <Radio size={14} className="text-white animate-pulse" />
            <span className="caption-tech text-[10px] uppercase font-bold text-white tracking-widest">TRACK PROFILE SCHEMATIC</span>
          </div>

          <h1 className="font-editorial text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            {track.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs">
            <Link 
              href={`/artist/${track.artistId}`}
              className="font-interface text-sm font-semibold text-white hover:underline block"
            >
              {track.artistName}
            </Link>
            
            <span className="text-slate-hint">•</span>

            <Link 
              href={`/album/${track.albumId}`}
              className="font-interface text-xs text-slate-hint hover:underline block"
            >
              {track.albumTitle}
            </Link>

            <span className="text-slate-hint">•</span>

            <div className="flex items-center gap-1.5 text-slate-hint">
              <Clock size={12} />
              <span className="font-technical">{formatDuration(track.durationMs)}</span>
            </div>

            <span className="text-slate-hint">•</span>

            <span className="font-technical text-slate-hint">{track.releaseYear}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
            <button
              type="button"
              onClick={handlePlayClick}
              className="px-6 py-2.5 bg-white hover:bg-silver-mist text-void-eclipse rounded-control font-semibold text-xs flex items-center gap-2 transition-all hover:scale-103 shadow shadow-white/5"
            >
              <Play size={12} fill="currentColor" />
              <span>{isCurrentlyPlaying ? 'Pause Playback' : 'Play Track'}</span>
            </button>
            
            <button
              type="button"
              onClick={handleQueueClick}
              disabled={isInQueue}
              className={`px-6 py-2.5 rounded-control font-semibold text-xs flex items-center gap-2 border transition-all ${
                isInQueue
                  ? 'border-steel-accent/40 text-slate-hint cursor-default bg-steel-accent/5'
                  : 'border-steel-accent/30 text-silver-mist hover:border-white hover:bg-surface-container-low active:scale-97'
              }`}
            >
              {isInQueue ? <Check size={12} /> : <Plus size={12} />}
              <span>{isInQueue ? 'Added to Queue' : 'Queue Track'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Audio Features Analysis Dashboard */}
      <section className="space-y-6">
        <div className="border-b border-steel-accent/15 pb-2.5">
          <h2 className="section-header text-white font-bold tracking-tight">
            Acoustic Dimensions
          </h2>
          <p className="font-interface text-xs text-slate-hint mt-1">
            Quantitative analysis generated by the recommendation classifier model.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* BPM Card */}
          <div className="p-5 rounded-structural bg-surface-container/20 border border-steel-accent/15 flex flex-col justify-between">
            <span className="caption-tech text-[10px] text-slate-hint uppercase">BPM Speed</span>
            <div className="py-4">
              <span className="font-technical text-3xl font-bold text-white">{track.bpm}</span>
            </div>
            <span className="font-interface text-[10px] text-slate-hint">Beats per minute. Tracks temporal density.</span>
          </div>

          {/* Key Card */}
          <div className="p-5 rounded-structural bg-surface-container/20 border border-steel-accent/15 flex flex-col justify-between">
            <span className="caption-tech text-[10px] text-slate-hint uppercase">Musical Key</span>
            <div className="py-4">
              <span className="font-technical text-3xl font-bold text-white uppercase">{track.key}</span>
            </div>
            <span className="font-interface text-[10px] text-slate-hint">Tonal center. Tracks harmonics overlap.</span>
          </div>

          {/* Energy Card */}
          <div className="p-5 rounded-structural bg-surface-container/20 border border-steel-accent/15 flex flex-col justify-between space-y-4">
            <div className="flex justify-between items-center">
              <span className="caption-tech text-[10px] text-slate-hint uppercase">Energy</span>
              <span className="font-technical text-xs font-bold text-white">{(track.energy * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-steel-accent/25 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full" 
                style={{ width: `${track.energy * 100}%` }}
              />
            </div>
            <span className="font-interface text-[10px] text-slate-hint block">Spectral intensity, noise, and drive.</span>
          </div>

          {/* Danceability Card */}
          <div className="p-5 rounded-structural bg-surface-container/20 border border-steel-accent/15 flex flex-col justify-between space-y-4">
            <div className="flex justify-between items-center">
              <span className="caption-tech text-[10px] text-slate-hint uppercase">Danceability</span>
              <span className="font-technical text-xs font-bold text-white">{(track.danceability * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-steel-accent/25 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full" 
                style={{ width: `${track.danceability * 100}%` }}
              />
            </div>
            <span className="font-interface text-[10px] text-slate-hint block">Rhythmic regularity, strength, and groove.</span>
          </div>
        </div>
      </section>

      {/* Similar Tracks */}
      <section className="space-y-5">
        <div className="border-b border-steel-accent/15 pb-2.5">
          <h2 className="section-header text-white font-bold tracking-tight">
            Vector Neighbors
          </h2>
          <p className="font-interface text-xs text-slate-hint mt-1">
            Tracks sharing matching audio signatures.
          </p>
        </div>

        {similarLoading ? (
          <div className="space-y-2 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-14 bg-surface-container/20 rounded" />
            ))}
          </div>
        ) : !similarTracks || similarTracks.length === 0 ? (
          <p className="text-sm text-slate-hint">No close neighbors found.</p>
        ) : (
          <div className="space-y-2">
            {similarTracks.map((simTrack, i) => (
              <TrackCard 
                key={simTrack.id} 
                track={simTrack} 
                variant="list" 
                index={i}
                contextQueue={similarTracks}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
