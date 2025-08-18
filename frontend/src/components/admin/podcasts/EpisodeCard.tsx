// components/EpisodeCard.tsx
"use client";

import { Play, Download } from "lucide-react";
import { motion } from "framer-motion";
import { Episode } from "@/interfaces/podcasts";

interface EpisodeCardProps {
  episode: Episode;
}

export default function EpisodeCard({ episode }: EpisodeCardProps) {
  return (
    <motion.div whileHover={{ scale: 1.02 }}>
      <div className="rounded-2xl shadow-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 flex items-start gap-4 transition-colors">
        {/* Content */}
        <div className="flex-1">
          <h4 className="text-md font-semibold text-neutral-800 dark:text-white">
            {episode.title}
          </h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">
            {episode.description}
          </p>
          <p className="text-xs text-neutral-400 mt-1">
            {new Date(episode.publishedDate).toLocaleDateString()} • {episode.duration} mins
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            className="p-2 rounded-full bg-neutral-800 text-white hover:bg-neutral-700 transition dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            <Play className="w-4 h-4" />
          </button>
          <button
            className="p-2 rounded-full border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
