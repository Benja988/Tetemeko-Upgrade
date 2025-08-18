// src/components/podcasts/PodcastTable.tsx
"use client";

import React from "react";
import { Podcast } from "@/interfaces/podcasts";

interface Props {
  podcasts: Podcast[];
}

const PodcastTable: React.FC<Props> = ({ podcasts }) => {
  if (podcasts.length === 0) {
    return <p className="text-gray-500">No podcasts found.</p>;
  }

  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr className="bg-gray-100 text-left">
          <th className="border px-3 py-2">Cover</th>
          <th className="border px-3 py-2">Title</th>
          <th className="border px-3 py-2">Category</th>
          <th className="border px-3 py-2">Station</th>
          <th className="border px-3 py-2">Status</th>
        </tr>
      </thead>
      <tbody>
        {podcasts.map((p) => (
          <tr key={p._id} className="hover:bg-gray-50">
            <td className="border px-3 py-2">
              {p.coverImage ? (
                <img
                  src={p.coverImage}
                  alt={p.title}
                  className="w-12 h-12 object-cover rounded"
                />
              ) : (
                <span className="text-gray-400">No Image</span>
              )}
            </td>
            <td className="border px-3 py-2 font-medium">{p.title}</td>
            <td className="border px-3 py-2">{p.category?.name || "N/A"}</td>
            <td className="border px-3 py-2">{p.station?.name || "N/A"}</td>
            <td
              className={`border px-3 py-2 font-medium ${
                p.isActive ? "text-green-600" : "text-red-600"
              }`}
            >
              {p.isActive ? "Active" : "Inactive"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PodcastTable;
