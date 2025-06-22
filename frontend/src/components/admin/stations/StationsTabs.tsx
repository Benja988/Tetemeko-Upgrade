'use client';

interface StationsTabsProps {
  currentFilter: string;
  onChangeFilter: (filter: string) => void;
}

export default function StationsTabs({
  currentFilter,
  onChangeFilter,
}: StationsTabsProps) {
  const tabs = ['All', 'Active', 'Inactive'];

  return (
    <div
      role="tablist"
      aria-label="Station filter tabs"
      className="inline-flex gap-1 rounded-full bg-gray-100 p-1 shadow-sm select-none"
    >
      {tabs.map((tab) => {
        const isActive = currentFilter === tab;

        return (
          <button
            key={tab}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChangeFilter(tab)}
            type="button"
            className={`px-5 py-2 text-sm font-medium rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
              isActive
                ? 'bg-primary text-white shadow'
                : 'text-gray-700 hover:bg-white/70 hover:text-blue-600'
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
