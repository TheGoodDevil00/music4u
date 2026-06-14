'use client';

import React from 'react';
import type { Track } from '../../_types/track';
import { useUserStore } from '../../_store/userStore';
import { Play, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface TrackCardProps {
  track: Track;
  variant?: 'grid' | 'list' | 'row';
  index?: number; // useful for lists (e.g. #1, #2)
  contextQueue?: Track[];
}

const formatDuration = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export default function TrackCard({ track, variant = 'grid', index }: TrackCardProps) {
  const { likedTrackIds, toggleLikeTrack } = useUserStore();
  const isLiked = likedTrackIds.includes(track.id);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(`https://open.spotify.com/track/${track.id}`, '_blank');
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLikeTrack(track.id);
  };

  if (variant === 'list') {
    // High-density table/list row
    return (
      <div 
        onClick={handlePlayClick}
        className="flex items-center gap-4 p-2.5 rounded-control transition-all duration-200 cursor-pointer group hover:bg-surface-container-low border border-transparent"
      >
        {/* Index or Play icon */}
        <div className="w-8 flex items-center justify-center flex-shrink-0">
          <span className="group-hover:hidden text-slate-hint font-technical text-xs">
            {index !== undefined ? index + 1 : ''}
          </span>
          <button 
            type="button"
            className="hidden group-hover:flex text-white hover:scale-110 active:scale-95 transition-transform bg-transparent border-none p-0 cursor-pointer outline-none"
            aria-label="Play on Spotify"
          >
            <Play size={14} className="translate-x-[0.5px]" fill="currentColor" />
          </button>
        </div>

        {/* Thumbnail and Info */}
        <div className="relative w-10 h-10 rounded-control overflow-hidden ghost-border flex-shrink-0">
          <Image
            src={track.albumArtUrl}
            alt={track.albumTitle}
            fill
            sizes="40px"
            className="object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <Link 
            href={`/track/${track.id}`} 
            className="font-interface text-sm font-semibold text-white truncate hover:underline block"
            onClick={(e) => e.stopPropagation()}
          >
            {track.title}
          </Link>
          <div className="flex items-center gap-2">
            <Link 
              href={`/artist/${track.artistId}`} 
              className="font-interface text-xs text-slate-hint truncate hover:underline block"
              onClick={(e) => e.stopPropagation()}
            >
              {track.artistName}
            </Link>
          </div>
        </div>

        {/* Album title (hidden on small devices) */}
        <div className="hidden md:block w-1/4 truncate text-xs text-slate-hint font-interface">
          <Link 
            href={`/album/${track.albumId}`} 
            className="hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {track.albumTitle}
          </Link>
        </div>

        {/* Audio features / Metadata badges */}
        <div className="hidden lg:flex items-center gap-3">
          <span className="caption-tech text-[10px] text-slate-hint uppercase bg-steel-accent/10 px-2 py-0.5 rounded-full border border-steel-accent/20">
            {track.bpm} BPM
          </span>
          <span className="caption-tech text-[10px] text-slate-hint uppercase bg-midnight-slate/10 px-2 py-0.5 rounded-full border border-midnight-slate/20">
            {track.key}
          </span>
        </div>

        {/* Heart Icon & Duration */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <button 
            type="button"
            onClick={handleLikeClick}
            className={`opacity-0 group-hover:opacity-100 focus:opacity-100 hover:text-white transition-opacity cursor-pointer bg-transparent border-none p-0 flex items-center justify-center outline-none ${
              isLiked ? 'opacity-100 text-white' : 'text-slate-hint'
            }`}
            aria-label={isLiked ? "Unlike track" : "Like track"}
          >
            <Heart size={14} fill={isLiked ? 'white' : 'none'} />
          </button>
          <span className="font-technical text-xs text-slate-hint w-10 text-right">
            {formatDuration(track.durationMs)}
          </span>
        </div>
      </div>
    );
  }

  // Row Layout: similar to list but more compact (used in quick recommendations or queue list)
  if (variant === 'row') {
    return (
      <button 
        type="button"
        onClick={handlePlayClick}
        className="flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors w-full text-left hover:bg-surface-container-low/60"
      >
        <div className="relative w-10 h-10 rounded overflow-hidden ghost-border flex-shrink-0">
          <Image src={track.albumArtUrl} alt={track.title} fill sizes="40px" className="object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
            <Play size={14} className="text-white translate-x-[0.5px]" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-interface text-xs font-semibold text-white truncate">{track.title}</p>
          <p className="font-interface text-[10px] text-slate-hint truncate">{track.artistName}</p>
        </div>
        <div className="text-right flex items-center gap-2">
          <span className="caption-tech text-[8px] px-1 py-0.2 rounded bg-steel-accent/20 text-silver-mist">{track.key}</span>
          <span className="font-technical text-[10px] text-slate-hint">{formatDuration(track.durationMs)}</span>
        </div>
      </button>
    );
  }

  // Default: Grid Card (Card-based discovery feeds)
  return (
    <div 
      onClick={handlePlayClick}
      className="group rounded-structural bg-surface-container/40 p-4 border border-steel-accent/15 hover:border-steel-accent/30 transition-all duration-300 cursor-pointer flex flex-col relative overflow-hidden h-full"
    >
      {/* Cover Image Container */}
      <div className="relative aspect-square w-full rounded-lg overflow-hidden ghost-border mb-4">
        <Image
          src={track.albumArtUrl}
          alt={track.title}
          fill
          sizes="(max-width: 768px) 100vw, 300px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Play Button overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 focus-within:opacity-100 flex items-center justify-center transition-all duration-300">
          <button
            type="button"
            className="w-12 h-12 bg-white text-void-eclipse rounded-full flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
            aria-label="Play on Spotify"
          >
            <Play size={20} className="translate-x-[1px]" fill="currentColor" />
          </button>
        </div>

        {/* BPM & Key Floating Badges */}
        <div className="absolute bottom-2 left-2 right-2 flex justify-between pointer-events-none transition-opacity duration-300 opacity-90 group-hover:opacity-100">
          <span className="caption-tech text-[9px] bg-void-eclipse/90 backdrop-blur-md text-silver-mist px-2 py-0.5 rounded-full border border-steel-accent/30">
            {track.bpm} BPM
          </span>
          <span className="caption-tech text-[9px] bg-void-eclipse/90 backdrop-blur-md text-silver-mist px-2 py-0.5 rounded-full border border-steel-accent/30">
            {track.key}
          </span>
        </div>
      </div>

      {/* Track info details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <Link 
            href={`/track/${track.id}`} 
            className="font-interface text-sm font-semibold text-white tracking-tight hover:underline block truncate mb-1"
            onClick={(e) => e.stopPropagation()}
          >
            {track.title}
          </Link>
          <Link 
            href={`/artist/${track.artistId}`}
            className="font-interface text-xs text-slate-hint hover:underline block truncate"
            onClick={(e) => e.stopPropagation()}
          >
            {track.artistName}
          </Link>
        </div>

        {/* Footer controls: Like button and duration */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-steel-accent/10">
          <span className="font-technical text-[10px] text-slate-hint uppercase">
            {track.genre[0]}
          </span>
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={handleLikeClick}
              className={`hover:text-white transition-colors ${isLiked ? 'text-white' : 'text-slate-hint'}`}
            >
              <Heart size={14} fill={isLiked ? 'white' : 'none'} />
            </button>
            <span className="font-technical text-[10px] text-slate-hint">
              {formatDuration(track.durationMs)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
