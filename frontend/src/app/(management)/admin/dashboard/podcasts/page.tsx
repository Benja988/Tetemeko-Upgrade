// components/admin/podcasts/PodcastDashboard.tsx
// Note: This is the filled-in PodcastPage as the main dashboard component.
// I've renamed it to PodcastDashboard for clarity, but you can rename back to PodcastPage.
// Assumptions:
// - apiRequest supports FormData for POST/PUT with files (multipart/form-data).
// - Added fetch for categories and stations using apiRequest (assume endpoints exist: /categories?categoryType=podcast and /stations).
// - Services need adjustment: change createPodcast to accept FormData instead of Record (similar to updatePodcastById).
// - Basic styling with Tailwind-like classes; adjust as needed.
// - No UI library assumed; using native HTML elements.
// - Episodes list uses basic pagination; expand if needed.
// - Error handling via console and toast (from sonner).

'use client';

import { useState, useEffect } from 'react';
import { Podcast, Episode, PodcastInput, EpisodeInput } from '@/interfaces/podcasts';
import {
  getAllPodcasts,
  createPodcast,
  updatePodcastById,
  deletePodcastById,
  togglePodcastStatus,
  getPodcastById,
  addEpisode,
  getAllEpisodes,
  updateEpisodeById,
  deleteEpisodeById,
} from '@/services/podcasts/podcastsService'; // Assume this file exports all (merge if separate)
import { apiRequest } from '@/lib/api';
import { toast } from 'sonner';

interface Category {
  _id: string;
  name: string;
}

interface Station {
  _id: string;
  name: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function PodcastDashboard() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [episodePagination, setEpisodePagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, pages: 1 });
  const [categories, setCategories] = useState<Category[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [isPodcastModalOpen, setIsPodcastModalOpen] = useState(false);
  const [isEpisodeModalOpen, setIsEpisodeModalOpen] = useState(false);
  const [editingPodcast, setEditingPodcast] = useState<Podcast | null>(null);
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);
  const [podcastPage, setPodcastPage] = useState(1);
  const [podcastTotalPages, setPodcastTotalPages] = useState(1);
  const [podcastSearch, setPodcastSearch] = useState('');
  const [episodePage, setEpisodePage] = useState(1);

  const fetchPodcasts = async () => {
    const res = await getAllPodcasts({ page: podcastPage, search: podcastSearch });
    if (res) {
      setPodcasts(res.data || res.data || []);
      setPodcastTotalPages(res.pagination?.pages || 1);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await apiRequest<{ categories: Category[] }>('/categories?categoryType=podcast', 'GET');
      setCategories(res?.categories || []);
    } catch (e) {
      console.error('Failed to fetch categories:', e);
    }
  };

  const fetchStations = async () => {
    try {
      const res = await apiRequest<{ stations: Station[] }>('/stations', 'GET');
      setStations(res?.stations || []);
    } catch (e) {
      console.error('Failed to fetch stations:', e);
    }
  };

  const fetchSelectedPodcast = async (id: string) => {
    const podcast = await getPodcastById(id);
    setSelectedPodcast(podcast);
  };

  const fetchEpisodes = async () => {
    if (selectedPodcast) {
      const res = await getAllEpisodes(selectedPodcast._id, { page: episodePage });
      if (res) {
        setEpisodes(res.data || res.data || []);
        setEpisodePagination(res.pagination || { page: 1, limit: 20, total: 0, pages: 1 });
      }
    }
  };

  useEffect(() => {
    fetchPodcasts();
    fetchCategories();
    fetchStations();
  }, [podcastPage, podcastSearch]);

  useEffect(() => {
    fetchEpisodes();
  }, [selectedPodcast, episodePage]);

  const handleSelectPodcast = (id: string) => {
    fetchSelectedPodcast(id);
    setEpisodePage(1);
  };

  const handleOpenPodcastModal = (podcast?: Podcast) => {
    setEditingPodcast(podcast || null);
    setIsPodcastModalOpen(true);
  };

  const handleOpenEpisodeModal = (episode?: Episode) => {
    setEditingEpisode(episode || null);
    setIsEpisodeModalOpen(true);
  };

  const handleSubmitPodcast = async (data: PodcastInput, file?: File) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('category', data.category);
    if (data.station) formData.append('station', data.station);
    if (file) formData.append('coverImage', file);

    let result;
    if (editingPodcast) {
      result = await updatePodcastById(editingPodcast._id, formData);
    } else {
      result = await createPodcast(formData as any); // Cast if service expects Record; ideally update service to FormData
    }

    if (result) {
      setIsPodcastModalOpen(false);
      fetchPodcasts();
      if (selectedPodcast) fetchSelectedPodcast(selectedPodcast._id);
    }
  };

  const handleDeletePodcast = async (id: string) => {
    if (confirm('Are you sure? This will soft-delete the podcast and its episodes.')) {
      const success = await deletePodcastById(id);
      if (success) {
        fetchPodcasts();
        if (selectedPodcast?._id === id) setSelectedPodcast(null);
      }
    }
  };

  const handleTogglePodcast = async (id: string) => {
    const result = await togglePodcastStatus(id);
    if (result) {
      fetchPodcasts();
      if (selectedPodcast?._id === id) setSelectedPodcast(result);
    }
  };

  const handleSubmitEpisode = async (data: EpisodeInput, file?: File) => {
    if (!selectedPodcast) return;
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('duration', data.duration.toString());
    if (data.episodeNumber) formData.append('episodeNumber', data.episodeNumber.toString());
    if (data.tags) formData.append('tags', JSON.stringify(data.tags));
    if (file) formData.append('audioUrl', file); // Backend handles as file

    let result;
    if (editingEpisode) {
      result = await updateEpisodeById(selectedPodcast._id, editingEpisode._id, formData);
    } else {
      result = await addEpisode(selectedPodcast._id, formData);
    }

    if (result) {
      setIsEpisodeModalOpen(false);
      fetchEpisodes();
    }
  };

  const handleDeleteEpisode = async (episodeId: string) => {
    if (!selectedPodcast) return;
    if (confirm('Are you sure?')) {
      const success = await deleteEpisodeById(selectedPodcast._id, episodeId);
      if (success) fetchEpisodes();
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Podcasts Dashboard</h1>

      <div className="flex justify-between mb-4">
        <button onClick={() => handleOpenPodcastModal()} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Create Podcast
        </button>
        <input
          type="text"
          placeholder="Search podcasts..."
          value={podcastSearch}
          onChange={(e) => setPodcastSearch(e.target.value)}
          className="p-2 border rounded"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Podcasts List */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Podcasts List</h2>
          {podcasts.length === 0 ? (
            <p>No podcasts found.</p>
          ) : (
            podcasts.map((podcast) => (
              <div
                key={podcast._id}
                className="border-b py-2 cursor-pointer hover:bg-gray-50"
                onClick={() => handleSelectPodcast(podcast._id)}
              >
                <h3 className="font-medium">{podcast.title}</h3>
                <p className="text-sm text-gray-600">{podcast.description.slice(0, 100)}...</p>
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleOpenPodcastModal(podcast); }}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeletePodcast(podcast._id); }}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleTogglePodcast(podcast._id); }}
                    className="text-green-500 hover:underline"
                  >
                    {podcast.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            ))
          )}
          <div className="flex space-x-2 mt-4">
            {Array.from({ length: podcastTotalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPodcastPage(i + 1)}
                className={`px-2 py-1 border ${podcastPage === i + 1 ? 'bg-blue-500 text-white' : ''}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Podcast Details and Episodes */}
        <div className="bg-white p-4 rounded shadow">
          {selectedPodcast ? (
            <>
              <h2 className="text-xl font-semibold mb-4">{selectedPodcast.title} Details</h2>
              <p className="mb-2">{selectedPodcast.description}</p>
              {selectedPodcast.coverImage && <img src={selectedPodcast.coverImage} alt="Cover" className="w-32 mb-2" />}
              <p className="text-sm">Category: {selectedPodcast.category}</p>
              <p className="text-sm">Station: {selectedPodcast.station || 'None'}</p>
              <p className="text-sm">Active: {selectedPodcast.isActive ? 'Yes' : 'No'}</p>

              <h3 className="text-lg font-semibold mt-6 mb-2">Episodes</h3>
              <button onClick={() => handleOpenEpisodeModal()} className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600">
                Add Episode
              </button>
              {episodes.length === 0 ? (
                <p>No episodes found.</p>
              ) : (
                episodes.map((episode) => (
                  <div key={episode._id} className="border-b py-2">
                    <h4 className="font-medium">{episode.title}</h4>
                    <p className="text-sm text-gray-600">{episode.description.slice(0, 100)}...</p>
                    <p className="text-sm">Duration: {episode.duration} seconds</p>
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() => handleOpenEpisodeModal(episode)}
                        className="text-blue-500 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEpisode(episode._id)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
              <div className="flex space-x-2 mt-4">
                {Array.from({ length: episodePagination.pages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setEpisodePage(i + 1)}
                    className={`px-2 py-1 border ${episodePage === i + 1 ? 'bg-blue-500 text-white' : ''}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p>Select a podcast to view details and episodes.</p>
          )}
        </div>
      </div>

      {/* Podcast Form Modal */}
      {isPodcastModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">{editingPodcast ? 'Edit Podcast' : 'Create Podcast'}</h2>
            <PodcastForm
              initialData={
                editingPodcast
                  ? {
                      title: editingPodcast.title,
                      description: editingPodcast.description,
                      category: editingPodcast.category,
                      station: editingPodcast.station,
                    }
                  : { title: '', description: '', category: '', station: '' }
              }
              categories={categories}
              stations={stations}
              onSubmit={handleSubmitPodcast}
              onCancel={() => setIsPodcastModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Episode Form Modal */}
      {isEpisodeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">{editingEpisode ? 'Edit Episode' : 'Create Episode'}</h2>
            <EpisodeForm
              initialData={
                editingEpisode
                  ? {
                      title: editingEpisode.title,
                      description: editingEpisode.description,
                      duration: editingEpisode.duration,
                      episodeNumber: editingEpisode.episodeNumber,
                      tags: editingEpisode.tags,
                    }
                  : { title: '', description: '', duration: 0, tags: [] }
              }
              onSubmit={handleSubmitEpisode}
              onCancel={() => setIsEpisodeModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Internal Form Components (can be extracted to separate files if preferred)

interface PodcastFormProps {
  initialData: Omit<PodcastInput, 'coverImage'>;
  categories: Category[];
  stations: Station[];
  onSubmit: (data: PodcastInput, file?: File) => void;
  onCancel: () => void;
}

function PodcastForm({ initialData, categories, stations, onSubmit, onCancel }: PodcastFormProps) {
  const [title, setTitle] = useState(initialData.title);
  const [description, setDescription] = useState(initialData.description);
  const [category, setCategory] = useState(initialData.category);
  const [station, setStation] = useState(initialData.station || '');
  const [coverImage, setCoverImage] = useState<File | undefined>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, category, station }, coverImage);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
        className="w-full p-2 border rounded"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
        className="w-full p-2 border rounded"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
        className="w-full p-2 border rounded"
      >
        <option value="">Select Category</option>
        {categories.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>
      <select
        value={station}
        onChange={(e) => setStation(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="">Select Station (optional)</option>
        {stations.map((s) => (
          <option key={s._id} value={s._id}>
            {s.name}
          </option>
        ))}
      </select>
      <input
        type="file"
        onChange={(e) => setCoverImage(e.target.files?.[0])}
        accept="image/*"
        className="w-full"
      />
      <div className="flex space-x-2">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Save
        </button>
        <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          Cancel
        </button>
      </div>
    </form>
  );
}

interface EpisodeFormProps {
  initialData: Omit<EpisodeInput, 'audioUrl'>;
  onSubmit: (data: EpisodeInput, file?: File) => void;
  onCancel: () => void;
}

function EpisodeForm({ initialData, onSubmit, onCancel }: EpisodeFormProps) {
  const [title, setTitle] = useState(initialData.title);
  const [description, setDescription] = useState(initialData.description);
  const [duration, setDuration] = useState(initialData.duration);
  const [episodeNumber, setEpisodeNumber] = useState(initialData.episodeNumber || 0);
  const [tags, setTags] = useState(initialData.tags?.join(', ') || '');
  const [audioFile, setAudioFile] = useState<File | undefined>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = tags.split(',').map((t) => t.trim()).filter(Boolean);
    onSubmit({ title, description, duration, episodeNumber, tags: tagsArray }, audioFile);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
        className="w-full p-2 border rounded"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="number"
        value={duration}
        onChange={(e) => setDuration(Number(e.target.value))}
        placeholder="Duration (seconds)"
        required
        min={1}
        className="w-full p-2 border rounded"
      />
      <input
        type="number"
        value={episodeNumber}
        onChange={(e) => setEpisodeNumber(Number(e.target.value))}
        placeholder="Episode Number (optional)"
        min={1}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags (comma-separated)"
        className="w-full p-2 border rounded"
      />
      <input
        type="file"
        onChange={(e) => setAudioFile(e.target.files?.[0])}
        accept="audio/*"
        className="w-full"
      />
      <div className="flex space-x-2">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Save
        </button>
        <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          Cancel
        </button>
      </div>
    </form>
  );
}