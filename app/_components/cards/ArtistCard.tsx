'use client';

import React from 'react';
import type { Artist } from '../../_types/artist';
import Image from 'next/image';
import Link from 'next/link';
import { User } from 'lucide-react';

interface ArtistCardProps {
  artist: Artist;
}

export default function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <Link 
      href={`/artist/${artist.id}`}
      className="group flex flex-col items-center text-center rounded-structural bg-surface-container/20 p-4 border border-steel-accent/10 hover:border-steel-accent/25 hover:bg-surface-container/40 transition-all duration-300 cursor-pointer h-full"
    >
      {/* Circle Image Wrapper */}
      <div className="relative w-36 h-36 rounded-full overflow-hidden ghost-border mb-4 group-hover:scale-102 transition-transform duration-300">
        <Image
          src={artist.imageUrl}
          alt={artist.name}
          fill
          sizes="144px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Info */}
      <h3 className="font-interface text-sm font-semibold text-white tracking-tight group-hover:underline truncate w-full mb-1">
        {artist.name}
      </h3>
      
      <p className="caption-tech text-[10px] text-slate-hint uppercase mb-3">
        {artist.followers.toLocaleString()} Followers
      </p>

      {/* Genre Pills */}
      <div className="flex flex-wrap justify-center gap-1 mt-auto">
        {artist.genres.slice(0, 2).map((genre) => (
          <span 
            key={genre} 
            className="caption-tech text-[8px] uppercase tracking-wider text-slate-hint bg-steel-accent/10 px-2 py-0.5 rounded-full border border-steel-accent/10"
          >
            {genre}
          </span>
        ))}
      </div>
    </Link>
  );
}
