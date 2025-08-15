'use client';

type FilterType = "All" | "Active" | "Inactive";


interface StationsTabsProps {
  currentFilter: string;
  onChangeFilter: (filter: FilterType) => void; 
  className?: string;
}

export default function StationsTabs({
  currentFilter,
  onChangeFilter,
  className = "",
}: StationsTabsProps) {

  const tabs: { value: FilterType; label: string }[] = [
  { value: "All", label: "All Stations" },
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" }
];


  return (
    <div
      role="tablist"
      aria-label="Station status filters"
      className={`inline-flex gap-1 rounded-xl bg-gray-100 p-1 shadow-inner select-none ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = currentFilter === tab.value;
        const isAllTab = tab.value === 'All';

        return (
          <button
            key={tab.value}
            role="tab"
            aria-selected={isActive}
            aria-controls={`${tab.value}-tabpanel`}
            onClick={() => onChangeFilter(tab.value)}
            type="button"
            className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out 
              focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2
              ${
                isActive
                  ? 'bg-white text-indigo-700 shadow-md font-semibold'
                  : 'text-gray-600 hover:bg-white/50 hover:text-gray-800'
              }
              ${
                isAllTab ? 'min-w-[100px]' : 'min-w-[80px]'
              }`}
          >
            {tab.label}
            {isActive && (
              <span className="absolute inset-x-1 -bottom-px h-0.5 bg-indigo-500 rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}