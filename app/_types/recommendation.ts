import type { Track } from './track';

export interface Recommendation {
  id: string;
  track: Track;
  score: number;       // 0–1 confidence
  reason: string;      // Human-readable: "Because you like Radiohead"
  signals: string[];   // ['similar_artist', 'mood_match', 'collaborative_filter']
  sectionId: string;   // Groups recommendations into feed sections
}

export interface RecommendationSection {
  id: string;
  title: string;
  description?: string;
  recommendations: Recommendation[];
}
