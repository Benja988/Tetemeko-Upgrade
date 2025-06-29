'use client';

import { useState } from 'react';
import BaseModal from './BaseModal';

export default function EditPodcastModal({ isOpen, onClose, onSubmit }: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}) {
  const [title, setTitle] = useState('Sample Podcast'); // Replace with selected podcast data
  const [host, setHost] = useState('John Doe');
  const [category, setCategory] = useState('Technology');

  const handleSubmit = () => {
    onSubmit({ title, host, category });
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Edit Podcast">
      <input className="w-full border px-4 py-2 rounded" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input className="w-full border px-4 py-2 rounded" placeholder="Host" value={host} onChange={(e) => setHost(e.target.value)} />
      <input className="w-full border px-4 py-2 rounded" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />

      <div className="flex justify-end gap-2 pt-4">
        <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
        <button onClick={handleSubmit} className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700">Update</button>
      </div>
    </BaseModal>
  );
}
