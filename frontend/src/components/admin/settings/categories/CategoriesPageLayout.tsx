'use client';

import { useEffect, useState } from 'react';
import CategoryTable from './CategoryTable';
import CategoryFormModal from './CategoryFormModal';
import CategoryFilter from './CategoryFilter';
import { Category } from '@/interfaces/Category';
import {
  getCategories,
  deleteCategory,
} from '@/services/categories/categoryService';

export default function CategoriesPageLayout() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [filter, setFilter] = useState<string>('');

  const fetchCategories = async () => {
    const data = await getCategories(filter);
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, [filter]);

  const handleCreate = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setModalOpen(true);
  };

  const handleDelete = async (slug: string) => {
    const confirmed = confirm('Are you sure you want to delete this category?');
    if (confirmed) {
      const success = await deleteCategory(slug);
      if (success) {
        fetchCategories();
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Categories</h1>
        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition"
        >
          Create Category
        </button>
      </div>

      <CategoryFilter value={filter} onChange={setFilter} />
      <CategoryTable
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchCategories}
        initialData={editingCategory}
      />
    </div>
  );
}
