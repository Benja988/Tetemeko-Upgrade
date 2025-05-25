'use client';

import { useState, useEffect } from "react";
import { NewsArticle } from "@/interfaces/News";

interface EditNewsModalProps {
  isOpen: boolean;
  article: NewsArticle | null;
  onClose: () => void;
  onEdit: (article: NewsArticle) => void;
}

export default function EditNewsModal({
  isOpen,
  article,
  onClose,
  onEdit,
}: EditNewsModalProps) {
  const [editedArticle, setEditedArticle] = useState<NewsArticle | null>(null);

  useEffect(() => {
    if (article) {
      setEditedArticle(article);
    }
  }, [article]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editedArticle) return;
    const { name, value } = e.target;
    setEditedArticle({ ...editedArticle, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedArticle) {
      onEdit(editedArticle);
      onClose();
    }
  };

  if (!isOpen || !editedArticle) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg space-y-4"
      >
        <h2 className="text-xl font-semibold">Edit News Article</h2>

        <input
          type="text"
          name="title"
          placeholder="Title"
          value={editedArticle.title}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />

        <input
          type="text"
          name="imageSrc"
          placeholder="Image URL"
          value={editedArticle.imageSrc}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />

        <textarea
          name="text"
          placeholder="Text"
          value={editedArticle.text}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 resize-y"
          rows={4}
          required
        />

        <input
          type="text"
          name="tag"
          placeholder="Tag"
          value={editedArticle.tag}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={editedArticle.category}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
