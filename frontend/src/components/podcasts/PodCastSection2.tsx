"use client";

import { useEffect, useState } from "react";
import { Podcast } from "@/interfaces/podcasts";
import { podcastService } from "@/services/podcasts/podcastsService";

export default function PodCastSection2() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const res = await podcastService.getAll({ page: 1, limit: 6 });
        setPodcasts(res.podcasts);
      } catch (err) {
        console.error("Failed to load podcasts", err);
      }
    };
    fetchPodcasts();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-16 py-20 text-white">
      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-1 flex flex-col justify-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore More Podcasts</h2>
          <p className="text-gray-300">Browse our curated list of engaging shows.</p>
        </div>

        <div className="md:col-span-2 grid md:grid-cols-2 gap-6">
          {podcasts.map((podcast) => (
            <div key={podcast._id} className="bg-white/5 p-4 rounded-xl shadow-md">
              {podcast.coverImage && (
                <img
                  src={podcast.coverImage}
                  alt={podcast.title}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
              )}
              <h3 className="text-lg font-semibold">{podcast.title}</h3>
              <p className="text-gray-300 text-sm">{podcast.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
