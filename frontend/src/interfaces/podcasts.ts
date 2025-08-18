// interfaces/Podcast.ts
export interface Episode {
  _id: string;
  title: string;
  description: string;
  duration: number;
  audioUrl: string;
  tags?: string[];
  episodeNumber?: number;
  publishedDate?: string;
  isActive?: boolean;
  podcast: string;
  createdBy?: {
    name: string;
  };
}

export interface EpisodeInput {
  title: string;
  description: string;
  duration: number;
  episodeNumber?: number;
  tags?: string[];
  audioUrl?: string | File;
}


export interface Podcast {
  _id: string;
  title: string;
  description: string;
  coverImage?: string;
  station?: string;
  category: string;
  createdBy?: {
    name: string;
  };
  episodes?: any[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PodcastInput {
  title: string;
  description: string;
  category: string;
  station?: string;
  coverImage?: string | File;
}
