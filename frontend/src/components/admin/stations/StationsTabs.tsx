'use client';

interface StationsTabsProps {
  currentFilter: string;
  onChangeFilter: (filter: string) => void;
}

export default function StationsTabs({ currentFilter, onChangeFilter }: StationsTabsProps) {
  const tabs = ['All', 'Active', 'Inactive'];

  return (
    <div className="inline-flex rounded-full bg-gray-100 p-1 shadow-sm select-none">
      {tabs.map((tab) => {
        const isActive: boolean = currentFilter === tab;

        return (
          <button
            key={tab}
            onClick={() => onChangeFilter(tab)}
            type="button"
            aria-pressed={isActive}
            className={`
              relative px-5 py-2 text-sm font-semibold rounded-full
              transition-colors duration-200 ease-in-out
              focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
              ${
                isActive
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-700 hover:bg-secondary hover:text-blue-700'
              }
            `}
          >
            {tab}
            {isActive && (
              <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-1 rounded-full bg-white shadow-sm"></span>
            )}
          </button>
        );
      })}
    </div>
  );
}
