'use client';

interface PodcastsTabsProps {
  currentFilter: string;
  onChangeFilter: (filter: string) => void;
}

export default function PodcastsTabs({ currentFilter, onChangeFilter }: PodcastsTabsProps) {
  const tabs = ['All', 'Published', 'Draft'];

  return (
    <div className="flex gap-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChangeFilter(tab)}
          className={`px-4 py-1.5 rounded-full border text-sm font-medium ${
            currentFilter === tab
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
