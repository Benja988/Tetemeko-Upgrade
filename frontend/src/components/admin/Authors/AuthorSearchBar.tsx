'use client';

import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

interface AuthorSearchBarProps {
  onSearch: (query: string) => void;
}

export default function AuthorSearchBar({ onSearch }: AuthorSearchBarProps) {
  const [input, setInput] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(input.trim());
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-sm">
      <input
        type="text"
        placeholder="Search authors..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-4 py-2 pr-10 focus:outline-none focus:border-[var(--color-primary)]"
      />
      <button type="submit" className="absolute right-3 top-2.5 text-gray-500 hover:text-[var(--color-primary)]">
        <FiSearch />
      </button>
    </form>
  );
}
