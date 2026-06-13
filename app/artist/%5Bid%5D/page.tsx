'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useArtist, useSimilarArtists } from '../../_hooks/useArtists';
import TrackCard from '../../_components/cards/TrackCard';
import ArtistCard from '../../_components/cards/ArtistCard';
import { User, Users, Disc, ShieldCheck } from 'lucide-react';
import Image from 'next/image';


export default function ArtistDetailPage() {
  const params = useParams();
  const artistId = params.id as string;

  const { data: artistDetail, isLoading: artistLoading, isError: artistError } = useArtist(artistId);
  const { data: similarArtists, isLoading: similarLoading } = useSimilarArtists(artistId);

  if (artistLoading) {
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

  if (artistError || !artistDetail) {
    return (
      <div className="p-8 text-center rounded-structural bg-surface-container/30 border border-error/20">
        <p className="font-interface text-sm text-error">Failed to synchronize artist data with recommendation servers.</p>
      </div>
    );
  }

  const { artist, topTracks } = artistDetail;

  return (
    <div className="space-y-12">
      <title>Artist - Music4U</title>
      {/* Editorial Header */}
      <section className="relative rounded-structural bg-gradient-to-r from-surface-container-low to-void-eclipse border border-steel-accent/15 overflow-hidden p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center md:items-end">
        {/* Ambient Blur Backlight */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-midnight-slate/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-48 h-48 rounded-full overflow-hidden ghost-border flex-shrink-0">
          <Image
            src={artist.imageUrl}
            alt={artist.name}
            fill
            priority
            sizes="192px"
            className="object-cover"
          />
        </div>

        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-slate-hint">
            <ShieldCheck size={14} className="text-white" />
            <span className="caption-tech text-[10px] uppercase font-bold text-white tracking-widest">VERIFIED AUDITORY SIGNAL</span>
          </div>

          <h1 className="font-editorial text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight">
            {artist.name}
          </h1>

          <p className="font-interface text-xs md:text-sm text-slate-hint max-w-2xl leading-relaxed">
            {artist.bio}
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs pt-2">
            <div className="flex items-center gap-1.5 text-slate-hint">
              <Users size={14} />
              <span className="font-technical">{artist.followers.toLocaleString()} Listeners</span>
            </div>
            
            <div className="flex items-center gap-1.5 text-slate-hint">
              <Disc size={14} />
              <span className="font-technical">Popularity Rating: {artist.popularity}/100</span>
            </div>

            <div className="flex gap-1.5">
              {artist.genres.map((g) => (
                <span key={g} className="caption-tech text-[9px] uppercase px-2.5 py-0.5 rounded-full bg-steel-accent/10 border border-steel-accent/20">
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Top Tracks */}
      <section className="space-y-5">
        <div className="border-b border-steel-accent/15 pb-2.5">
          <h2 className="section-header text-white font-bold tracking-tight">
            Curated Tracks
          </h2>
          <p className="font-interface text-xs text-slate-hint mt-1">
            Top analyzed musical structures for this artist.
          </p>
        </div>

        {topTracks.length === 0 ? (
          <p className="text-sm text-slate-hint">No curated tracks found in the mock database.</p>
        ) : (
          <div className="space-y-2">
            {topTracks.map((track, i) => (
              <TrackCard 
                key={track.id} 
                track={track} 
                variant="list" 
                index={i}
                contextQueue={topTracks}
              />
            ))}
          </div>
        )}
      </section>

      {/* Similar Artists */}
      <section className="space-y-5">
        <div className="border-b border-steel-accent/15 pb-2.5">
          <h2 className="section-header text-white font-bold tracking-tight">
            Similar Signals
          </h2>
          <p className="font-interface text-xs text-slate-hint mt-1">
            Auditory profiles with similar signature vectors.
          </p>
        </div>

        {similarLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="h-48 bg-surface-container/20 rounded-structural" />
            ))}
          </div>
        ) : !similarArtists || similarArtists.length === 0 ? (
          <p className="text-sm text-slate-hint">No similar artists found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {similarArtists.map((simArtist) => (
              <ArtistCard key={simArtist.id} artist={simArtist} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
