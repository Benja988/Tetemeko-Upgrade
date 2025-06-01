'use client';

import clsx from 'clsx';

interface AuthorTabsProps {
  activeFilter: string;
  setFilter: (filter: string) => void;
}

const tabs = [
  { label: 'All', value: '' },
  { label: 'Unverified', value: 'unverified' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Locked', value: 'locked' },
];

export default function AuthorTabs({ activeFilter, setFilter }: AuthorTabsProps) {
  return (
    <div className="flex gap-4 border-b border-gray-300">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => setFilter(tab.value)}
          className={clsx(
            'pb-2 text-sm font-medium border-b-2 transition-all',
            activeFilter === tab.value
              ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
              : 'border-transparent text-gray-600 hover:text-[var(--color-primary)]'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
