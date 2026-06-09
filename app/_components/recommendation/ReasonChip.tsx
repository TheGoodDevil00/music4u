'use client';

import React from 'react';

interface ReasonChipProps {
  signal: string;
}

const signalLabels: Record<string, string> = {
  similar_artist: 'Similar Artist',
  mood_match: 'Mood Match',
  collaborative_filter: 'Collab Filter',
  psych_influences: 'Psych Rock',
  tempo_similarity: 'Tempo Fit',
  instrumentation_match: 'Instrument Vibe',
  acoustic_density_low: 'Late Night',
  energy_match: 'Energy Match',
  energy_high: 'High Energy',
  bpm_matching: 'BPM Sync',
  groove_matching: 'Groove Align',
  ambient_texture: 'Ambient Vibe',
  exotic: 'Exotic Sound',
  jazz_influence: 'Jazz Blend',
  tempo_match: 'Tempo Match',
  tempo_low: 'Downtempo',
  chill_vibes: 'Chill Out',
  instrumental: 'Instrumental',
  acoustic_vibe: 'Acoustic',
  jazz_tempo: 'Jazz Tempo',
  sunset: 'Sunset Vibe',
  upbeat: 'Upbeat Vibe',
  sensual: 'Sensual Groove',
  electronic_beats: 'Electronic',
};

export default function ReasonChip({ signal }: ReasonChipProps) {
  const label = signalLabels[signal] || signal.replace(/_/g, ' ');
  return (
    <span className="caption-tech text-[10px] text-slate-hint uppercase bg-steel-accent/10 hover:bg-steel-accent/20 transition-colors border border-steel-accent/25 px-2 py-0.5 rounded-full inline-block">
      {label}
    </span>
  );
}
