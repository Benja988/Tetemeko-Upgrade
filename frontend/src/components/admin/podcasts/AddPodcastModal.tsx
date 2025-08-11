
'use client';

import { useEffect, useState } from 'react';
import { z } from 'zod';
import BaseModal from './BaseModal';
import { Podcast } from '@/interfaces/podcasts';
import { createPodcast } from '@/services/podcasts/podcastsService';
import { getCategories } from '@/services/categories/categoryService';
import { getStations } from '@/services/stations';
import { Category } from '@/interfaces/Category';
import { Station } from '@/interfaces/Station';

// Zod schema aligned with backend validation
const createPodcastSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required and must be 1-200 characters')
    .max(200, 'Title must be 200 characters or less'),
  description: z.string().trim().min(1, 'Description is required'),
  category: z
    .string()
    .min(1, 'Category is required')
    .refine((val) => /^[0-9a-fA-F]{24}$/.test(val), { message: 'Invalid category ID' }),
  station: z
    .string()
    .optional()
    .refine((val) => !val || /^[0-9a-fA-F]{24}$/.test(val), { message: 'Invalid station ID' }),
  coverImage: z.instanceof(File).optional().or(z.string().url().optional()),
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
  const [stations, setStations] = useState<Station[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData | 'form', string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch categories and stations when modal opens
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryResponse, stationResponse] = await Promise.all([
          getCategories(),
          getStations(),
        ]);

        if (categoryResponse) {
          const podcastCategories = categoryResponse.filter(
            (cat: Category) => cat.categoryType === 'podcast'
          );
          setCategories(podcastCategories);
        }
        if (stationResponse) {
          const activeStations = stationResponse.filter((station: Station) => station.isActive);
          setStations(activeStations);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setErrors({ form: 'Failed to load categories or stations' });
      }
    };

    if (isOpen) {
      fetchData();
      setFormData({ title: '', description: '', category: '', station: '', coverImage: null });
      setErrors({});
    }
  }, [isOpen]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Handle file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFormData((prev) => ({ ...prev, coverImage: file || null }));
    setErrors((prev) => ({ ...prev, coverImage: '' }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Validate form data
      const data = createPodcastSchema.parse({
        ...formData,
        title: formData.title.trim(), // Ensure no leading/trailing spaces
        description: formData.description.trim(),
      });
      setIsSubmitting(true);

      // Prepare FormData for API
      const formDataToSend = new FormData();
      formDataToSend.append('title', data.title);
      formDataToSend.append('description', data.description);
      formDataToSend.append('category', data.category);
      if (data.station) formDataToSend.append('station', data.station);
      if (data.coverImage instanceof File) formDataToSend.append('coverImage', data.coverImage);
      else if (data.coverImage) formDataToSend.append('coverImage', data.coverImage);

      // Debug FormData contents
      console.log('FormData contents:');
      for (const [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
      }

      const podcast = await createPodcast(formDataToSend);
      if (podcast) {
        onPodcastAdded(podcast);
        onClose();
      } else {
        throw new Error('No podcast returned from API');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof typeof formData | 'form', string>> = {};
        error.issues.forEach((err) => {
          const path = err.path[0];
          if (typeof path === 'string' && ['title', 'description', 'category', 'station', 'coverImage'].includes(path)) {
            fieldErrors[path as keyof typeof formData] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ form: error instanceof Error ? error.message : 'Failed to create podcast. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Add New Podcast">
      <div className="space-y-6 p-6">
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
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter podcast title"
            disabled={isSubmitting}
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
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
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter podcast description"
            rows={4}
            disabled={isSubmitting}
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
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
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            disabled={isSubmitting || categories.length === 0}
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
        </div>

        {/* Station Dropdown */}
        <div>
          <label htmlFor="station" className="block text-sm font-medium text-gray-700">
            Station (Optional)
          </label>
          <select
            id="station"
            name="station"
            value={formData.station}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            disabled={isSubmitting || stations.length === 0}
          >
            <option value="">Select station (optional)</option>
            {stations.map((station) => (
              <option key={station._id} value={station._id}>
                {station.name}
              </option>
            ))}
          </select>
          {errors.station && <p className="mt-1 text-sm text-red-600">{errors.station}</p>}
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
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-indigo-700"
            disabled={isSubmitting}
          />
          {formData.coverImage && (
            <p className="mt-1 text-sm text-gray-600">Selected: {formData.coverImage.name}</p>
          )}
          {errors.coverImage && <p className="mt-1 text-sm text-red-600">{errors.coverImage}</p>}
        </div>

        {/* Form-level error */}
        {errors.form && <p className="text-sm text-red-600">{errors.form}</p>}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Podcast'}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
