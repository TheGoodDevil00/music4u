import type { Recommendation, RecommendationSection } from '../../_types/recommendation';
import { mockTracks } from './tracks';

// Helper to find a track by ID
const findTrack = (id: string) => {
  const track = mockTracks.find(t => t.id === id);
  if (!track) throw new Error(`Mock track not found: ${id}`);
  return track;
};

export const mockRecommendations: Recommendation[] = [
  // Section 1: Because you like Tame Impala (sectionId: "rec-tame")
  {
    id: 'rec-1',
    track: findTrack('track-23'), // Khruangbin - Maria Tambien
    score: 0.95,
    reason: 'Because you like Tame Impala',
    signals: ['similar_artist', 'mood_match', 'psych_influences'],
    sectionId: 'rec-tame',
  },
  {
    id: 'rec-2',
    track: findTrack('track-26'), // FKJ - Skyline
    score: 0.88,
    reason: 'Because you like Tame Impala',
    signals: ['genre_overlap', 'collaborative_filter'],
    sectionId: 'rec-tame',
  },
  {
    id: 'rec-3',
    track: findTrack('track-28'), // Tycho - Awake
    score: 0.85,
    reason: 'Because you like Tame Impala',
    signals: ['tempo_similarity', 'instrumentation_match'],
    sectionId: 'rec-tame',
  },
  {
    id: 'rec-4',
    track: findTrack('track-18'), // Bonobo - Surface
    score: 0.82,
    reason: 'Because you like Tame Impala',
    signals: ['collaborative_filter', 'mood_match'],
    sectionId: 'rec-tame',
  },
  {
    id: 'rec-5',
    track: findTrack('track-11'), // Billie Eilish - Billie Bossa Nova
    score: 0.79,
    reason: 'Because you like Tame Impala',
    signals: ['collaborative_filter'],
    sectionId: 'rec-tame',
  },

  // Section 2: Late Night Introspective (sectionId: "rec-night")
  {
    id: 'rec-6',
    track: findTrack('track-4'), // Radiohead - Everything In Its Right Place
    score: 0.98,
    reason: 'Fits your Late Night Introspective mood',
    signals: ['mood_match', 'acoustic_density_low', 'energy_match'],
    sectionId: 'rec-night',
  },
  {
    id: 'rec-7',
    track: findTrack('track-15'), // Miles Davis - Blue in Green
    score: 0.92,
    reason: 'Fits your Late Night Introspective mood',
    signals: ['tempo_match', 'jazz_influence', 'energy_match'],
    sectionId: 'rec-night',
  },
  {
    id: 'rec-8',
    track: findTrack('track-17'), // Bonobo - Break Apart
    score: 0.89,
    reason: 'Fits your Late Night Introspective mood',
    signals: ['mood_match', 'tempo_match'],
    sectionId: 'rec-night',
  },
  {
    id: 'rec-9',
    track: findTrack('track-10'), // Billie Eilish - Getting Older
    score: 0.84,
    reason: 'Fits your Late Night Introspective mood',
    signals: ['acoustic_density_low', 'collaborative_filter'],
    sectionId: 'rec-night',
  },
  {
    id: 'rec-10',
    track: findTrack('track-30'), // Tycho - Spectre
    score: 0.81,
    reason: 'Fits your Late Night Introspective mood',
    signals: ['ambient_texture', 'energy_match'],
    sectionId: 'rec-night',
  },

  // Section 3: High-Energy Electronics (sectionId: "rec-energy")
  {
    id: 'rec-11',
    track: findTrack('track-7'), // Daft Punk - One More Time
    score: 0.96,
    reason: 'Based on your high energy listening history',
    signals: ['tempo_similarity', 'danceability_high', 'collaborative_filter'],
    sectionId: 'rec-energy',
  },
  {
    id: 'rec-12',
    track: findTrack('track-20'), // Kendrick Lamar - DNA.
    score: 0.91,
    reason: 'Based on your high energy listening history',
    signals: ['energy_high', 'bpm_matching'],
    sectionId: 'rec-energy',
  },
  {
    id: 'rec-13',
    track: findTrack('track-6'), // Radiohead - Idioteque
    score: 0.87,
    reason: 'Based on your high energy listening history',
    signals: ['tempo_similarity', 'electronic_beats'],
    sectionId: 'rec-energy',
  },
  {
    id: 'rec-14',
    track: findTrack('track-8'), // Daft Punk - Aerodynamic
    score: 0.84,
    reason: 'Based on your high energy listening history',
    signals: ['genre_match', 'energy_high'],
    sectionId: 'rec-energy',
  },
  {
    id: 'rec-15',
    track: findTrack('track-27'), // FKJ - Better Give U Up
    score: 0.80,
    reason: 'Based on your high energy listening history',
    signals: ['danceability_high', 'groove_matching'],
    sectionId: 'rec-energy',
  },

  // Section 4: Chill & Lo-Fi (sectionId: "rec-chill")
  {
    id: 'rec-16',
    track: findTrack('track-24'), // Khruangbin - August 10
    score: 0.94,
    reason: 'Perfect for a relaxed afternoon',
    signals: ['tempo_low', 'chill_vibes', 'instrumental'],
    sectionId: 'rec-chill',
  },
  {
    id: 'rec-17',
    track: findTrack('track-25'), // FKJ - We Ain't Feeling Time
    score: 0.90,
    reason: 'Perfect for a relaxed afternoon',
    signals: ['groove_matching', 'tempo_low'],
    sectionId: 'rec-chill',
  },
  {
    id: 'rec-18',
    track: findTrack('track-16'), // Bonobo - Migration
    score: 0.88,
    reason: 'Perfect for a relaxed afternoon',
    signals: ['ambient_match', 'chill_vibes'],
    sectionId: 'rec-chill',
  },
  {
    id: 'rec-19',
    track: findTrack('track-29'), // Tycho - Montana
    score: 0.85,
    reason: 'Perfect for a relaxed afternoon',
    signals: ['ambient_texture', 'chill_vibes'],
    sectionId: 'rec-chill',
  },
  {
    id: 'rec-20',
    track: findTrack('track-13'), // Miles Davis - So What
    score: 0.78,
    reason: 'Perfect for a relaxed afternoon',
    signals: ['acoustic_vibe', 'jazz_tempo'],
    sectionId: 'rec-chill',
  },
];

export const mockRecommendationSections: RecommendationSection[] = [
  {
    id: 'rec-tame',
    title: 'Because You Like Tame Impala',
    description: 'Fresh psychedelic-infused indie pop tracks selected for your taste.',
    recommendations: mockRecommendations.filter(r => r.sectionId === 'rec-tame'),
  },
  {
    id: 'rec-night',
    title: 'Late Night Introspective',
    description: 'Downbeat, melancholic, and deeply atmospheric tracks for night listening.',
    recommendations: mockRecommendations.filter(r => r.sectionId === 'rec-night'),
  },
  {
    id: 'rec-energy',
    title: 'High-Energy Beat Machines',
    description: 'Uptempo grooves, heavy drums, and synthetic elements to keep you moving.',
    recommendations: mockRecommendations.filter(r => r.sectionId === 'rec-energy'),
  },
  {
    id: 'rec-chill',
    title: 'Chill Out & Downtempo',
    description: 'Smooth, acoustic-leaning, and ambient-textured songs for a relaxed environment.',
    recommendations: mockRecommendations.filter(r => r.sectionId === 'rec-chill'),
  },
];
