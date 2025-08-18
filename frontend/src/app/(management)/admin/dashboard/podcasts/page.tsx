// app/podcasts/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllPodcasts } from "@/services/podcasts/podcastsService";
import PodcastCard from "@/components/admin/podcasts/PodcastCard";
import { Podcast } from "@/interfaces/podcasts";

export default function PodcastsPage() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const res = await getAllPodcasts({ page: 1, limit: 20 });
      if (res && res.podcasts) setPodcasts(res.podcasts);
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Discover Podcasts</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {podcasts.map((podcast) => (
          <PodcastCard
            key={podcast._id}
            podcast={podcast}
            onClick={() => router.push(`/podcasts/${podcast._id}`)}
          />
        ))}
      </div>
    </div>
  );
}
