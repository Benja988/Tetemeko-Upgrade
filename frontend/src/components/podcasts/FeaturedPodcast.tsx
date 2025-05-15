"use client";

import Image from "next/image";
import { podcasts } from "@/constants/podcasts"; // Assuming podcasts are imported from a constant file

export default function FeaturedPodcast() {
  const featuredPodcast = podcasts[0]; // Example: you can pick one podcast to feature

  return (
    <section className="mb-12 bg-gray-100 p-8 rounded-xl shadow-lg">
      <h2 className="text-3xl font-semibold text-gray-900 mb-6">Featured Podcast</h2>
      <div className="flex items-center gap-8">
        <div className="relative w-48 h-48 rounded-lg overflow-hidden shadow-md">
          <Image
            src={featuredPodcast.image}
            alt={featuredPodcast.title}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900">{featuredPodcast.title}</h3>
          <p className="text-sm text-gray-600 mt-2 line-clamp-3">{featuredPodcast.description}</p>
          <button
            onClick={() => alert("Play Featured Podcast")}
            className="mt-4 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Play Now
          </button>
        </div>
      </div>
    </section>
  );
}
