'use client';

import { PlusCircle, Download, Settings, RefreshCw } from "lucide-react";

interface StationsActionsProps {
  onAddStation: () => void;
  onExport: () => void;
  onRefresh?: () => void;
  onSettings?: () => void;
  exportDisabled?: boolean;
  className?: string;
}

export default function StationsActions({
  onAddStation,
  onExport,
  onRefresh,
  onSettings,
  exportDisabled = false,
  className = "",
}: StationsActionsProps) {
  return (
    <div className={`flex flex-wrap items-center justify-between gap-4 ${className}`}>
      <div className="flex flex-wrap items-center gap-3">
        {/* Add Station Button */}
        <button
          onClick={onAddStation}
          aria-label="Add new station"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add Station</span>
        </button>

        {/* Export Button */}
        <button
          onClick={onExport}
          disabled={exportDisabled}
          aria-label="Export stations data"
          className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 ${
            exportDisabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Download className="h-4 w-4" />
          <span>Export CSV</span>
        </button>

        {/* Refresh Button (Conditional) */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            aria-label="Refresh stations"
            className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Settings Button (Conditional) */}
      {onSettings && (
        <button
          onClick={onSettings}
          aria-label="Open settings"
          className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 ml-auto"
        >
          <Settings className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}