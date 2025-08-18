// src/components/podcasts/PodcastSearch.tsx
"use client";

import React, { useState } from "react";

interface Props {
  onSearch: (query: string) => void;
}

const PodcastSearch: React.FC<Props> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSearch} className="mb-4 flex gap-2">
      <input
        type="text"
        placeholder="Search podcasts..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border px-3 py-2 rounded w-full"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
      >
        Search
      </button>
    </form>
  );
};

export default PodcastSearch;
