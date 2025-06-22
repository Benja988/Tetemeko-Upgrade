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
  Tv,
  Radio,
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
  if (!stations.length) {
    return (
      <div className="text-center py-20 text-gray-500 text-lg">No stations found.</div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {stations.map((station) => (
        <div
          key={station._id}
          className="flex flex-col rounded-2xl border bg-white shadow-md hover:shadow-lg transition duration-300 overflow-hidden"
        >
          {/* Header Image */}
          <div className="relative h-48 w-full bg-gray-100">
            <img
              src={station.imageUrl || "https://picsum.photos/400?grayscale"}
              alt={`${station.name} logo`}
              className="object-cover w-full h-full"
              loading="lazy"
            />

            {/* Status Badge */}
            <span
              className={`absolute top-3 right-3 px-3 py-1 text-xs font-medium rounded-full flex items-center gap-2 ${station.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-600"
                }`}
            >
              <CircleDot className={`w-3 h-3 ${station.isActive ? "text-green-600" : "text-gray-400"}`} />
              {station.isActive ? "Active" : "Inactive"}
            </span>

            {/* Type Badge */}
            <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full flex items-center gap-1">
              {station.type === "TV Station" ? (
                <>
                  <Tv className="w-4 h-4" /> TV
                </>
              ) : (
                <>
                  <Radio className="w-4 h-4" /> Radio
                </>
              )}
            </span>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-2 p-5 flex-grow">
            <h3 className="text-lg font-semibold text-gray-900">{station.name}</h3>

            <p className="text-sm text-gray-600 line-clamp-2">
              {station.description || "No description available."}
            </p>

            {/* Genres */}
            {station.genre?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-1">
                {station.genre.map((g, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}


            <div className="text-sm text-gray-500 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              {station.location || "Unknown location"}
            </div>

            {station.streamUrl && (
              <a
                href={station.streamUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-blue-600 hover:underline mt-1"
              >
                <RadioReceiver className="h-4 w-4 mr-1" />
                Listen Live
              </a>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center gap-2 p-4 border-t bg-gray-50 text-sm font-medium">
            <button
              onClick={() => onEditStation(station)}
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1 transition"
              aria-label={`Edit ${station.name}`}
            >
              <Edit3 className="w-4 h-4" />
              Edit
            </button>

            <button
              onClick={() => onDeleteStation(station)}
              className="text-red-600 hover:text-red-800 flex items-center gap-1 transition"
              aria-label={`Delete ${station.name}`}
            >
              <Trash className="w-4 h-4" />
              Delete
            </button>

            <button
              onClick={() => onToggleStatus(station)}
              className="text-yellow-600 hover:text-yellow-800 flex items-center gap-1 transition"
              aria-label={`Toggle status for ${station.name}`}
            >
              <ToggleRight className="w-4 h-4" />
              Toggle
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
