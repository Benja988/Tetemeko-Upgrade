// interfaces/Podcast.ts
export interface Episode {
  _id: string;
  title: string;
  description: string;
  audioUrl: string;
  duration: number;
  episodeNumber?: number;
  tags?: string[];
  publishedDate: string;
  createdBy?: { name: string };
}

export interface EpisodeInput {
  title: string;
  description: string;
  duration: number;
  episodeNumber?: number;
  tags?: string[];
  audioUrl?: string | File;
}


// src/interfaces/podcasts.ts
export interface Podcast {
  _id: string;
  title: string;
  description: string;
  coverImage?: string;
  category?: { _id: string; name: string };
  station?: { _id: string; name: string };
  episodes?: Episode[];
  createdBy?: { name: string };
  isActive: boolean;
}


export interface PodcastInput {
  title: string;
  description: string;
  category: string;
  station?: string;
  coverImage?: string | File;
}
