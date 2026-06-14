'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Disc, Search, User, Music, Volume2, Maximize2, Sliders } from 'lucide-react';
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
  const { setCompletedOnboarding, spotifyUser } = useUserStore();

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

        {/* Spotify Profile Section */}
        <div className="mt-auto pt-4 border-t border-steel-accent/10 mb-4">
          {spotifyUser ? (
            <div className="flex items-center gap-3 p-2 rounded-control bg-surface-container/20 border border-steel-accent/10">
              <div className="relative w-9 h-9 rounded-full overflow-hidden ghost-border flex-shrink-0">
                <Image
                  src={spotifyUser.avatarUrl}
                  alt={spotifyUser.name}
                  fill
                  sizes="36px"
                  className="object-cover"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#1DB954] border border-void-eclipse rounded-full" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-interface text-xs font-semibold text-white block truncate">
                  {spotifyUser.name}
                </span>
                <span className="caption-tech text-[8px] uppercase tracking-wider text-[#1DB954] font-bold">
                  Spotify Sync Active
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2 p-2.5 rounded-control bg-surface-container-low/40 border border-steel-accent/10">
              <div className="flex items-center gap-2 text-slate-hint">
                <div className="w-6 h-6 rounded-full bg-steel-accent/20 flex items-center justify-center">
                  <User size={12} />
                </div>
                <span className="font-interface text-xs">Offline Profile</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  window.location.href = '/api/auth/spotify';
                }}
                className="w-full text-center py-2 px-3 rounded-control bg-[#1DB954] hover:bg-[#1ed760] text-void-eclipse font-bold font-interface text-[10px] uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Connect Spotify</span>
              </button>
            </div>
          )}
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
    </aside>
  );
}
