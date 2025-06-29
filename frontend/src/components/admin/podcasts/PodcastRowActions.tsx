'use client';

import { Edit, Trash2, Download, MoreHorizontal } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface PodcastRowActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  onExport: () => void;
}

export default function PodcastRowActions({
  onEdit,
  onDelete,
  onExport,
}: PodcastRowActionsProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition"
      >
        <MoreHorizontal size={18} />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-40 origin-top-right rounded-md border border-gray-200 bg-white shadow-lg">
          <ul className="py-1 text-sm text-gray-700">
            <li>
              <button
                onClick={() => {
                  onEdit();
                  setOpen(false);
                }}
                className="w-full flex items-center px-4 py-2 hover:bg-gray-100"
              >
                <Edit size={16} className="mr-2" />
                Edit
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  onDelete();
                  setOpen(false);
                }}
                className="w-full flex items-center px-4 py-2 hover:bg-gray-100"
              >
                <Trash2 size={16} className="mr-2" />
                Delete
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  onExport();
                  setOpen(false);
                }}
                className="w-full flex items-center px-4 py-2 hover:bg-gray-100"
              >
                <Download size={16} className="mr-2" />
                Export
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
