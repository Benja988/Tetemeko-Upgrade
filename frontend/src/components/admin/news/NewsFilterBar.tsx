'use client';

interface NewsFilterBarProps {
  onFilter: (filter: string) => void;
}

const categories = ["All", "Technology", "Business", "Health", "Sports", "Entertainment"];

export default function NewsFilterBar({ onFilter }: NewsFilterBarProps) {
  return (
    <select
      onChange={(e) => onFilter(e.target.value)}
      className="border border-gray-300 rounded-xl px-4 py-2 shadow-sm bg-white text-sm"
      defaultValue="All"
    >
      {categories.map((cat) => (
        <option key={cat} value={cat === "All" ? "" : cat}>
          {cat}
        </option>
      ))}
    </select>
  );
}
