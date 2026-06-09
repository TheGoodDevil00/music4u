'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePlayerStore } from '../../_store/playerStore';
import { useUserStore } from '../../_store/userStore';
import { 
  Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, 
  Shuffle, Repeat, Heart, ListMusic, Maximize2, Activity
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const formatTime = (ms: number) => {
  if (isNaN(ms) || ms < 0) return '0:00';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export default function PlayerBar() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const {
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    progress,
    duration,
    isShuffle,
    isRepeat,
    togglePlay,
    setPlaying,
    nextTrack,
    prevTrack,
    setVolume,
    toggleMute,
    setProgress,
    setDuration,
    toggleShuffle,
    toggleRepeat,
  } = usePlayerStore();

  const { likedTrackIds, toggleLikeTrack } = useUserStore();
  const isLiked = currentTrack ? likedTrackIds.includes(currentTrack.id) : false;

  // Initialize and synchronize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime * 1000);
    };

    const handleDurationChange = () => {
      setDuration(audio.duration * 1000);
    };

    const handleEnded = () => {
      if (isRepeat === 'one') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        nextTrack();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [setProgress, setDuration, nextTrack, isRepeat]);

  // Sync track src and playing state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    const isSameTrack = audio.src === currentTrack.previewUrl;
    if (!isSameTrack) {
      audio.src = currentTrack.previewUrl || '';
      audio.load();
      useUserStore.getState().addToHistory(currentTrack.id);
    }

    if (isPlaying) {
      audio.play().catch(() => {
        // Fallback for autoplay blocks
        setPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [currentTrack, isPlaying, setPlaying]);

  // Sync volume and mute state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
    audio.muted = isMuted;
  }, [volume, isMuted]);

  if (!currentTrack) return null;


  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekMs = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = seekMs / 1000;
    }
    setProgress(seekMs);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 bg-void-eclipse/95 backdrop-blur-md border-t border-steel-accent/35 flex items-center justify-between px-6 z-50 text-silver-mist shadow-lg shadow-black">
      {/* Left Section: Track Info */}
      <div className="flex items-center gap-4 w-1/4 min-w-[200px]">
        <div className="relative w-14 h-14 rounded-control overflow-hidden ghost-border flex-shrink-0">
          <Image
            src={currentTrack.albumArtUrl}
            alt={currentTrack.albumTitle}
            fill
            sizes="56px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <Link href={`/track/${currentTrack.id}`} className="font-interface text-sm font-semibold text-white truncate hover:underline block">
            {currentTrack.title}
          </Link>
          <Link href={`/artist/${currentTrack.artistId}`} className="font-interface text-xs text-slate-hint truncate hover:underline block">
            {currentTrack.artistName}
          </Link>
        </div>
        <button 
          onClick={() => toggleLikeTrack(currentTrack.id)}
          className={`p-2 hover:bg-surface-container/50 rounded-full transition-all group ${
            isLiked ? 'text-white' : 'text-slate-hint hover:text-white'
          }`}
        >
          <Heart size={18} fill={isLiked ? 'white' : 'none'} className="transition-transform group-active:scale-90" />
        </button>
      </div>

      {/* Middle Section: Player Controls & Progress */}
      <div className="flex flex-col items-center gap-2 flex-1 max-w-[600px] w-2/4">
        {/* Buttons */}
        <div className="flex items-center gap-5">
          <button 
            onClick={toggleShuffle}
            className={`p-1.5 transition-all rounded-full hover:bg-surface-container/50 ${
              isShuffle ? 'text-white' : 'text-slate-hint hover:text-white'
            }`}
            title="Shuffle"
          >
            <Shuffle size={16} />
          </button>
          
          <button 
            onClick={prevTrack}
            className="p-1.5 text-slate-hint hover:text-white transition-all rounded-full hover:bg-surface-container/50"
            title="Previous"
          >
            <SkipBack size={20} />
          </button>

          <button 
            onClick={togglePlay}
            className="w-10 h-10 bg-white hover:bg-silver-mist text-void-eclipse rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow shadow-white/10"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} className="translate-x-[1px]" fill="currentColor" />}
          </button>

          <button 
            onClick={nextTrack}
            className="p-1.5 text-slate-hint hover:text-white transition-all rounded-full hover:bg-surface-container/50"
            title="Next"
          >
            <SkipForward size={20} />
          </button>

          <button 
            onClick={toggleRepeat}
            className={`p-1.5 transition-all rounded-full hover:bg-surface-container/50 relative ${
              isRepeat !== 'none' ? 'text-white' : 'text-slate-hint hover:text-white'
            }`}
            title={`Repeat: ${isRepeat}`}
          >
            <Repeat size={16} />
            {isRepeat === 'one' && (
              <span className="absolute -top-[1px] -right-[1px] text-[7px] font-bold bg-white text-void-eclipse rounded-full w-2.5 h-2.5 flex items-center justify-center font-technical">1</span>
            )}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-3 w-full text-xs font-technical text-slate-hint">
          <span>{formatTime(progress)}</span>
          <div className="relative flex-1 flex items-center group">
            <input 
              type="range"
              min="0"
              max={duration || 100}
              value={progress}
              onChange={handleSeek}
              className="w-full h-1 bg-steel-accent/30 rounded-lg appearance-none cursor-pointer accent-white hover:accent-white focus:outline-none group-hover:h-1.5 transition-all"
              style={{
                background: `linear-gradient(to right, #ffffff 0%, #ffffff ${
                  (progress / (duration || 1)) * 100
                }%, rgba(58, 79, 99, 0.3) ${(progress / (duration || 1)) * 100}%, rgba(58, 79, 99, 0.3) 100%)`
              }}
            />
          </div>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right Section: Volume & Extras */}
      <div className="flex items-center gap-4 w-1/4 justify-end min-w-[200px]">
        {/* Track Specific Specs */}
        <div className="hidden lg:flex items-center gap-2 mr-4 border-r border-steel-accent/20 pr-4">
          <Link href={`/track/${currentTrack.id}`} className="flex items-center gap-1.5 bg-steel-accent/15 px-2 py-0.5 rounded-full border border-steel-accent/20 hover:bg-steel-accent/30 transition-all">
            <Activity size={10} className="text-white" />
            <span className="caption-tech text-[9px] uppercase">{currentTrack.bpm} BPM</span>
          </Link>
          <span className="caption-tech text-[9px] uppercase px-2 py-0.5 rounded-full bg-midnight-slate/30 text-silver-mist border border-midnight-slate/40">{currentTrack.key}</span>
        </div>

        <button 
          onClick={toggleMute}
          className="p-1.5 text-slate-hint hover:text-white transition-all rounded-full hover:bg-surface-container/50"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        <div className="w-20 flex items-center">
          <input 
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-full h-1 bg-steel-accent/30 rounded-lg appearance-none cursor-pointer accent-white hover:accent-white focus:outline-none"
            style={{
              background: `linear-gradient(to right, #ffffff 0%, #ffffff ${
                (isMuted ? 0 : volume) * 100
              }%, rgba(58, 79, 99, 0.3) ${(isMuted ? 0 : volume) * 100}%, rgba(58, 79, 99, 0.3) 100%)`
            }}
          />
        </div>

        <button 
          className="p-1.5 text-slate-hint hover:text-white transition-all rounded-full hover:bg-surface-container/50 hidden md:block"
          title="Lyrics / Visualizer"
        >
          <ListMusic size={16} />
        </button>
      </div>
    </div>
  );
}
