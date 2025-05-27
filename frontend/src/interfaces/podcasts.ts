// interfaces/Podcast.ts
export interface Episode {
  id: number;
  title: string;
  audioUrl: string;
  duration: string;
}

export interface Podcast {
  id: number;
  title: string;
  description: string;
  host: string;
  category: string;
  imageUrl: string;
  episodes: Episode[];
  status: "Published" | "Draft";
}
