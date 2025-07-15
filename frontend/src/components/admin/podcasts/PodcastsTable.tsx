// components/admin/podcasts/PodcastsTable.tsx

'use client';

import { useState } from 'react';
import { Podcast, Episode } from '@/interfaces/podcasts';
import { Play, Pause, Edit, Trash2, Download } from 'lucide-react';
import { Menu } from '@headlessui/react';
import EditPodcastModal from './EditPodcastModal';
import DeletePodcastModal from './DeletePodcastModal';
import ExportPodcastModal from './ExportPodcastModal';
import { togglePodcastStatus } from '@/services/podcasts/podcastsService';
import { deleteEpisodeById } from '@/services/episodes/episodeServices';
import PodcastRowActions from './PodcastRowActions';
import AddEpisodeModal from './AddEpisodeModal';
import EditEpisodeModal from './EditEpisodeModal';
import DeleteEpisodeModal from './DeleteEpisodeModal';

interface PodcastsTableProps {
  podcasts: Podcast[];
  onPodcastUpdated: (podcast: Podcast) => void;
  onPodcastDeleted: (id: string) => void;
  onEpisodeAdded: (podcastId: string, episode: Episode) => void;
  onEpisodeUpdated: (podcastId: string, episode: Episode) => void;
  onEpisodeDeleted: (podcastId: string, episodeId: string) => void;
  onExport: (format: string) => void;
  selectedPodcasts: string[];
  onSelectPodcast: (id: string) => void;
}

export default function PodcastsTable({
  podcasts,
  onPodcastUpdated,
  onPodcastDeleted,
  onEpisodeAdded,
  onEpisodeUpdated,
  onEpisodeDeleted,
  onExport,
  selectedPodcasts,
  onSelectPodcast,
}: PodcastsTableProps) {
  const [activeModal, setActiveModal] = useState<{
    type: 'editPodcast' | 'deletePodcast' | 'export' | 'addEpisode' | 'editEpisode' | 'deleteEpisode' | null;
    podcast: Podcast | null;
    episode: Episode | null;
  }>({ type: null, podcast: null, episode: null });
  const [playing, setPlaying] = useState<string | null>(null);
  const [expandedPodcasts, setExpandedPodcasts] = useState<Record<string, boolean>>({});

  const togglePlay = (episodeId: string) => {
    setPlaying((prev) => (prev === episodeId ? null : episodeId));
  };

  const toggleExpand = (podcastId: string) => {
    setExpandedPodcasts((prev) => ({
      ...prev,
      [podcastId]: !prev[podcastId],
    }));
  };

  const handleToggleStatus = async (podcast: Podcast) => {
    const updatedPodcast = await togglePodcastStatus(podcast._id);
    if (updatedPodcast) {
      onPodcastUpdated(updatedPodcast);
    }
  };

  const handleDeleteEpisode = async (podcastId: string, episodeId: string) => {
    const success = await deleteEpisodeById(podcastId, episodeId);
    if (success) {
      onEpisodeDeleted(podcastId, episodeId);
    }
  };

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-md">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-indigo-50 text-xs font-semibold uppercase tracking-wider text-indigo-700">
            <tr>
              <th className="px-5 py-3">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      podcasts.forEach((p) => onSelectPodcast(p._id));
                    } else {
                      podcasts.forEach((p) => onSelectPodcast(p._id));
                    }
                  }}
                  checked={selectedPodcasts.length === podcasts.length && podcasts.length > 0}
                />
              </th>
              <th className="px-5 py-3">Image</th>
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Station</th>
              <th className="px-5 py-3">Episodes</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {podcasts.map((podcast) => {
              const isExpanded = expandedPodcasts[podcast._id] || false;
              const episodes = podcast.episodes ?? [];
              const visibleEpisodes = isExpanded ? episodes : episodes.slice(0, 1);

              return (
                <tr
                  key={podcast._id}
                  className={selectedPodcasts.includes(podcast._id) ? 'bg-gray-100' : 'bg-white'}
                >
                  <td className="px-5 py-4">
                    <input
                      type="checkbox"
                      checked={selectedPodcasts.includes(podcast._id)}
                      onChange={() => onSelectPodcast(podcast._id)}
                    />
                  </td>
                  <td className="px-5 py-4 align-top">
                    <img
                      src={podcast.coverImage || 'https://via.placeholder.com/48'}
                      alt={podcast.title}
                      className="h-12 w-12 rounded-lg border border-gray-200 object-cover shadow-sm"
                    />
                  </td>
                  <td className="px-5 py-4 align-top font-semibold text-gray-800">{podcast.title}</td>
                  <td className="px-5 py-4 align-top">
                    <span className="inline-block rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                      {podcast.category && typeof podcast.category === 'object' && 'name' in podcast.category
                        ? (podcast.category as { name: string }).name
                        : typeof podcast.category === 'string'
                        ? podcast.category
                        : 'N/A'}
                    </span>
                  </td>
                  <td className="px-5 py-4 align-top">
                    {podcast.station && typeof podcast.station === 'object' && 'name' in podcast.station
                      ? (podcast.station as { name: string }).name
                      : typeof podcast.station === 'string'
                      ? podcast.station
                      : 'N/A'}
                  </td>
                  <td className="px-5 py-4 align-top">
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => setActiveModal({ type: 'addEpisode', podcast, episode: null })}
                        className="mb-2 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
                      >
                        Add Episode
                      </button>
                      {visibleEpisodes.map((episode) => (
                        <div
                          key={episode._id}
                          className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 shadow-sm"
                        >
                          <div>
                            <p className="font-medium text-gray-900">{episode.title}</p>
                            <p className="text-xs text-gray-500">⏱️ {episode.duration} min</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => togglePlay(episode._id)}
                              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                                playing === episode._id
                                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                            >
                              {playing === episode._id ? <Pause size={16} /> : <Play size={16} />}
                            </button>
                            <Menu as="div" className="relative">
                              <Menu.Button className="rounded-full p-2 text-gray-600 hover:bg-gray-100">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                              </Menu.Button>
                              <Menu.Items className="absolute right-0 z-10 mt-2 w-36 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                                <div className="py-1">
                                  <Menu.Item>
                                    {({ active }) => (
                                      <button
                                        onClick={() => setActiveModal({ type: 'editEpisode', podcast, episode })}
                                        className={`flex w-full items-center px-4 py-2 text-sm text-gray-700 ${active ? 'bg-gray-100' : ''}`}
                                      >
                                        <Edit size={16} className="mr-2" />
                                        Edit
                                      </button>
                                    )}
                                  </Menu.Item>
                                  <Menu.Item>
                                    {({ active }) => (
                                      <button
                                        onClick={() => setActiveModal({ type: 'deleteEpisode', podcast, episode })}
                                        className={`flex w-full items-center px-4 py-2 text-sm text-gray-700 ${active ? 'bg-gray-100' : ''}`}
                                      >
                                        <Trash2 size={16} className="mr-2" />
                                        Delete
                                      </button>
                                    )}
                                  </Menu.Item>
                                </div>
                              </Menu.Items>
                            </Menu>
                            {playing === episode._id && (
                              <audio autoPlay controls className="w-52">
                                <source src={episode.audioUrl} type="audio/mpeg" />
                                Your browser does not support the audio element.
                              </audio>
                            )}
                          </div>
                        </div>
                      ))}
                      {(podcast.episodes ?? []).length > 1 && (
                        <button
                          onClick={() => toggleExpand(podcast._id)}
                          className="mt-1 text-sm text-indigo-600 hover:underline"
                        >
                          {isExpanded ? 'Show Less' : `Show ${(podcast.episodes ?? []).length - 1} More`}
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 align-top">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                        podcast.isActive ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {podcast.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-4 align-top text-right">
                    <PodcastRowActions
                      onEdit={() => setActiveModal({ type: 'editPodcast', podcast, episode: null })}
                      onDelete={() => setActiveModal({ type: 'deletePodcast', podcast, episode: null })}
                      onExport={() => setActiveModal({ type: 'export', podcast, episode: null })}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <EditPodcastModal
        isOpen={activeModal.type === 'editPodcast'}
        onClose={() => setActiveModal({ type: null, podcast: null, episode: null })}
        onPodcastUpdated={onPodcastUpdated}
        podcast={activeModal.podcast}
      />
      <DeletePodcastModal
        isOpen={activeModal.type === 'deletePodcast'}
        onClose={() => setActiveModal({ type: null, podcast: null, episode: null })}
        onPodcastDeleted={onPodcastDeleted}
        podcast={activeModal.podcast}
      />
      <ExportPodcastModal
        isOpen={activeModal.type === 'export'}
        onClose={() => setActiveModal({ type: null, podcast: null, episode: null })}
        onExport={onExport}
      />
      <AddEpisodeModal
        isOpen={activeModal.type === 'addEpisode'}
        onClose={() => setActiveModal({ type: null, podcast: null, episode: null })}
        onEpisodeAdded={(episode: Episode) => onEpisodeAdded(activeModal.podcast?._id || '', episode)}
        podcastId={activeModal.podcast?._id || ''}
      />
      <EditEpisodeModal
        isOpen={activeModal.type === 'editEpisode'}
        onClose={() => setActiveModal({ type: null, podcast: null, episode: null })}
        onEpisodeUpdated={(episode: Episode) => onEpisodeUpdated(activeModal.podcast?._id || '', episode)}
        podcastId={activeModal.podcast?._id || ''}
        episode={activeModal.episode}
      />
      <DeleteEpisodeModal
        isOpen={activeModal.type === 'deleteEpisode'}
        onClose={() => setActiveModal({ type: null, podcast: null, episode: null })}
        onEpisodeDeleted={() => onEpisodeDeleted(activeModal.podcast?._id || '', activeModal.episode?._id || '')}
        episode={activeModal.episode}
      />
    </>
  );
}