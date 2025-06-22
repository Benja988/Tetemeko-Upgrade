'use client';

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

interface Props {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  debounceTime?: number;
}

export default function StationsSearchFilter({
  searchTerm,
  onSearchChange,
  debounceTime = 300,
}: Props) {
  const [inputValue, setInputValue] = useState(searchTerm);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      onSearchChange(inputValue.trim());
    }, debounceTime);

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [inputValue, onSearchChange, debounceTime]);

  const handleClear = () => {
    setInputValue("");
    onSearchChange("");
  };

  return (
    <div className="relative mb-6 w-full max-w-md">
      <input
        type="search"
        aria-label="Search stations by name, genre, or location"
        placeholder="Search stations..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
      />
      {inputValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
