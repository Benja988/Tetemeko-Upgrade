export interface Station {
  frequency: ReactNode;
  id: Key | null | undefined;
  _id: string;                     // maps from _id (string from MongoDB)
  name: string;
  description?: string;
  streamUrl?: string;             // optional for now if not all have one
  imageUrl: string;               // maps from logoUrl
  location: string;
  genre: string[];               // array, not comma-separated string
  isActive: boolean;              // true = live
  type: "Radio Station" | "TV Station";
  liveShow?: string;
  listenerz?: number;
}

export type StationInput = Omit<Station, "_id">;
