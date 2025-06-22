'use client';

import { Category } from '@/interfaces/Category';
import { useEffect, useState } from 'react';
import { getCategories } from '@/services/categories/categoryService';

interface Props {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusChange: (val: string) => void;
  categoryFilter: string;
  onCategoryChange: (val: string) => void;
}

export default function NewsSearchFilterBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  categoryFilter,
  onCategoryChange,
}: Props) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories('news').then(setCategories);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white p-4 rounded-xl shadow">
      <input
        type="text"
        placeholder="Search news..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full sm:w-1/3 p-2 rounded border text-sm"
      />

      <select
        value={categoryFilter}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="w-full sm:w-1/3 p-2 rounded border text-sm"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
        className="w-full sm:w-1/3 p-2 rounded border text-sm"
      >
        <option value="">All Status</option>
        <option value="published">Published</option>
        <option value="unpublished">Unpublished</option>
      </select>
    </div>
  );
}
