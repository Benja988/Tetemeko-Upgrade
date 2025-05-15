"use client";

import { usePodcast } from "@/context/PodcastContext";
import { podcasts } from "@/constants/podcasts";
import Image from "next/image";

export default function TrendingPodcasts() {
  const { playPodcast } = usePodcast();

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-semibold text-gray-900 mb-6">Trending Podcasts</h2>
      <div className="overflow-x-auto space-x-6 pb-6">
        <div className="inline-flex space-x-6">
          {podcasts.slice(0, 10).map((podcast) => (
            <div
              key={podcast.id}
              className="relative group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all w-64"
            >
              {/* Podcast Image */}
              <div className="relative w-full h-40">
                <Image
                  src={podcast.image}
                  alt={podcast.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-2xl group-hover:scale-105 transition-transform duration-500"
                />
                {/* Play Button */}
                <button
                  onClick={() => playPodcast(podcast.audio, podcast.title, podcast.image)}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-2xl font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Play ${podcast.title}`}
                >
                  ▶️
                </button>
              </div>

              {/* Podcast Info */}
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-900 truncate">{podcast.title}</h3>
                <p className="text-xs text-gray-600 line-clamp-2">{podcast.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
