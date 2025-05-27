'use client';

interface Props {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function PodcastsSearchFilter({ searchTerm, onSearchChange }: Props) {
  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Search by title, category, or host..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}
