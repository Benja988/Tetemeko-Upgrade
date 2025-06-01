'use client';

import { useState, useEffect } from "react";
import { Station } from "@/interfaces/Station";
import {
  getStations,
  createStation,
  updateStation,
  deleteStation
} from "@/services/stations";

import StationsActions from "./StationsActions";
import StationsTabs from "./StationsTabs";
import StationsSearchFilter from "./StationsSearchFilter";
import StationsTable from "./StationsTable";
import StationFormModal from "./StationFormModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

export default function StationsPageLayout({ heading }: { heading: string }) {
  const [stations, setStations] = useState<Station[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedStations, setSelectedStations] = useState<Station[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStation, setEditingStation] = useState<Station | undefined>();

  // Confirm Delete Modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Station | Station[] | null>(null);

  const fetchStations = async () => {
    const data = await getStations();
    setStations(data);
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const handleAddStation = () => {
    setEditingStation(undefined);
    setIsModalOpen(true);
  };

  const handleEditStation = (station?: Station | string) => {
    if (!station) return;
    if (typeof station === "string") {
      const found = stations.find((s) => s.id === station);
      if (found) setEditingStation(found);
    } else {
      setEditingStation(station);
    }
    setIsModalOpen(true);
  };

  const handleSubmitStation = async (data: Partial<Station>) => {
    if (editingStation) {
      const updated = await updateStation(editingStation.id, data);
      if (updated) {
        await fetchStations();
      }
    } else {
      const created = await createStation(data);
      if (created) {
        await fetchStations();
      }
    }
  };

  const handleDeleteSelected = () => {
    if (selectedStations.length === 0) return;
    setDeleteTarget([...selectedStations]);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteStation = (station: Station) => {
    setDeleteTarget(station);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    if (Array.isArray(deleteTarget)) {
      for (const station of deleteTarget) {
        await deleteStation(station.id);
      }
    } else {
      await deleteStation(deleteTarget.id);
    }

    await fetchStations();
    setSelectedStations([]);
    setDeleteTarget(null);
  };

  const handleExport = () => {
    const dataToExport = selectedStations.length > 0 ? selectedStations : stations;
    const csv = dataToExport
      .map((s) =>
        [s.id, s.name, s.genres.join(","), s.location, s.status].join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "stations_export.csv";
    link.click();
  };

  const filteredStations = stations.filter((station) => {
    const searchLower = searchTerm.toLowerCase();

    const matchesSearch =
      station.name.toLowerCase().includes(searchLower) ||
      station.genres.some((g: string) =>
        g.trim().toLowerCase().includes(searchLower)
      ) ||
      station.location.toLowerCase().includes(searchLower);

    const matchesStatus =
      statusFilter === "All" || station.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Station Form Modal */}
      <StationFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitStation}
        initialData={editingStation}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={confirmDelete}
        count={Array.isArray(deleteTarget) ? deleteTarget.length : 1}
      />

      {/* Header */}
      <div className="sticky top-0 z-10 pb-4 border-b border-gray-200 bg-white">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">{heading}</h1>

        {/* Filter */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <StationsTabs currentFilter={statusFilter} onChangeFilter={setStatusFilter} />
          <StationsSearchFilter searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </div>

        {/* Actions */}
        <div className="mt-4">
          <StationsActions
            onAddStation={handleAddStation}
            onEditStation={handleEditStation}
            onDeleteSelected={handleDeleteSelected}
            onExport={handleExport}
            selectedStations={selectedStations}
          />
        </div>
      </div>

      {/* Table */}
      <div className="pt-2">
        <StationsTable
          stations={filteredStations}
          selectedStations={selectedStations}
          onSelectStations={setSelectedStations}
          onDeleteStation={handleDeleteStation}
          onEditStation={handleEditStation}
          onExportStation={handleExport}
        />
      </div>
    </section>
  );
}
