"use client";

import Image from "next/image";
import { Podcast } from "@/constants/podcasts";
import { usePodcast } from "@/context/PodcastContext";

export default function PodcastCard({ podcast }: { podcast: Podcast }) {
  const { playPodcast } = usePodcast();

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all">
      {/* Image with Overlay */}
      <div className="relative w-full h-72 overflow-hidden">
        <Image
          src={podcast.image}
          alt={podcast.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-5 space-y-3">
          {/* Title and Description */}
          <div>
            <h2 className="text-lg md:text-xl font-bold text-white mb-1 truncate">{podcast.title}</h2>
            <p className="text-sm text-gray-300 line-clamp-2">{podcast.description}</p>
          </div>

          {/* Play Button inside image */}
          <button
            onClick={() => playPodcast(podcast.audio, podcast.title, podcast.image)}
            className="w-full py-2 rounded-full bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-semibold transition"
          >
            Play Episode
          </button>
        </div>
      </div>
    </div>
  );
}
