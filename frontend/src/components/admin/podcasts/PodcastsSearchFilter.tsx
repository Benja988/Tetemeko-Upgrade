// frontend/src/components/admin/podcasts/PodcastsSearchFilter.tsx

'use client';

import { Search } from 'lucide-react';

interface PodcastsSearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function PodcastsSearchFilter({ searchTerm, onSearchChange }: PodcastsSearchFilterProps) {
  return (
    <div className="w-full max-w-md">
      <label htmlFor="podcast-search" className="sr-only">
        Search Podcasts
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
          <Search size={18} />
        </span>
        <input
          id="podcast-search"
          type="text"
          placeholder="Search by title, category, or station..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
}