'use client';

import { useState, useEffect, useRef } from "react";

interface Props {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  debounceTime?: number; // optional debounce time in ms, default 300
}

export default function StationsSearchFilter({
  searchTerm,
  onSearchChange,
  debounceTime = 300,
}: Props) {
  const [inputValue, setInputValue] = useState(searchTerm);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // Sync local input state when searchTerm prop changes
  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  // Handle debounced search change
  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      onSearchChange(inputValue.trim());
    }, debounceTime);

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [inputValue, onSearchChange, debounceTime]);

  // Clear input handler
  const handleClear = () => {
    setInputValue("");
    onSearchChange("");
  };

  return (
    <div className="relative mb-6">
      <input
        type="search"
        aria-label="Search stations by name, genre, or location"
        placeholder="Search by name, genre, or location..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      {inputValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          &#10005;
        </button>
      )}
    </div>
  );
}
