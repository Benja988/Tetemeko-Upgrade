'use client';

import { PlusCircle, Download } from "lucide-react";

interface StationsActionsProps {
  onAddStation: () => void;
  onExport: () => void;
}

export default function StationsActions({
  onAddStation,
  onExport,
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
