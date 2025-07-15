'use client';

import { useEffect, useState } from 'react';
import { z } from 'zod';
import BaseModal from './BaseModal';
import { Podcast } from '@/interfaces/podcasts';
import { createPodcast } from '@/services/podcasts/podcastsService';
import { getCategories } from '@/services/categories/categoryService';
import { Category } from '@/interfaces/Category';

const createPodcastSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  station: z.string().optional(),
  coverImage: z.instanceof(File).optional().or(z.string().optional()),
});

interface AddPodcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPodcastAdded: (podcast: Podcast) => void;
}

export default function AddPodcastModal({ isOpen, onClose, onPodcastAdded }: AddPodcastModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    station: '',
    coverImage: null as File | null,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        if (response) {
          const podcastCategories = response.filter((cat: Category) => cat.categoryType === 'podcast').filter(
            (cat: Category) => cat.categoryType === 'podcast'
          );
          setCategories(podcastCategories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFormData((prev) => ({ ...prev, coverImage: file || null }));
    setErrors((prev) => ({ ...prev, coverImage: '' }));
  };

  const handleSubmit = async () => {
    try {
      const data = createPodcastSchema.parse(formData);
      setIsSubmitting(true);
      const formDataToSend = new FormData();
      formDataToSend.append('title', data.title);
      formDataToSend.append('description', data.description);
      formDataToSend.append('category', data.category);
      if (data.station) formDataToSend.append('station', data.station);
      if (data.coverImage instanceof File) formDataToSend.append('coverImage', data.coverImage);

      const podcast = await createPodcast(formDataToSend);
      if (podcast) {
        onPodcastAdded(podcast);
        onClose();
        setFormData({ title: '', description: '', category: '', station: '', coverImage: null });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (typeof err.path[0] === 'string') fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Add New Podcast">
      <div className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border px-3 py-2"
            placeholder="Enter podcast title"
          />
          {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border px-3 py-2"
            placeholder="Enter podcast description"
            rows={4}
          />
          {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
        </div>

        {/* Category Dropdown */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border px-3 py-2"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-sm text-red-600">{errors.category}</p>}
        </div>

        {/* Station */}
        <div>
          <label htmlFor="station" className="block text-sm font-medium text-gray-700">
            Station (Optional)
          </label>
          <input
            id="station"
            name="station"
            type="text"
            value={formData.station}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border px-3 py-2"
            placeholder="Enter station ID"
          />
          {errors.station && <p className="text-sm text-red-600">{errors.station}</p>}
        </div>

        {/* Cover Image */}
        <div>
          <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700">
            Cover Image (Optional)
          </label>
          <input
            id="coverImage"
            name="coverImage"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 w-full rounded-md border px-3 py-2"
          />
          {errors.coverImage && <p className="text-sm text-red-600">{errors.coverImage}</p>}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
