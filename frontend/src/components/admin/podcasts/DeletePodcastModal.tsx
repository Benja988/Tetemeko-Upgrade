'use client';

import BaseModal from './BaseModal';

export default function DeletePodcastModal({ isOpen, onClose, onConfirm }: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Confirm Deletion">
      <p className="text-sm text-gray-700">Are you sure you want to delete this podcast? This action cannot be undone.</p>
      <div className="flex justify-end gap-2 pt-4">
        <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
        <button onClick={() => { onConfirm(); onClose(); }} className="px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-700">Delete</button>
      </div>
    </BaseModal>
  );
}
