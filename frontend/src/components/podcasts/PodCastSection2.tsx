"use client";

import { podcasts } from "@/data/podcasts";
import { Play } from "lucide-react";

export default function PodCastSection2() {
  const otherPodcasts = podcasts.filter((p) => p.id !== "3").slice(0, 6);

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-16 py-20 text-white">
      <div className="grid md:grid-cols-3 gap-10">
        {/* LEFT SIDE */}
        <div className="md:col-span-1 flex flex-col justify-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Explore More Episodes
          </h2>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-6">
            Browse our curated list of engaging podcast episodes. From insightful interviews to powerful stories – there’s something for everyone.
          </p>
          <p className="text-sm text-gray-400">
            New episodes added weekly. Stay informed, stay inspired.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="md:col-span-2">
          <div className="flex md:grid md:grid-cols-2 gap-6 overflow-x-auto flex-nowrap scroll-smooth pb-4 -mx-2 px-2">
            {otherPodcasts.map((podcast) => (
              <div
                key={podcast.id}
                className="bg-white/5 hover:bg-white/10 transition p-4 rounded-xl shadow-md backdrop-blur-sm flex flex-col min-w-[250px] md:min-w-0"
              >
                <div className="relative mb-4">
                  <img
                    src={podcast.image}
                    alt={podcast.title}
                    className="w-full h-40 object-cover rounded-lg shadow"
                  />
                  <button className="absolute bottom-2 right-2 bg-white text-black p-2 rounded-full shadow hover:bg-gray-200 transition">
                    <Play size={20} />
                  </button>
                </div>

                <h3 className="text-lg font-semibold mb-1">{podcast.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-3">
                  {podcast.description}
                </p>

                <audio controls className="w-full rounded-md mt-auto">
                  <source src={podcast.audio} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
