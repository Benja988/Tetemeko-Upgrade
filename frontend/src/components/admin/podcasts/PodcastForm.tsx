// src/components/podcasts/PodcastForm.tsx
"use client";

import React, { useState } from "react";

interface Props {
  onSubmit: (data: {
    title: string;
    description: string;
    category: string;
    station?: string;
    coverImage?: File | null;
  }) => void;
}

const PodcastForm: React.FC<Props> = ({ onSubmit }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    station: "",
    coverImage: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, coverImage: e.target.files[0] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border p-4 rounded shadow space-y-3"
    >
      <div>
        <label className="block font-medium">Title</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="border px-3 py-2 rounded w-full"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="border px-3 py-2 rounded w-full"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Category</label>
        <input
          type="text"
          name="category"
          value={form.category}
          onChange={handleChange}
          className="border px-3 py-2 rounded w-full"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Station</label>
        <input
          type="text"
          name="station"
          value={form.station}
          onChange={handleChange}
          className="border px-3 py-2 rounded w-full"
        />
      </div>

      <div>
        <label className="block font-medium">Cover Image</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Save Podcast
      </button>
    </form>
  );
};

export default PodcastForm;
