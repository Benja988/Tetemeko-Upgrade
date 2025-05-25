'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import clsx from 'clsx';

// Tabs with paths matching dynamic category routes
const tabs = [
  { name: 'All Users', href: '/admin/dashboard/users' },
  { name: 'Pending Verification', href: '/admin/dashboard/users/pending' },
  { name: 'Invitations', href: '/admin/dashboard/users/invitations' },
  { name: 'Locked Accounts', href: '/admin/dashboard/users/locked' },
  { name: 'Deactivated Users', href: '/admin/dashboard/users/inactive' },
  { name: 'Admins & Managers', href: '/admin/dashboard/users/admins' },
];

export default function UsersTabs() {
  const pathname = usePathname();

  // Extract last segment to determine active tab
  const activeSlug = pathname?.split('/').pop();

  return (
    <nav aria-label="User tabs" className="border-b mb-4">
      <ul className="flex flex-wrap gap-4">
        {tabs.map((tab) => {
          const tabSlug = tab.href.split('/').pop();
          const isActive =
            pathname === tab.href || activeSlug === tabSlug || (tabSlug === 'users' && pathname === '/admin/dashboard/users');

          return (
            <li key={tab.name}>
              <Link
                href={tab.href}
                className={clsx(
                  'inline-block px-4 py-2 text-sm font-medium transition-colors duration-200',
                  isActive
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-blue-600'
                )}
              >
                {tab.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
