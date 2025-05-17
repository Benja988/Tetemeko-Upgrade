"use client";

import { PodcastIcon, Mic2, Radio, Globe2, Cpu, Briefcase } from "lucide-react";

const categories = [
  { name: "Technology", icon: <Cpu className="w-6 h-6" />, description: "Explore innovations, gadgets, and digital trends." },
  { name: "News & Politics", icon: <Globe2 className="w-6 h-6" />, description: "In-depth coverage and informed commentary." },
  { name: "Business", icon: <Briefcase className="w-6 h-6" />, description: "Interviews, entrepreneurship, and economy." },
  { name: "Entertainment", icon: <Radio className="w-6 h-6" />, description: "Music, movies, pop culture, and lifestyle." },
  { name: "Talk Shows", icon: <Mic2 className="w-6 h-6" />, description: "Heartfelt stories and bold conversations." },
  { name: "General", icon: <PodcastIcon className="w-6 h-6" />, description: "Everything else — variety and fun!" },
];

export default function PodCastSection4() {
  return (
    <section className="bg-slate-900 text-white py-20 px-6 md:px-16">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Browse by Categories</h2>
        <p className="text-gray-400 max-w-xl mx-auto mb-12 text-base md:text-lg">
          Find shows that match your interests. Whether you're into tech, stories, or deep conversations, there’s something for everyone.
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 text-left">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="bg-white/5 hover:bg-white/10 transition p-6 rounded-xl shadow-md backdrop-blur-sm"
            >
              <div className="flex items-center space-x-4 mb-4 text-indigo-300">
                <div className="bg-indigo-600/20 p-2 rounded-full">
                  {cat.icon}
                </div>
                <h3 className="text-xl font-semibold">{cat.name}</h3>
              </div>
              <p className="text-gray-300 text-sm">{cat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
