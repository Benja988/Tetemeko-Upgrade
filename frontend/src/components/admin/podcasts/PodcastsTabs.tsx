// frontend/src/components/admin/podcasts/PodcastsTabs.tsx

'use client';

interface PodcastsTabsProps {
  currentFilter: string;
  onChangeFilter: (filter: string) => void;
}

export default function PodcastsTabs({ currentFilter, onChangeFilter }: PodcastsTabsProps) {
  const tabs = ['All', 'Active', 'Inactive'];

  return (
    <div className="flex gap-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChangeFilter(tab)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            currentFilter === tab
              ? 'bg-indigo-600 text-white'
              : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}