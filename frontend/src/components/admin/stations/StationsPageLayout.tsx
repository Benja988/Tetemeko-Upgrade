'use client';

import { useState } from "react";
import { Station } from "@/interfaces/Station";
import { stations as allStations } from "@/data/stations";

import StationsActions from "./StationsActions";
import StationsTabs from "./StationsTabs";
import StationsSearchFilter from "./StationsSearchFilter";
import StationsTable from "./StationsTable";

export default function StationsPageLayout({ heading }: { heading: string }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const handleAddStation = () => {};
  const handleEditStation = (station?: Station | string) => {};
  const handleDeleteSelected = () => {};
  const handleExport = () => {};

  const filteredStations = allStations.filter((station) => {
    const matchesSearch =
      station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || station.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">{heading}</h1>

      <StationsActions
        onAddStation={handleAddStation}
        onEditStation={handleEditStation}
        onDeleteSelected={handleDeleteSelected}
        onExport={handleExport}
      />

      <StationsTabs currentFilter={statusFilter} onChangeFilter={setStatusFilter} />

      <StationsSearchFilter searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <StationsTable stations={filteredStations} />
    </div>
  );
}
