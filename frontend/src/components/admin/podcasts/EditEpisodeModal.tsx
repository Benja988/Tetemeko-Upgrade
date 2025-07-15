'use client';

import { useState, useEffect } from 'react';
import { z } from 'zod';
import BaseModal from './BaseModal';
import { updateEpisodeById } from '@/lib/services/episodeServices';
import { Episode } from '@/interfaces/podcasts';

const updateEpisodeSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  duration: z.number().min(1, 'Duration must be positive').optional(),
  episodeNumber: z.number().min(1, 'Episode number must be positive').optional(),
  tags: z.array(z.string()).optional(),
  audioFile: z.instanceof(File).optional(),
});

interface EditEpisodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEpisodeUpdated: (episode: Episode) => void;
  podcastId: string;
  episode: Episode | null;
}

export default function EditEpisodeModal({ isOpen, onClose, onEpisodeUpdated, podcastId, episode }: EditEpisodeModalProps) {
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

  useEffect(() => {
    if (episode) {
      setFormData({
        title: episode.title,
        description: episode.description,
        duration: episode.duration,
        episodeNumber: episode.episodeNumber,
        tags: episode.tags || [],
        audioFile: null,
      });
    }
  }, [episode]);

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
    if (!episode) return;
    try {
      const data = updateEpisodeSchema.parse(formData);
      setIsSubmitting(true);
      const formDataToSend = new FormData();
      if (data.title) formDataToSend.append('title', data.title);
      if (data.description) formDataToSend.append('description', data.description);
      if (data.duration) formDataToSend.append('duration', data.duration.toString());
      if (data.episodeNumber) formDataToSend.append('episodeNumber', data.episodeNumber.toString());
      if (data.tags) formDataToSend.append('tags', JSON.stringify(data.tags));
      if (data.audioFile) formDataToSend.append('audioFile', data.audioFile);

      const updatedEpisode = await updateEpisodeById(podcastId, episode._id, formDataToSend);
      if (updatedEpisode) {
        onEpisodeUpdated(updatedEpisode);
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
    <BaseModal isOpen={isOpen} onClose={onClose} title="Edit Episode">
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
           ought to be empty. Please check the provided code or specify additional details for the `deletePodcastById` function in the frontend service layer. Below, I'll provide the reengineered version of the `DeletePodcastModal.tsx` component, assuming the `deletePodcastById` function is correctly implemented as shown in the earlier frontend service code. I'll also include a new `DeleteEpisodeModal.tsx` component to complete the episode management functionality.

---

### Reengineered Components (Continued)

#### 14. `DeleteEpisodeModal.tsx` (New Component)
New component for confirming episode deletion, integrated with the `deleteEpisodeById` API.

<xaiArtifact artifact_id="7d948836-82ca-49d1-a76c-51efb4e20ff1" artifact_version_id="a24aa38f-8c9f-4a90-8aaf-e682bd15258d" title="DeleteEpisodeModal.tsx" contentType="text/typescript">
'use client';

import BaseModal from './BaseModal';
import { deleteEpisodeById } from '@/lib/services/episodeServices';
import { Episode } from '@/interfaces/podcasts';

interface DeleteEpisodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEpisodeDeleted: () => void;
  episode: Episode | null;
}

export default function DeleteEpisodeModal({ isOpen, onClose, onEpisodeDeleted, episode }: DeleteEpisodeModalProps) {
  const handleConfirm = async () => {
    if (!episode) return;
    const success = await deleteEpisodeById(episode.podcast, episode._id);
    if (success) {
      onEpisodeDeleted();
      onClose();
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Confirm Episode Deletion">
      <p className="text-sm text-gray-700">
        Are you sure you want to delete the episode <strong>{episode?.title || 'this episode'}</strong>? This action cannot be undone.
      </p>
      <div className="flex justify-end gap-2 pt-4">
        <button
          onClick={onClose}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          className="rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
        >
          Delete
        </button>
      </div>
    </BaseModal>
  );
}