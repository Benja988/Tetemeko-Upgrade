'use client';

import { useState } from "react";
import { Search } from "lucide-react";

interface NewsSearchBarProps {
  onSearch: (query: string) => void;
}

export default function NewsSearchBar({ onSearch }: NewsSearchBarProps) {
  const [searchInput, setSearchInput] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    onSearch(value);
  };

  return (
    <div className="flex items-center bg-white border border-gray-300 rounded-xl px-3 py-2 shadow-sm">
      <Search className="w-4 h-4 text-gray-500 mr-2" />
      <input
        type="text"
        placeholder="Search news..."
        value={searchInput}
        onChange={handleInputChange}
        className="w-full outline-none bg-transparent text-sm"
      />
    </div>
  );
}
