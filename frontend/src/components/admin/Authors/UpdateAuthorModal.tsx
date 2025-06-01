'use client';

import React, { useState, useEffect } from 'react';
import { Author } from '@/types/author';

interface UpdateAuthorModalProps {
  author: Author | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedAuthor: Partial<Author> & { _id: string }) => Promise<void>;
}

export default function UpdateAuthorModal({
  author,
  isOpen,
  onClose,
  onUpdate,
}: UpdateAuthorModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (author) {
      setName(author.name || '');
      setEmail(author.email || '');
      setBio(author.bio || '');
      setAvatar(author.avatar || '');
      setIsVerified(author.isVerified || false);
    } else {
      setName('');
      setEmail('');
      setBio('');
      setAvatar('');
      setIsVerified(false);
    }
  }, [author]);

  if (!isOpen || !author) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onUpdate({
        _id: author._id,
        name,
        email,
        bio,
        avatar,
        isVerified,
      });
      onClose();
    } catch (error) {
      console.error('Update failed:', error);
      alert('Failed to update author.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="update-author-title"
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="update-author-title" className="text-xl font-semibold mb-4">
          Update Author
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Bio</span>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 resize-none"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Avatar URL</span>
            <input
              type="url"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
              placeholder="https://example.com/avatar.jpg"
            />
          </label>
          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isVerified}
              onChange={() => setIsVerified(!isVerified)}
            />
            <span className="text-sm font-medium text-gray-700">Verified</span>
          </label>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
