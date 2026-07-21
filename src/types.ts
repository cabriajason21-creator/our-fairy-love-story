export interface Milestone {
  emoji: string;
  date: string;
  title: string;
  text: string;
}

export interface GalleryItem {
  caption: string;
  media: string; // base64 or URL
  mediaType: "image" | "video";
  fileName?: string;
}

export interface QuizQuestion {
  q: string;
  options: string[];
  correct: number;
}

export interface LoveStoryState {
  gateTitle: string;
  gateSub: string;
  hubTitle: string;
  timeline: Milestone[];
  gallery: GalleryItem[];
  memoryLogGallery?: GalleryItem[];
  countdownTitle: string;
  countdownDate: string; // YYYY-MM-DD
  countdownSub: string;
  anniversaryDate?: string; // YYYY-MM-DD
  reasons: string[];
  quiz: QuizQuestion[];
  audioName: string;
  audioData: string; // base64 MP3
  voiceNote: string;
  finaleMessage: string;
  youtubeUrl?: string;
  hidePlayerVisuals?: boolean;
  frameStyle?: string;
  theme?: "day" | "night";
  weather?: "none" | "petals" | "sparkles" | "fireflies" | "snow";
}

export interface ClientAccount {
  id: string;
  username: string;
  password: string;
  spaceState: LoveStoryState;
  createdAt: string;
}

export interface UserSession {
  role: "creator" | "client";
  clientId?: string;
  username: string;
}

