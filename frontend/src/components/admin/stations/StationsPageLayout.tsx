import { useState, useEffect } from "react";
import { Station } from "@/interfaces/Station";
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
  const [editingStation, setEditingStation] = useState<Station | undefined>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Station | Station[] | null>(null);
  const [toggledStation, setToggledStation] = useState<Station | null>(null);

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const data = await getStations();
      setStations(data);
    } catch (error) {
      console.error("Failed to fetch stations:", error);
    }
  };

  const handleAddStation = () => {
    setEditingStation(undefined);
    setIsModalOpen(true);
  };

  const handleEditStation = (station?: Station | string) => {
    if (!station) return;

    if (typeof station === "string") {
      const found = stations.find((s) => s._id === station);
      if (found) setEditingStation(found);
    } else {
      setEditingStation(station);
    }
    setIsModalOpen(true);
  };

  const handleSubmitStation = async (data: Partial<Station>) => {
    try {
      if (editingStation) {
        await updateStation(editingStation._id, data);
      } else {
        await createStation(data);
      }
      await fetchStations();
    } catch (error) {
      console.error("Failed to submit station:", error);
    } finally {
      setIsModalOpen(false);
      setEditingStation(undefined);
    }
  };

  const handleDeleteStation = (station: Station) => {
    setDeleteTarget(station);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      if (Array.isArray(deleteTarget)) {
        await Promise.all(deleteTarget.map((station) => deleteStation(station._id)));
      } else {
        await deleteStation(deleteTarget._id);
      }
      await fetchStations();
      setSelectedStations([]);
    } catch (error) {
      console.error("Failed to delete station(s):", error);
    } finally {
      setDeleteTarget(null);
      setIsDeleteModalOpen(false);
    }
  };

  const handleToggleStatus = async (station: Station) => {
    try {
      const updatedStation = await toggleStationStatus(station._id);
      setToggledStation(updatedStation);
      await fetchStations();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredStations = stations
    .filter((station) => {
      if (statusFilter === "All") return true;
      if (statusFilter === "Active") return station.isActive === true;
      if (statusFilter === "Inactive") return station.isActive === false;
      return true;
    })
    .filter((station) => station.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleExport = () => {
    const dataToExport = selectedStations.length > 0 ? selectedStations : stations;
    const header = ["ID", "Name", "Genres", "Location", "Is Active"];
    const rows = dataToExport.map((s) => [
      s._id,
      s.name,
      s.genres.join(", "),
      s.location,
      s.isActive ? "Active" : "Inactive",
    ]);

    const csv = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "stations_export.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <StationFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingStation(undefined);
        }}
        onSubmit={handleSubmitStation}
        initialData={editingStation}
      />

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
      <header className="sticky top-0 z-20 bg-white border-b border-gray-300 py-6 px-6 rounded-md shadow-md">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">{heading}</h1>
        <p className="mt-1 text-gray-600 max-w-xl">
          Manage your stations, update information, toggle active status, and more.
        </p>
      </header>

      {/* Filters + Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex flex-wrap gap-4 md:gap-6 items-center">
          <StationsTabs
            currentFilter={statusFilter}
            onChangeFilter={setStatusFilter}
          />
          
        </div>
        

        <div className="flex gap-4">
          <button
            onClick={handleAddStation}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-white text-sm font-semibold shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add Station
          </button>

          <button
            onClick={handleExport}
            disabled={stations.length === 0}
            className={`inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition
              ${stations.length === 0 ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>
      <div>
        <StationsSearchFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
      </div>
      

      {/* Stations Table or Empty State */}
      
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
