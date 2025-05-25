'use client';

import { useState } from "react";
import { NewsArticle } from "@/interfaces/News";

interface AddNewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (article: NewsArticle) => void;
}

const defaultArticle = {
  _id: "",
  title: "",
  imageSrc: "",
  text: "",
  tag: "",
  slug: "",
  category: "",
  videoSrc: null,
  listItems: [],
  relatedArticles: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default function AddNewsModal({ isOpen, onClose, onAdd }: AddNewsModalProps) {
  const [article, setArticle] = useState<NewsArticle>({ ...defaultArticle });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setArticle((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(article);
    setArticle({ ...defaultArticle });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg space-y-4"
      >
        <h2 className="text-xl font-semibold">Add News Article</h2>

        <input
          type="text"
          name="title"
          placeholder="Title"
          value={article.title}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />

        <input
          type="text"
          name="imageSrc"
          placeholder="Image URL"
          value={article.imageSrc}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />

        <textarea
          name="text"
          placeholder="Text"
          value={article.text}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 resize-y"
          rows={4}
          required
        />

        <input
          type="text"
          name="tag"
          placeholder="Tag"
          value={article.tag}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={article.category}
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
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
