'use client';

import React from 'react';
import type { Album } from '../../_types/album';
import Image from 'next/image';
import Link from 'next/link';

interface AlbumCardProps {
  album: Album;
}

export default function AlbumCard({ album }: AlbumCardProps) {
  return (
    <Link 
      href={`/album/${album.id}`}
      className="group flex flex-col rounded-structural bg-surface-container/20 p-4 border border-steel-accent/10 hover:border-steel-accent/25 hover:bg-surface-container/40 transition-all duration-300 cursor-pointer h-full"
    >
      {/* Square Cover Container */}
      <div className="relative aspect-square w-full rounded-lg overflow-hidden ghost-border mb-4">
        <Image
          src={album.coverArtUrl}
          alt={album.title}
          fill
          sizes="(max-width: 768px) 100vw, 250px"
          className="object-cover transition-transform duration-500 group-hover:scale-103"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Info details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-interface text-sm font-semibold text-white tracking-tight group-hover:underline truncate w-full mb-0.5">
            {album.title}
          </h3>
          <p className="font-interface text-xs text-slate-hint truncate w-full">
            {album.artistName}
          </p>
        </div>

        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-steel-accent/10">
          <span className="caption-tech text-[10px] text-slate-hint uppercase">
            {album.genres[0]}
          </span>
          <span className="font-technical text-[10px] text-slate-hint">
            {album.releaseYear}
          </span>
        </div>
      </div>
    </Link>
  );
}
