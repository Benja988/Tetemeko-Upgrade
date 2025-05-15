"use client";

import Image from "next/image";
import { podcasts } from "@/constants/podcasts"; // Assuming podcasts are imported from a constant file

export default function PodcastRecommendations() {
  const recommendedPodcasts = podcasts.slice(10, 15); // Simulating recommendations

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-semibold text-gray-900 mb-6">Recommended Podcasts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {recommendedPodcasts.map((podcast) => (
          <div
            key={podcast.id}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition"
          >
            <div className="relative w-full h-40">
              <Image
                src={podcast.image}
                alt={podcast.title}
                layout="fill"
                objectFit="cover"
                className="rounded-t-2xl"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{podcast.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{podcast.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
