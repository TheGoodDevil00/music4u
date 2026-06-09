export interface Track {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  albumId: string;
  albumTitle: string;
  albumArtUrl: string;
  durationMs: number;
  genre: string[];
  mood: string[];
  bpm: number;
  key: string;
  energy: number;       // 0–1
  danceability: number; // 0–1
  previewUrl?: string;  // 30s preview clip (optional for mock)
  playCount: number;
  releaseYear: number;
}
