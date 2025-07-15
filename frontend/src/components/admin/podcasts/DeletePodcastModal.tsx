// components/admin/podcasts/DeletePodcastModal.tsx

'use client';

import BaseModal from './BaseModal';
import { deletePodcastById } from '@/lib/services/podcastServices';

interface DeletePodcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPodcastDeleted: (id: string) => void;
  podcast: { _id: string; title: string } | null;
}

export default function DeletePodcastModal({ isOpen, onClose, onPodcastDeleted, podcast }: DeletePodcastModalProps) {
  const handleConfirm = async () => {
    if (!podcast) return;
    const success = await deletePodcastById(podcast._id);
    if (success) {
      onPodcastDeleted(podcast._id);
      onClose();
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Confirm Podcast Deletion">
      <p className="text-sm text-gray-700">
        Are you sure you want to delete the podcast <strong>{podcast?.title || 'this podcast'}</strong>? This action will also delete all associated episodes and cannot be undone.
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