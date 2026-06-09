import type { Track } from './track';

export interface Album {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  coverArtUrl: string;
  releaseYear: number;
  genres: string[];
  trackIds: string[];
  tracks?: Track[];
}
