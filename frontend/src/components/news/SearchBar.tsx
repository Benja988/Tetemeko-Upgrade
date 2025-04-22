// src/components/news/SearchBar.tsx
'use client';

import { FC, useState } from 'react';
import { Search } from 'lucide-react';

// Define the prop type for SearchBar
interface SearchBarProps {
  onSearch: (query: string) => void; // The function that will be called when searching
}

const SearchBar: FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch(query); // Trigger the onSearch prop when the user performs a search
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <input
        type="text"
        placeholder="Search articles..."
        className="w-full px-4 py-3 rounded-full text-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        className="absolute right-4 top-3.5 text-gray-100"
        onClick={handleSearch} // Trigger search on button click
      >
        <Search />
      </button>
    </div>
  );
};

export default SearchBar;
