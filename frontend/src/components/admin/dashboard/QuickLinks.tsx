'use client';

import Link from 'next/link';
import { PlusCircle, Users, BarChart3 } from 'lucide-react';

const quickLinks = [
  {
    href: '/admin/users',
    icon: <Users className="text-blue-600" />,
    label: 'Manage Users',
    bgHover: 'hover:bg-blue-50',
  },
  {
    href: '/admin/podcasts/upload',
    icon: <PlusCircle className="text-purple-600" />,
    label: 'Upload Podcast',
    bgHover: 'hover:bg-purple-50',
  },
  {
    href: '/admin/analytics',
    icon: <BarChart3 className="text-green-600" />,
    label: 'View Analytics',
    bgHover: 'hover:bg-green-50',
  },
];

export default function QuickLinks() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {quickLinks.map((link, idx) => (
        <Link
          key={idx}
          href={link.href}
          className={`flex items-center gap-3 p-4 bg-white ${link.bgHover} border border-gray-200 rounded-xl shadow transition`}
        >
          {link.icon}
          <span className="text-gray-800 font-medium">{link.label}</span>
        </Link>
      ))}
    </div>
  );
}
