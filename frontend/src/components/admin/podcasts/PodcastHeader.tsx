// src/components/podcasts/PodcastHeader.tsx
"use client";

import React from "react";

interface Props {
  onAddPodcast: () => void;
}

const PodcastHeader: React.FC<Props> = ({ onAddPodcast }) => {
  return (
    <div className="flex items-center justify-between border-b pb-3 mb-4">
      <h1 className="text-2xl font-bold">Podcasts</h1>
      <button
        onClick={onAddPodcast}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        + Add Podcast
      </button>
    </div>
  );
};

export default PodcastHeader;
