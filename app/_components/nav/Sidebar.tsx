'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Disc, Search, User, Music, Volume2, Maximize2, Sliders } from 'lucide-react';
import { usePlayerStore } from '../../_store/playerStore';
import { useUserStore } from '../../_store/userStore';
import Image from 'next/image';

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Discover', href: '/discover', icon: Disc },
  { name: 'Search', href: '/search', icon: Search },
  { name: 'Taste Profile', href: '/profile', icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { currentTrack, isPlaying, togglePlay } = usePlayerStore();
  const { setCompletedOnboarding } = useUserStore();

  return (
    <aside className="w-64 bg-void-eclipse border-r border-steel-accent/20 flex flex-col h-screen sticky top-0 text-silver-mist">
      {/* Brand Header */}
      <div className="p-6 border-b border-steel-accent/10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-control bg-midnight-slate flex items-center justify-center ghost-border group-hover:border-steel-accent transition-all">
            <Music size={16} className="text-white animate-pulse" />
          </div>
          <div>
            <span className="font-editorial text-xl font-bold tracking-tight text-white block">Music4U</span>
            <span className="caption-tech text-slate-hint uppercase">Recommendation Engine</span>
          </div>
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 flex flex-col">
        <div className="space-y-1.5 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-control transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-midnight-slate text-white border-l-2 border-white'
                    : 'text-slate-hint hover:text-white hover:bg-surface-container-low'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-white' : 'text-slate-hint group-hover:text-white transition-colors'} />
                <span className="font-interface text-sm font-medium">{item.name}</span>
                {!isActive && (
                  <span className="absolute left-0 w-1 h-0 bg-steel-accent rounded-r transition-all group-hover:h-6" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Prod testing intro screen trigger */}
        <button
          type="button"
          onClick={() => {
            localStorage.removeItem('music4u-onboarding-completed');
            setCompletedOnboarding(false);
            window.location.reload();
          }}
          className="flex items-center gap-3 px-4 py-2.5 rounded-control text-slate-hint hover:text-white hover:bg-surface-container-low transition-all duration-200 border border-dashed border-steel-accent/30 hover:border-steel-accent/60 text-left cursor-pointer"
          title="Reset onboarding state for manual verification"
        >
          <Sliders size={16} className="text-slate-hint" />
          <span className="caption-tech text-[10px] uppercase font-bold tracking-wider">Intro Screen Test</span>
        </button>
      </nav>

      {/* Mini Now Playing Card on Desktop */}
      {currentTrack && (
        <div className="p-4 m-4 rounded-xl bg-surface-container-low border border-steel-accent/20 transition-all duration-300 hover:border-steel-accent/40 group relative overflow-hidden">
          {/* Subtle glow background */}
          <div className="absolute inset-0 bg-gradient-to-t from-midnight-slate/10 to-transparent pointer-events-none" />
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="relative w-12 h-12 rounded-control overflow-hidden ghost-border flex-shrink-0">
              <Image
                src={currentTrack.albumArtUrl}
                alt={currentTrack.albumTitle}
                fill
                sizes="48px"
                className={`object-cover ${isPlaying ? 'animate-[spin_10s_linear_infinite]' : ''}`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <Link href={`/track/${currentTrack.id}`} className="font-interface text-xs font-semibold text-white truncate hover:underline block">
                {currentTrack.title}
              </Link>
              <Link href={`/artist/${currentTrack.artistId}`} className="font-interface text-[11px] text-slate-hint truncate hover:underline block">
                {currentTrack.artistName}
              </Link>
            </div>
            
            {/* Visualizer bars indicating playback */}
            {isPlaying && (
              <div className="flex items-end gap-[2px] h-3">
                <span className="w-[2px] bg-white rounded-t animate-[bounce_0.8s_infinite_0.1s]" style={{ height: '60%' }} />
                <span className="w-[2px] bg-white rounded-t animate-[bounce_0.8s_infinite_0.3s]" style={{ height: '95%' }} />
                <span className="w-[2px] bg-white rounded-t animate-[bounce_0.8s_infinite_0.2s]" style={{ height: '40%' }} />
              </div>
            )}
          </div>
          
          <div className="mt-3 flex items-center justify-between text-[10px] text-slate-hint relative z-10">
            <span className="caption-tech uppercase">{currentTrack.bpm} BPM</span>
            <span className="caption-tech uppercase text-[9px] px-1.5 py-0.5 rounded-full bg-steel-accent/30 text-silver-mist">{currentTrack.key}</span>
          </div>
        </div>
      )}
    </aside>
  );
}
