// components/admin/podcasts/EditPodcastModal.tsx

'use client';

import { useState, useEffect } from 'react';
import { z } from 'zod';
import BaseModal from './BaseModal';
import { updatePodcastById } from '@/lib/services/podcastServices';
import { Podcast } from '@/interfaces/podcasts';

const updatePodcastSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  category: z.string().min(1, 'Category is required').optional(),
  station: z.string().optional(),
  coverImage: z.instanceof(File).optional().or(z.string().optional()),
});

interface EditPodcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPodcastUpdated: (podcast: Podcast) => void;
  podcast: Podcast | null;
}

export default function EditPodcastModal({ isOpen, onClose, onPodcastUpdated, podcast }: EditPodcastModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    station: '',
    coverImage: null as File | null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (podcast) {
      setFormData({
        title: podcast.title,
        description: podcast.description,
        category: podcast.category?._id || '',
        station: podcast.station?._id || '',
        coverImage: null,
      });
    }
  }, [podcast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    if (!podcast) return;
    try {
      const data = updatePodcastSchema.parse(formData);
      setIsSubmitting(true);
      const formDataToSend = new FormData();
      if (data.title) formDataToSend.append('title', data.title);
      if (data.description) formDataToSend.append('description', data.description);
      if (data.category) formDataToSend.append('category', data.category);
      if (data.station) formDataToSend.append('station', data.station);
      if (data.coverImage instanceof File) formDataToSend{bp('coverImage', data.coverImage);

      const updatedPodcast = await updatePodcastById(podcast._id, formDataToSend);
      if (updatedPodcast) {
        onPodcastUpdated(updatedPodcast);
        onClose();
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Edit Podcast">
      <div className="space-y-4">
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
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>
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
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <input
            id="category"
            name="category"
            type="text"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter category ID"
          />
          {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
        </div>
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
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter station ID"
          />
          {errors.station && <p className="mt-1 text-sm text-red-600">{errors.station}</p>}
        </div>
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
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          />
          {errors.coverImage && <p className="mt-1 text-sm text-red-600">{errors.coverImage}</p>}
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Update'}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}