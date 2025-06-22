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
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onAddStation}
          aria-label="Add Station"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <PlusCircle className="h-5 w-5" />
          <span>Add Station</span>
        </button>

        <button
          type="button"
          onClick={onExport}
          aria-label="Export Stations"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-lg shadow hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          <Download className="h-5 w-5" />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
}
