'use client';

import { useState, useEffect, useRef } from "react";
import { X, Search } from "lucide-react";

interface Props {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  debounceTime?: number;
  placeholder?: string;
  className?: string;
}

export default function StationsSearchFilter({
  searchTerm,
  onSearchChange,
  debounceTime = 300,
  placeholder = "Search stations...",
  className = "",
}: Props) {
  const [inputValue, setInputValue] = useState(searchTerm);
  const [isFocused, setIsFocused] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync with external searchTerm changes
  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  // Debounce the input changes
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
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClear();
    }
  };

  return (
    <div className={`relative w-full max-w-lg ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className={`h-4 w-4 ${inputValue ? 'text-indigo-600' : 'text-gray-400'} transition-colors`} />
        </div>
        
        <input
          ref={inputRef}
          type="search"
          aria-label="Search stations by name, genre, or location"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`block w-full pl-10 pr-10 py-2.5 text-sm bg-white border ${
            isFocused 
              ? 'border-indigo-500 ring-2 ring-indigo-200' 
              : 'border-gray-300 hover:border-gray-400'
          } rounded-lg shadow-sm transition-all duration-150 focus:outline-none`}
        />
        
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
              isFocused ? 'text-indigo-600' : 'text-gray-400'
            } hover:text-indigo-800 transition-colors`}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {inputValue && (
        <div className="mt-1 text-xs text-gray-500">
          Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-200">Esc</kbd> to clear
        </div>
      )}
    </div>
  );
}