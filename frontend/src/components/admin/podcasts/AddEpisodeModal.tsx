'use client';

import { useState } from 'react';
import { z } from 'zod';
import BaseModal from './BaseModal';
import { createEpisode } from '@/lib/services/episodeServices';
import { Episode } from '@/interfaces/podcasts';

const createEpisodeSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  description: z.string().min(1, 'Description is required'),
  duration: z.number().min(1, 'Duration must be positive'),
  episodeNumber: z.number().min(1, 'Episode number must be positive').optional(),
  tags: z.array(z.string()).optional(),
  audioFile: z.instanceof(File, { message: 'Audio file is required' }),
});

interface AddEpisodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEpisodeAdded: (episode: Episode) => void;
  podcastId: string;
}

export default function AddEpisodeModal({ isOpen, onClose, onEpisodeAdded, podcastId }: AddEpisodeModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 0,
    episodeNumber: undefined as number | undefined,
    tags: [] as string[],
    audioFile: null as File | null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'duration' || name === 'episodeNumber' ? parseInt(value) || 0 : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map((tag) => tag.trim()).filter((tag) => tag);
    setFormData((prev) => ({ ...prev, tags }));
    setErrors((prev) => ({ ...prev, tags: '' }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFormData((prev) => ({ ...prev, audioFile: file || null }));
    setErrors((prev) => ({ ...prev, audioFile: '' }));
  };

  const handleSubmit = async () => {
    try {
      const data = createEpisodeSchema.parse(formData);
      setIsSubmitting(true);
      const formDataToSend = new FormData();
      formDataToSend.append('title', data.title);
      formDataToSend.append('description', data.description);
      formDataToSend.append('duration', data.duration.toString());
      if (data.episodeNumber) formDataToSend.append('episodeNumber', data.episodeNumber.toString());
      if (data.tags) formDataToSend.append('tags', JSON.stringify(data.tags));
      if (data.audioFile) formDataToSend.append('audioFile', data.audioFile);

      const episode = await createEpisode(podcastId, formDataToSend);
      if (episode) {
        onEpisodeAdded(episode);
        onClose();
        setFormData({
          title: '',
          description: '',
          duration: 0,
          episodeNumber: undefined,
          tags: [],
          audioFile: null,
        });
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
    <BaseModal isOpen={isOpen} onClose={onClose} title="Add New Episode">
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
            placeholder="Enter episode title"
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
            placeholder="Enter episode description"
            rows={4}
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
            Duration (minutes)
          </label>
          <input
            id="duration"
            name="duration"
            type="number"
            value={formData.duration || ''}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter duration in minutes"
          />
          {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration}</p>}
        </div>
        <div>
          <label htmlFor="episodeNumber" className="block text-sm font-medium text-gray-700">
            Episode Number (Optional)
          </label>
          <input
            id="episodeNumber"
            name="episodeNumber"
            type="number"
            value={formData.episodeNumber || ''}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter episode number"
          />
          {errors.episodeNumber && <p className="mt-1 text-sm text-red-600">{errors.episodeNumber}</p>}
        </div>
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
            Tags (Optional, comma-separated)
          </label>
          <input
            id="tags"
            name="tags"
            type="text"
            onChange={handleTagsChange}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter tags (e.g., tech, interview)"
          />
          {errors.tags && <p className="mt-1 text-sm text-red-600">{errors.tags}</p>}
        </div>
        <div>
          <label htmlFor="audioFile" className="block text-sm font-medium text-gray-700">
            Audio File
          </label>
          <input
            id="audioFile"
            name="audioFile"
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          />
          {errors.audioFile && <p className="mt-1 text-sm text-red-600">{errors.audioFile}</p>}
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
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}