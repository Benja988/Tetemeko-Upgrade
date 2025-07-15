// components/admin/podcasts/PodcastsPageLayout.tsx

'use client';

import { useState, useEffect } from 'react';
import { Podcast, Episode } from '@/interfaces/podcasts';
import PodcastsActions from './PodcastsActions';
import PodcastsTabs from './PodcastsTabs';
import PodcastsSearchFilter from './PodcastsSearchFilter';
import PodcastsTable from './PodcastsTable';
import { getAllPodcasts } from '@/services/podcasts/podcastsService';

interface PodcastsPageLayoutProps {
  heading: string;
}

export default function PodcastsPageLayout({ heading }: PodcastsPageLayoutProps) {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPodcasts, setSelectedPodcasts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPodcasts = async () => {
    setIsLoading(true);
    const params: Record<string, any> = { page, limit: 10 };
    if (searchTerm) params.search = searchTerm;
    if (statusFilter !== 'All') params.isActive = statusFilter === 'Active' ? 'true' : 'false';

    const result = await getAllPodcasts(params);
    if (result) {
      setPodcasts(result.podcasts);
      setTotalPages(result.totalPages);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPodcasts();
  }, [page, searchTerm, statusFilter]);

  const handleAddPodcast = (podcast: Podcast) => {
    setPodcasts((prev) => [podcast, ...prev]);
  };

  const handleEditPodcast = (updatedPodcast: Podcast) => {
    setPodcasts((prev) =>
      prev.map((p) => (p._id === updatedPodcast._id ? updatedPodcast : p))
    );
  };

  const handleDeleteSelected = (ids: string[]) => {
    setPodcasts((prev) => prev.filter((p) => !ids.includes(p._id)));
    setSelectedPodcasts((prev) => prev.filter((id) => !ids.includes(id)));
  };

  const handleExport = (format: string) => {
    // Placeholder: Implement export logic (e.g., download file)
    console.log(`Exporting podcasts in ${format} format:`, selectedPodcasts);
  };

  const handleEpisodeAdded = (podcastId: string, episode: Episode) => {
    setPodcasts((prev) =>
      prev.map((p) =>
        p._id === podcastId ? { ...p, episodes: [...(p.episodes ?? []), episode] } : p
      )
    );
  };

  const handleEpisodeUpdated = (podcastId: string, updatedEpisode: Episode) => {
    setPodcasts((prev) =>
      prev.map((p) =>
        p._id === podcastId
          ? {
              ...p,
              episodes: (p.episodes ?? []).map((e) =>
                e._id === updatedEpisode._id ? updatedEpisode : e
              ),
            }
          : p
      )
    );
  };

  const handleEpisodeDeleted = (podcastId: string, episodeId: string) => {
    setPodcasts((prev) =>
      prev.map((p) =>
        p._id === podcastId
          ? { ...p, episodes: (p.episodes ?? []).filter((e) => e._id !== episodeId) }
          : p
      )
    );
  };

  const handleSelectPodcast = (id: string) => {
    setSelectedPodcasts((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  return (
    <section className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{heading}</h1>
      </header>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <PodcastsTabs currentFilter={statusFilter} onChangeFilter={setStatusFilter} />
        <PodcastsSearchFilter searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <PodcastsActions
          onAddPodcast={handleAddPodcast}
          onEditPodcast={handleEditPodcast}
          onDeleteSelected={handleDeleteSelected}
          onExport={handleExport}
          selectedPodcasts={podcasts.filter((p) => selectedPodcasts.includes(p._id))}
        />
      </div>
      {isLoading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <PodcastsTable
          podcasts={podcasts}
          onPodcastUpdated={handleEditPodcast}
          onPodcastDeleted={(id: string) => handleDeleteSelected([id])}
          onEpisodeAdded={handleEpisodeAdded}
          onEpisodeUpdated={handleEpisodeUpdated}
          onEpisodeDeleted={handleEpisodeDeleted}
          onExport={handleExport}
          selectedPodcasts={selectedPodcasts}
          onSelectPodcast={handleSelectPodcast}
        />
      )}
      <div className="flex justify-between">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </section>
  );
}