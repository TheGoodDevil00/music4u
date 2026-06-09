'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useAlbum, useSimilarAlbums } from '../../_hooks/useAlbums';
import TrackCard from '../../_components/cards/TrackCard';
import AlbumCard from '../../_components/cards/AlbumCard';
import { Disc, Calendar, Music, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function AlbumDetailPage() {
  const params = useParams();
  const albumId = params.id as string;

  const { data: album, isLoading: albumLoading, isError: albumError } = useAlbum(albumId);
  const { data: similarAlbums, isLoading: similarLoading } = useSimilarAlbums(albumId);

  if (albumLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-64 bg-surface-container/30 rounded-structural border border-steel-accent/15" />
        <div className="space-y-4">
          <div className="h-8 bg-surface-container w-1/4 rounded" />
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-14 bg-surface-container/20 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (albumError || !album) {
    return (
      <div className="p-8 text-center rounded-structural bg-surface-container/30 border border-error/20">
        <p className="font-interface text-sm text-error">Failed to synchronize album data with recommendation servers.</p>
      </div>
    );
  }

  const tracks = album.tracks || [];

  return (
    <div className="space-y-12">
      {/* Album Header Block */}
      <section className="relative rounded-structural bg-gradient-to-r from-surface-container-low to-void-eclipse border border-steel-accent/15 overflow-hidden p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center md:items-end">
        {/* Glow backlight */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-midnight-slate/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-48 h-48 rounded-lg overflow-hidden ghost-border flex-shrink-0">
          <Image
            src={album.coverArtUrl}
            alt={album.title}
            fill
            priority
            sizes="192px"
            className="object-cover"
          />
        </div>

        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-slate-hint">
            <Disc size={14} className="text-white animate-spin-slow" />
            <span className="caption-tech text-[10px] uppercase font-bold text-white tracking-widest">ALBUM DATA SHEET</span>
          </div>

          <h1 className="font-editorial text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            {album.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs">
            <Link 
              href={`/artist/${album.artistId}`}
              className="font-interface text-sm font-semibold text-white hover:underline block"
            >
              {album.artistName}
            </Link>
            
            <span className="text-slate-hint">•</span>

            <div className="flex items-center gap-1.5 text-slate-hint">
              <Calendar size={12} />
              <span className="font-technical">{album.releaseYear}</span>
            </div>

            <span className="text-slate-hint">•</span>

            <div className="flex items-center gap-1.5 text-slate-hint">
              <Music size={12} />
              <span className="font-technical">{tracks.length} Tracks</span>
            </div>

            <span className="text-slate-hint">•</span>

            <div className="flex gap-1.5">
              {album.genres.map((g) => (
                <span key={g} className="caption-tech text-[9px] uppercase px-2.5 py-0.5 rounded-full bg-steel-accent/10 border border-steel-accent/20">
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Album Tracklist */}
      <section className="space-y-5">
        <div className="border-b border-steel-accent/15 pb-2.5">
          <h2 className="section-header text-white font-bold tracking-tight">
            Tracklist Schema
          </h2>
          <p className="font-interface text-xs text-slate-hint mt-1">
            Audio structures ordered by sequence indexes.
          </p>
        </div>

        {tracks.length === 0 ? (
          <p className="text-sm text-slate-hint">No tracks found for this album.</p>
        ) : (
          <div className="space-y-2">
            {tracks.map((track, i) => (
              <TrackCard 
                key={track.id} 
                track={track} 
                variant="list" 
                index={i}
                contextQueue={tracks}
              />
            ))}
          </div>
        )}
      </section>

      {/* Similar Albums */}
      <section className="space-y-5">
        <div className="border-b border-steel-accent/15 pb-2.5">
          <h2 className="section-header text-white font-bold tracking-tight">
            Related Albums
          </h2>
          <p className="font-interface text-xs text-slate-hint mt-1">
            Albums sharing similar genre/style vectors.
          </p>
        </div>

        {similarLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-56 bg-surface-container/20 rounded-structural" />
            ))}
          </div>
        ) : !similarAlbums || similarAlbums.length === 0 ? (
          <p className="text-sm text-slate-hint">No similar albums found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {similarAlbums.map((simAlbum) => (
              <AlbumCard key={simAlbum.id} album={simAlbum} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
