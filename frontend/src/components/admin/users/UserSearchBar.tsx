'use client';

import { Search, X } from "lucide-react";
import { useState } from "react";

export default function UserSearchBar({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState("");

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div className="relative w-full sm:w-80">
      {/* Search Icon */}
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <Search className="w-5 h-5" />
      </div>

      {/* Input */}
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onSearch(e.target.value);
        }}
        placeholder="Search by name or email"
        className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 bg-white shadow-sm text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />

      {/* Clear Icon */}
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
