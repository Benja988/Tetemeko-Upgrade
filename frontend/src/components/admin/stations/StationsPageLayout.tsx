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
      await fetchStations(); // Refresh stations after toggling
    } catch (error) {
      console.error(error);
    }
  };

  // Filter stations by statusFilter using isActive boolean
  const filteredStations = stations.filter((station) => {
    if (statusFilter === "All") return true;
    if (statusFilter === "Active") return station.isActive === true;
    if (statusFilter === "Inactive") return station.isActive === false;
    return true;
  }).filter(station =>
    station.name.toLowerCase().includes(searchTerm.toLowerCase()) // Optional: also filter by searchTerm
  );

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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
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

      <div className="sticky top-0 z-10 pb-4 border-b border-gray-200 bg-white">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">{heading}</h1>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <StationsTabs
            currentFilter={statusFilter}
            onChangeFilter={setStatusFilter}
          />
          <StationsSearchFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </div>

        <div className="mt-4">
          <StationsActions onAddStation={handleAddStation} onExport={handleExport} />
        </div>
      </div>

      <div className="pt-2">
        <StationsTable
          stations={filteredStations}
          selectedStations={selectedStations}
          onSelectStations={setSelectedStations}
          onDeleteStation={handleDeleteStation}
          onEditStation={handleEditStation}
          onToggleStatus={handleToggleStatus}
        />
      </div>
    </section>
  );
}
