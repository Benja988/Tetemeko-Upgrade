'use client';

import { useState } from "react";
import { Podcast } from "@/interfaces/podcasts";
import { podcasts as allPodcasts } from "@/data/podcasts";

import PodcastsActions from "./PodcastsActions";
import PodcastsTabs from "./PodcastsTabs";
import PodcastsSearchFilter from "./PodcastsSearchFilter";
import PodcastsTable from "./PodcastsTable";

export default function PodcastsPageLayout({ heading }: { heading: string }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredPodcasts = allPodcasts.filter((podcast) => {
    const matchesSearch =
      podcast.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      podcast.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      podcast.host.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || podcast.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleAddPodcast = () => {};
  const handleEditPodcast = (podcast?: Podcast | string) => {};
  const handleDeleteSelected = () => {};
  const handleExport = () => {};

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">{heading}</h1>

      <PodcastsActions
        onAddPodcast={handleAddPodcast}
        onEditPodcast={handleEditPodcast}
        onDeleteSelected={handleDeleteSelected}
        onExport={handleExport}
      />

      <PodcastsTabs currentFilter={statusFilter} onChangeFilter={setStatusFilter} />

      <PodcastsSearchFilter searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <PodcastsTable podcasts={filteredPodcasts} />
    </div>
  );
}
