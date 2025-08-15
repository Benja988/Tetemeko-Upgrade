'use client';

import { useState, useEffect } from "react";
import { Station } from "@/interfaces/Station";
import {
  getStations,
  createStation,
  updateStation,
  deleteStation,
  toggleStationStatus
} from "@/services/stations";

import StationsTabs from "./StationsTabs";
import StationsSearchFilter from "./StationsSearchFilter";
import StationsCards from "./StationCards";
import StationFormModal from "./StationFormModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

export default function StationsPageLayout({ heading }: { heading: string }) {
  const [stations, setStations] = useState<Station[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive">("All");
  const [selectedStations, setSelectedStations] = useState<Station[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStation, setEditingStation] = useState<Station | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string[] | null>(null);

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const data = await getStations({
        fields: [
          "_id",
          "name",
          "imageUrl",
          "type",
          "genre",
          "description",
          "isActive",
          "listenerz",
          "liveShow",
          "location",
          "streamUrl"
        ],
        limit: 0
      });
      setStations(data);
    } catch (err) {
      console.error("Failed to fetch stations:", err);
    }
  };

  const handleAddStation = () => {
    setEditingStation(null);
    setIsModalOpen(true);
  };

  const handleEditStation = (station: Station | string) => {
    const found = typeof station === "string"
      ? stations.find((s) => s._id === station) || null
      : station;

    if (found) {
      setEditingStation(found);
      setIsModalOpen(true);
    }
  };

  const handleSubmitStation = async (data: Omit<Station, "_id">) => {
  try {
    if (editingStation) {
      await updateStation(editingStation._id, data);
    } else {
      await createStation(data);
    }
    await fetchStations();
    closeModal();
  } catch (err) {
    console.error("Failed to save station:", err);
  }
};

  const handleDeleteStation = (station: Station) => {
    setDeleteTarget([station._id]);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      if (!deleteTarget) return;
      await Promise.all(deleteTarget.map(deleteStation));
      await fetchStations();
      setSelectedStations([]);
      closeDeleteModal();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleToggleStatus = async (station: Station) => {
    try {
      await toggleStationStatus(station._id);
      await fetchStations();
    } catch (err) {
      console.error("Toggle status failed:", err);
    }
  };

  const handleExport = () => {
    const data = selectedStations.length > 0 ? selectedStations : stations;
    const csvContent = [
      ["ID", "Name", "Genres", "Location", "Is Active"],
      ...data.map((s) => [
        s._id,
        s.name,
        s.genre.join(", "),
        s.location,
        s.isActive ? "Active" : "Inactive"
      ])
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "stations_export.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStation(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  const filteredStations = stations
    .filter((station) =>
      statusFilter === "All"
        ? true
        : statusFilter === "Active"
        ? station.isActive
        : !station.isActive
    )
    .filter((station) =>
      station.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <StationFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmitStation}
        initialData={editingStation || undefined}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        count={deleteTarget ? deleteTarget.length : 0}
      />

      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-6 md:p-8 mb-8 text-white">
        <div className="max-w-5xl mx-auto flex flex-col gap-3">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {heading}
          </h1>
          <p className="text-indigo-100 text-base md:text-lg leading-relaxed max-w-3xl">
            Manage your radio stations with ease. Edit details, toggle visibility,
            and keep your content up to date across all platforms.
          </p>
        </div>
      </header>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <StationsTabs currentFilter={statusFilter} onChangeFilter={setStatusFilter} />

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddStation}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-white font-medium shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Station
            </button>

            <button
              onClick={handleExport}
              disabled={stations.length === 0}
              className={`inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3 font-medium shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors ${
                stations.length === 0 ? "opacity-50 cursor-not-allowed text-gray-400" : "text-gray-700"
              }`}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              Export CSV
            </button>
          </div>
        </div>

        <div className="mt-6">
          <StationsSearchFilter searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </div>
      </div>

      {/* Station List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {filteredStations.length > 0 ? (
          <StationsCards
            stations={filteredStations}
            selectedStations={selectedStations}
            onSelectStations={setSelectedStations}
            onDeleteStation={handleDeleteStation}
            onEditStation={handleEditStation}
            onToggleStatus={handleToggleStatus}
          />
        ) : (
          <div className="p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
              <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No stations found</h3>
            <p className="mt-1 text-gray-500">
              Try adjusting your search or filter criteria, or add a new station.
            </p>
            <div className="mt-6">
              <button
                onClick={handleAddStation}
                className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Station
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
