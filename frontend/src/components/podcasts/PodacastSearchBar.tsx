// SearchBar.tsx
"use client";

import { useState } from "react";

export default function PodcastSearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center border border-gray-300 rounded-lg p-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search podcasts..."
        className="outline-none p-2 w-full"
      />
      <button type="submit" className="text-gray-600 hover:text-gray-900">
        🔍
      </button>
    </form>
  );
}
