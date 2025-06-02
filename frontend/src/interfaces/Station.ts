export interface Station {
  _id: string;                  // maps from _id
  name: string;
  description?: string;
  streamUrl: string;
  imageUrl: string;            // maps from logoUrl
  location: string;
  genres: string[];            // plural based on DB
  isActive: boolean;
}
