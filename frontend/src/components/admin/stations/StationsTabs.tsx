'use client';

interface StationsTabsProps {
  currentFilter: string;
  onChangeFilter: (filter: string) => void;
}

export default function StationsTabs({ currentFilter, onChangeFilter }: StationsTabsProps) {
  const tabs = ['All', 'Live', 'Offline'];

  return (
    <div className="flex gap-4 mb-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChangeFilter(tab)}
          className={`px-4 py-2 rounded-full font-medium ${
            currentFilter === tab
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
