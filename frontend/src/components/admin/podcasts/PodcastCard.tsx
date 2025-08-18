// components/PodcastCard.tsx
"use client";

import { Podcast } from "@/interfaces/podcasts";
import { motion } from "framer-motion";
import Image from "next/image";

interface PodcastCardProps {
  podcast: Podcast;
  onClick?: () => void;
}

export default function PodcastCard({ podcast, onClick }: PodcastCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <div className="rounded-2xl shadow-md bg-white dark:bg-neutral-900 overflow-hidden border border-neutral-200 dark:border-neutral-800 transition-colors">
        {/* Cover Image */}
       <Image
  src={podcast.coverImage ?? "/placeholder.jpg"} // fallback
  alt={podcast.title ?? "Podcast cover"}
  width={400}
  height={250}
  className="w-full h-48 object-cover"
/>


        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-neutral-800 dark:text-white truncate">
            {podcast.title}
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">
  {podcast.station?.name ?? "Unknown Station"}
</p>

        </div>
      </div>
    </motion.div>
  );
}
