// components/admin/podcasts/PodcastRowActions.tsx

'use client';

import { Menu } from '@headlessui/react';
import { Edit, Trash2, Download } from 'lucide-react';

interface PodcastRowActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  onExport: () => void;
}

export default function PodcastRowActions({ onEdit, onDelete, onExport }: PodcastRowActionsProps) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="rounded-full p-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </Menu.Button>
      <Menu.Items className="absolute right-0 z-20 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="py-1">
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={onEdit}
                className={`flex w-full items-center px-4 py-2 text-sm text-gray-700 ${active ? 'bg-gray-100' : ''}`}
              >
                <Edit size={16} className="mr-2" />
                Edit
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={onDelete}
                className={`flex w-full items-center px-4 py-2 text-sm text-gray-700 ${active ? 'bg-gray-100' : ''}`}
              >
                <Trash2 size={16} className="mr-2" />
                Delete
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={onExport}
                className={`flex w-full items-center px-4 py-2 text-sm text-gray-700 ${active ? 'bg-gray-100' : ''}`}
              >
                <Download size={16} className="mr-2" />
                Export
              </button>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  );
}
