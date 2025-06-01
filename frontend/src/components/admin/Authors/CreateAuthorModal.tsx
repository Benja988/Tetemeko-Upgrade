'use client';

import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import Image from 'next/image';
import { createAuthor, Author } from '@/services/authors';

interface CreateAuthorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void; // optional callback after creation
}

export const CreateAuthorModal: React.FC<CreateAuthorModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !bio) {
      alert('Please fill all required fields.');
      return;
    }

    try {
      setIsSubmitting(true);

      let avatarUrl = 'https://picsum.photos/200?random=1'; // default avatar URL

      if (avatarFile) {
        const formData = new FormData();
        formData.append('file', avatarFile);
        formData.append('upload_preset', 'YOUR_UPLOAD_PRESET'); // replace with your Cloudinary preset

        const res = await fetch('https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) throw new Error('Failed to upload avatar');

        const data = await res.json();
        avatarUrl = data.secure_url;
      }

      const authorData: Partial<Author> = {
        name,
        email,
        bio,
        avatar: avatarUrl,
      };

      await createAuthor(authorData);

    //   alert('Author created successfully!');
      onClose();
      onCreated?.();
      resetForm();
    } catch (error) {
      console.error('Error creating author:', error);
    //   alert('Failed to create author.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setBio('');
    setAvatarFile(null);
    setPreviewUrl(null);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-30" />

        <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full z-50 p-6">
          <Dialog.Title className="text-xl font-bold mb-4">Create Author</Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                className=" w-full border rounded px-3 py-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full border rounded px-3 py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Bio</label>
              <textarea
                className="w-full border rounded px-3 py-2"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Avatar</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {previewUrl && (
                <div className="mt-2">
                  <Image
                    src={previewUrl}
                    alt="Avatar Preview"
                    width={80}
                    height={80}
                    className="rounded-full"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
                onClick={() => {
                  onClose();
                  resetForm();
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {isSubmitting ? 'Creating...' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
};
