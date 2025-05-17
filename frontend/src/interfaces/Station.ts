export interface Station {
  id: number;
  name: string;
  type: string;
  description: string;
  genre: string;
  imageUrl: string;
  location: string;
  liveShow: string;
  listeners: number;
  status: "Live" | "Offline";
  link: string;
}
