'use client';

import { PlusCircle, Edit, Trash2, Download } from "lucide-react";
import { Station } from "@/interfaces/Station";

interface StationsActionsProps {
  onAddStation: () => void;
  onEditStation: (stationOrSlug?: Station | string) => void;
  onDeleteSelected: () => void;
  onExport: () => void;
  isEditDisabled?: boolean;
  isDeleteDisabled?: boolean;
  selectedStations: Station[];
}

export default function StationsActions({
  onAddStation,
  onEditStation,
  onDeleteSelected,
  onExport,
  isEditDisabled = false,
  isDeleteDisabled = false,
}: StationsActionsProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <button
        type="button"
        onClick={onAddStation}
        aria-label="Add Station"
        className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow"
      >
        <PlusCircle className="h-4 w-4" />
        <span>Add Station</span>
      </button>

      {/* <button
        type="button"
        onClick={() => onEditStation()}
        aria-label="Edit Station"
        disabled={isEditDisabled}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium shadow text-white ${
          isEditDisabled
            ? "bg-blue-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        <Edit className="h-4 w-4" />
        <span>Edit</span>
      </button>

      <button
        type="button"
        onClick={onDeleteSelected}
        aria-label="Delete Selected Stations"
        disabled={isDeleteDisabled}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium shadow text-white ${
          isDeleteDisabled
            ? "bg-red-300 cursor-not-allowed"
            : "bg-red-600 hover:bg-red-700"
        }`}
      >
        <Trash2 className="h-4 w-4" />
        <span>Delete</span>
      </button> */}

      <button
        type="button"
        onClick={onExport}
        aria-label="Export Stations"
        className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow"
      >
        <Download className="h-4 w-4" />
        <span>Export</span>
      </button>
    </div>
  );
}
