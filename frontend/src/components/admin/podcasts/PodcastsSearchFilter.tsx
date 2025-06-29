'use client';

import { Search } from "lucide-react";

interface Props {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function PodcastsSearchFilter({ searchTerm, onSearchChange }: Props) {
  return (
    <div className="mb-6 w-full max-w-md">
      <label htmlFor="podcast-search" className="sr-only">
        Search Podcasts
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
          <Search size={18} />
        </span>
        <input
          id="podcast-search"
          type="text"
          placeholder="Search by title, category, or host..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        />
      </div>
    </div>
  );
}
