'use client';

import { useState, useEffect } from "react";
import { Station, StationInput } from "@/interfaces/Station";
import {
  getStations,
  createStation,
  updateStation,
  deleteStation,
  toggleStationStatus
} from "@/services/stations";

import StationsActions from "./StationsActions";
import StationsTabs from "./StationsTabs";
import StationsSearchFilter from "./StationsSearchFilter";
import StationsCards from "./StationCards";
import StationFormModal from "./StationFormModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

export default function StationsPageLayout({ heading }: { heading: string }) {
  const [stations, setStations] = useState<Station[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedStations, setSelectedStations] = useState<Station[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStation, setEditingStation] = useState<Station>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | string[] | null>(null);

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const data = await getStations();
      setStations(data);
    } catch (err) {
      console.error("Failed to fetch stations:", err);
    }
  };

  const handleAddStation = () => {
    setEditingStation(undefined);
    setIsModalOpen(true);
  };

  const handleEditStation = (station?: Station | string) => {
    const found =
      typeof station === "string"
        ? stations.find((s) => s._id === station)
        : station;

    if (found) {
      setEditingStation(found);
      setIsModalOpen(true);
    }
  };

  const handleSubmitStation = async (data: StationInput) => {
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
    setDeleteTarget(station._id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      if (!deleteTarget) return;

      const ids = Array.isArray(deleteTarget) ? deleteTarget : [deleteTarget];
      await Promise.all(ids.map(deleteStation));

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
    setEditingStation(undefined);
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
    <section className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <StationFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmitStation}
        initialData={editingStation}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        count={Array.isArray(deleteTarget) ? deleteTarget.length : 1}
      />

      <header className="top-0 z-20 bg-white border border-gray-200 shadow-lg rounded-xl p-6 md:p-8 mb-6">
        <div className="max-w-5xl mx-auto flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            {heading}
          </h1>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed">
            Manage your stations with ease — edit details, toggle their visibility, and keep your content up to date.
          </p>
        </div>
      </header>


      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <StationsTabs
          currentFilter={statusFilter}
          onChangeFilter={setStatusFilter}
        />

        <div className="flex gap-4">
          <button
            onClick={handleAddStation}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-white text-sm font-semibold shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add Station
          </button>

          <button
            onClick={handleExport}
            disabled={stations.length === 0}
            className={`inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${stations.length === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      <StationsSearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

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
        <div className="p-8 text-center text-gray-500 text-lg font-medium">
          No stations found. Try adjusting your filters or adding a new station.
        </div>
      )}
    </section>
  );
}
