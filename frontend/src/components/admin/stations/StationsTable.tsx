'use client';

import { Station } from "@/interfaces/Station";
import {
  MapPin,
  Music,
  Circle,
  Edit,
  Trash2,
  Download,
  Radio,
  Info,
} from "lucide-react";

interface StationsTableProps {
  stations: Station[];
  onEditStation: (station: Station) => void;
  onDeleteStation: (station: Station) => void;
  onExportStation: (station: Station) => void;
  selectedStations: Station[];
  onSelectStations: (selected: Station[]) => void;
}

export default function StationsTable({
  stations,
  onEditStation,
  onDeleteStation,
  onExportStation,
}: StationsTableProps) {
  if (stations.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 text-lg select-none">
        No stations found.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {stations.map((station) => (
        <article
          key={station.id}
          tabIndex={0}
          className="group flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-lg focus-within:shadow-lg transition-shadow duration-300"
          aria-label={`Station: ${station.name}, ${station.status}`}
        >
          {/* Logo */}
          <div className="relative h-48 rounded-t-xl overflow-hidden bg-gray-100">
            <img
              src={station.imageUrl || "https://picsum.photos/200?random=1"}
              alt={station.name}
              className="object-cover w-full h-full"
              loading="lazy"
              decoding="async"
            />
            <span
              className={`absolute top-3 right-3 flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide shadow-sm
                ${
                  station.status === "Active"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-200 text-gray-600"
                }
              `}
            >
              <Circle
                className={`h-3 w-3 ${
                  station.status === "Active"
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              />
              {station.status}
            </span>
          </div>

          {/* Content */}
          <div className="flex flex-col flex-grow p-4 space-y-2">
            <h3
              className="text-lg font-semibold text-gray-900 truncate"
              title={station.name}
            >
              {station.name}
            </h3>

            <p className="text-sm text-gray-700 line-clamp-2" title={station.description}>
              {station.description}
            </p>

            <p
              className="flex items-center text-sm text-gray-600 space-x-1 truncate"
              title={station.genres.join(", ")}
            >
              <Music className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span>{station.genres.join(", ") || "Unknown genre"}</span>
            </p>

            <p
              className="flex items-center text-sm text-gray-600 space-x-1 truncate"
              title={station.location}
            >
              <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span>{station.location || "Unknown location"}</span>
            </p>

            <p
              className="flex items-center text-sm text-blue-600 truncate hover:underline"
              title={station.streamUrl}
            >
              <Radio className="h-4 w-4 text-blue-500 flex-shrink-0" />
              <a href={station.streamUrl} target="_blank" rel="noopener noreferrer">
                Live Stream
              </a>
            </p>
          </div>

          {/* Footer: Action Buttons */}
          <div className="flex justify-between gap-2 p-4 border-t border-gray-100">
            <button
              onClick={() => onEditStation(station)}
              className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
              aria-label="Edit Station"
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </button>

            <button
              onClick={() => onDeleteStation(station)}
              className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-800"
              aria-label="Delete Station"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </button>

            <button
              onClick={() => onExportStation(station)}
              className="flex items-center space-x-1 text-sm text-gray-700 hover:text-black"
              aria-label="Export Station"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
