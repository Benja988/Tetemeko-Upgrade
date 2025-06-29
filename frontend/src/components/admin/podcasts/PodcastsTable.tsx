'use client';

import { useState } from 'react';
import { Podcast } from '@/interfaces/podcasts';
import {
  MoreVertical,
  Edit,
  Trash2,
  Download,
  Play,
  Pause,
} from 'lucide-react';

import { Menu } from '@headlessui/react';
import EditPodcastModal from './EditPodcastModal';
import DeletePodcastModal from './DeletePodcastModal';
import ExportPodcastModal from './ExportPodcastModal';

interface PodcastsTableProps {
  podcasts: Podcast[];
}


export default function PodcastsTable({ podcasts }: PodcastsTableProps) {
  const [playing, setPlaying] = useState<number | null>(null);
  const [expandedPodcasts, setExpandedPodcasts] = useState<Record<number, boolean>>({});
  const [activeModal, setActiveModal] = useState<{
    type: 'edit' | 'delete' | 'export' | null;
    podcast: Podcast | null;
  }>({ type: null, podcast: null });

  const togglePlay = (uniqueId: number) => {
    setPlaying((prev) => (prev === uniqueId ? null : uniqueId));
  };

  const toggleExpand = (podcastId: number) => {
    setExpandedPodcasts((prev) => ({
      ...prev,
      [podcastId]: !prev[podcastId],
    }));
  };

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-md">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-blue-50 text-blue-700 text-xs uppercase font-semibold tracking-wider">
            <tr>
              <th className="px-5 py-3">Image</th>
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Host</th>
              <th className="px-5 py-3">Episodes</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {podcasts.map((podcast, index) => {
              const isExpanded = expandedPodcasts[podcast.id] || false;
              const visibleEpisodes = isExpanded
                ? podcast.episodes
                : podcast.episodes.slice(0, 1);

              return (
                <tr
                  key={podcast.id}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="px-5 py-4 align-top">
                    <img
                      src={podcast.imageUrl}
                      alt={podcast.title}
                      className="w-12 h-12 object-cover rounded-lg border border-gray-200 shadow-sm"
                    />
                  </td>
                  <td className="px-5 py-4 font-semibold text-gray-800 align-top">
                    {podcast.title}
                  </td>
                  <td className="px-5 py-4 align-top">
                    <span className="inline-block rounded-full px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium">
                      {podcast.category}
                    </span>
                  </td>
                  <td className="px-5 py-4 align-top">{podcast.host}</td>
                  <td className="px-5 py-4 align-top">
                    <div className="flex flex-col gap-3">
                      {visibleEpisodes.map((episode) => {
                        const uniqueId = podcast.id * 100 + episode.id;
                        const isPlaying = playing === uniqueId;

                        return (
                          <div
                            key={episode.id}
                            className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 shadow-sm"
                          >
                            <div>
                              <p className="font-medium text-gray-900">
                                {episode.title}
                              </p>
                              <p className="text-xs text-gray-500">
                                ⏱️ {episode.duration}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => togglePlay(uniqueId)}
                                className={`text-sm font-medium px-3 py-1.5 rounded-full transition-colors ${isPlaying
                                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                                  }`}
                              >
                                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                              </button>

                              {isPlaying && (
                                <audio autoPlay controls className="w-52">
                                  <source
                                    src={episode.audioUrl}
                                    type="audio/mpeg"
                                  />
                                  Your browser does not support the audio element.
                                </audio>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {podcast.episodes.length > 2 && (
                        <button
                          onClick={() => toggleExpand(podcast.id)}
                          className="text-blue-600 text-xs mt-1 hover:underline"
                        >
                          {isExpanded
                            ? 'Show Less'
                            : `Show ${podcast.episodes.length - 1} More`}
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 align-top">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${podcast.status === 'Published'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}
                    >
                      {podcast.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 align-top text-right">
                    <Menu as="div" className="relative inline-block text-left">
                      <Menu.Button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none">
                        <MoreVertical size={18} />
                      </Menu.Button>

                      <Menu.Items className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() =>
                                  setActiveModal({ type: 'edit', podcast })
                                }
                                className={`${active ? 'bg-gray-100' : ''
                                  } w-full px-4 py-2 text-sm text-gray-700 flex items-center gap-2`}
                              >
                                <Edit size={16} /> Edit
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() =>
                                  setActiveModal({ type: 'delete', podcast })
                                }
                                className={`${active ? 'bg-gray-100' : ''
                                  } w-full px-4 py-2 text-sm text-gray-700 flex items-center gap-2`}
                              >
                                <Trash2 size={16} /> Delete
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() =>
                                  setActiveModal({ type: 'export', podcast })
                                }
                                className={`${active ? 'bg-gray-100' : ''
                                  } w-full px-4 py-2 text-sm text-gray-700 flex items-center gap-2`}
                              >
                                <Download size={16} /> Export
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Menu>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <EditPodcastModal
        isOpen={activeModal.type === 'edit'}
        onClose={() => setActiveModal({ type: null, podcast: null })}
        onSubmit={() => {
          // handle deletion logic
          setActiveModal({ type: null, podcast: null });
        }}
      />
      <DeletePodcastModal
        isOpen={activeModal.type === 'delete'}
        onClose={() => setActiveModal({ type: null, podcast: null })}
        onConfirm={() => {
          // handle deletion logic
          setActiveModal({ type: null, podcast: null });
        }}
      />
      <ExportPodcastModal
        isOpen={activeModal.type === 'export'}
        onClose={() => setActiveModal({ type: null, podcast: null })}
        onExport={() => {
          // handle edit logic
          setActiveModal({ type: null, podcast: null });
        }}
      />
    </>
  );
}
