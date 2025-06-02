'use client';

import { Station } from "@/interfaces/Station";
import {
  MapPin,
  Music,
  CircleDot,
  Edit3,
  Trash,
  RadioReceiver,
  ToggleRight,
} from "lucide-react";

interface StationsCardsProps {
  stations: Station[];
  onEditStation: (station: Station) => void;
  onDeleteStation: (station: Station) => void;
  onToggleStatus: (station: Station) => void;
  selectedStations?: Station[];
  onSelectStations?: (selected: Station[]) => void;
}

export default function StationCards({
  stations,
  onEditStation,
  onDeleteStation,
  onToggleStatus,
}: StationsCardsProps) {
  if (stations.length === 0) {
    return (
      <div className="p-10 text-center text-gray-500 text-lg select-none">
        No stations found.
      </div>
    );
  }

  return (
    <div
      className="
        grid gap-8
        sm:grid-cols-1
        md:grid-cols-1
        lg:grid-cols-2
        xl:grid-cols-3
      "
    >
      {stations.map((station) => (
        <article
          key={station._id}
          tabIndex={0}
          className="
            group flex flex-col rounded-lg border border-gray-200 bg-white shadow-sm
            hover:shadow-lg focus-within:shadow-lg
            transition-shadow duration-300 outline-none
            focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
            min-w-[320px] max-w-[480px] mx-auto
          "
          aria-label={`Station: ${station.name}, status: ${
            station.isActive ? "Active" : "Inactive"
          }`}
        >
          {/* Logo + Status Badge */}
          <div className="relative h-44 rounded-t-lg overflow-hidden bg-gray-100">
            <img
              src={station.imageUrl || "https://picsum.photos/400?random=1"}
              alt={`${station.name} logo`}
              className="object-cover w-full h-full"
              loading="lazy"
              decoding="async"
            />
            <span
              className={`
                absolute top-3 right-3 flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide shadow-sm
                ${
                  station.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-200 text-gray-600"
                }
              `}
              aria-live="polite"
            >
              <CircleDot
                className={`h-4 w-4 ${
                  station.isActive ? "text-green-600" : "text-gray-400"
                }`}
              />
              {station.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          {/* Content */}
          <div className="flex flex-col flex-grow p-5 space-y-3">
            <h3
              className="text-xl font-semibold text-gray-900 truncate"
              title={station.name}
            >
              {station.name}
            </h3>

            <p
              className="text-sm text-gray-700 line-clamp-3"
              title={station.description}
            >
              {station.description || "No description available."}
            </p>

            <p
              className="flex items-center text-sm text-gray-600 space-x-2 truncate"
              title={
                station.genres.length
                  ? station.genres.join(", ")
                  : "Unknown genre"
              }
            >
              <Music className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <span>
                {station.genres.length
                  ? station.genres.join(", ")
                  : "Unknown genre"}
              </span>
            </p>

            <p
              className="flex items-center text-sm text-gray-600 space-x-2 truncate"
              title={station.location || "Unknown location"}
            >
              <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <span>{station.location || "Unknown location"}</span>
            </p>

            <a
              href={station.streamUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-blue-600 hover:underline space-x-2 truncate"
              title="Listen live stream"
            >
              <RadioReceiver className="h-5 w-5 text-blue-500 flex-shrink-0" />
              <span>Live Stream</span>
            </a>
          </div>

          {/* Footer: Action Buttons */}
          <div className="flex justify-between gap-3 p-4 border-t border-gray-100 bg-gray-50 rounded-b-lg">
            <button
              onClick={() => onEditStation(station)}
              className="flex items-center justify-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded transition"
              aria-label={`Edit station ${station.name}`}
              type="button"
            >
              <Edit3 className="h-5 w-5" />
              Edit
            </button>

            <button
              onClick={() => onDeleteStation(station)}
              className="flex items-center justify-center gap-1 text-sm font-medium text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded transition"
              aria-label={`Delete station ${station.name}`}
              type="button"
            >
              <Trash className="h-5 w-5" />
              Delete
            </button>

            <button
              onClick={() => onToggleStatus(station)}
              className="flex items-center justify-center gap-1 text-sm font-medium text-yellow-600 hover:text-yellow-800 focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded transition"
              aria-label={`Toggle status for station ${station.name}`}
              type="button"
            >
              <ToggleRight className="h-5 w-5" />
              Toggle Status
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
