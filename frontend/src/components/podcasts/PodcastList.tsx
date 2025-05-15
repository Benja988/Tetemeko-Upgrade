// app/podcast/components/PodcastList.tsx
'use client';

import { podcasts } from "@/constants/podcasts"; // Correct import name
import PodcastCard from "./PodcastCard";

export default function PodcastList() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
      {podcasts.map((podcast) => (
        <PodcastCard key={podcast.id} podcast={podcast} />
      ))}
    </div>
  );
}
