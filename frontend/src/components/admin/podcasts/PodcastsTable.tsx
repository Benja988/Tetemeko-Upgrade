'use client';

import { Podcast } from "@/interfaces/podcasts";
import { useState } from "react";

interface PodcastsTableProps {
  podcasts: Podcast[];
}

export default function PodcastsTable({ podcasts }: PodcastsTableProps) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [playing, setPlaying] = useState<number | null>(null);

  const toggleExpanded = (id: number) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  const togglePlay = (id: number) => {
    setPlaying((prev) => (prev === id ? null : id));
  };

  return (
    <div className="overflow-x-auto rounded-lg border bg-white">
      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-gray-100 text-left text-sm font-semibold">
          <tr>
            <th className="p-3">Image</th>
            <th className="p-3">Title</th>
            <th className="p-3">Category</th>
            <th className="p-3">Host</th>
            <th className="p-3">Episodes</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {podcasts.map((podcast) => (
            <>
              <tr
                key={podcast.id}
                className="border-t text-sm hover:bg-gray-50 transition-all duration-200"
              >
                <td className="p-3">
                  <img
                    src={podcast.imageUrl}
                    alt={podcast.title}
                    className="h-10 w-10 rounded object-cover"
                  />
                </td>
                <td className="p-3 font-medium">{podcast.title}</td>
                <td className="p-3">{podcast.category}</td>
                <td className="p-3">{podcast.host}</td>
                <td className="p-3">{podcast.episodes.length}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${
                      podcast.status === "Published"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {podcast.status}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => toggleExpanded(podcast.id)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {expanded === podcast.id ? "Hide" : "View"} Episodes
                  </button>
                </td>
              </tr>

              {expanded === podcast.id && (
                <tr className="bg-gray-50 text-sm">
                  <td colSpan={7} className="p-4">
                    <div className="space-y-4">
                      {podcast.episodes.map((episode) => (
                        <div
                          key={episode.id}
                          className="flex items-center justify-between bg-white p-4 rounded border shadow-sm"
                        >
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">
                              {episode.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              Duration: {episode.duration}
                            </p>
                          </div>
                          <div className="ml-4">
                            <button
                              onClick={() =>
                                togglePlay(podcast.id * 100 + episode.id)
                              }
                              className="text-sm text-blue-500 hover:underline"
                            >
                              {playing === podcast.id * 100 + episode.id
                                ? "Pause"
                                : "Play"}
                            </button>
                            {playing === podcast.id * 100 + episode.id && (
                              <audio autoPlay controls className="mt-2 w-64">
                                <source
                                  src={episode.audioUrl}
                                  type="audio/mpeg"
                                />
                                Your browser does not support the audio element.
                              </audio>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
