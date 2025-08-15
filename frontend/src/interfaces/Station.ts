export interface Station {
  frequency: React.ReactNode;
  id: React.Key | null | undefined;
  _id: string; // MongoDB ID
  name: string;
  description?: string;
  streamUrl?: string;
  imageUrl: string;
  location: string;
  genre: string[]; // array for DB/API
  isActive: boolean;
  type: "Radio Station" | "TV Station";
  liveShow?: string;
  listenerz?: number;
}

export interface StationFormData
  extends Omit<Station, "_id" | "genre" | "listenerz"> {
  genres: string; // comma-separated for form
  listenerz: string; // keep as string for input
}
