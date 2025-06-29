'use client';

import { useState } from "react";
import { Podcast } from "@/interfaces/podcasts";
import { podcasts as allPodcasts } from "@/data/podcasts";
import { Plus, Edit, Trash2, Download } from "lucide-react";

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

    const matchesStatus =
      statusFilter === "All" || podcast.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleAddPodcast = () => {};
  const handleEditPodcast = () => {};
  const handleDeleteSelected = () => {};
  const handleExport = () => {};

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
        />
      </div>

      <PodcastsTable podcasts={filteredPodcasts} />
    </section>
  );
}
