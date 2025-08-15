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
  Heart,
  Share2,
  BarChart2,
  Clock
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

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
  selectedStations = [],
  onSelectStations,
}: StationsCardsProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  if (!stations.length) {
    return (
      <div className="text-center py-20">
        <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
          <RadioReceiver className="h-full w-full opacity-50" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">No stations found</h3>
        <p className="mt-1 text-gray-500">Try adjusting your search or filters</p>
      </div>
    );
  }

  const toggleStationSelection = (station: Station) => {
    if (!onSelectStations) return;
    
    const isSelected = selectedStations.some(s => s._id === station._id);
    if (isSelected) {
      onSelectStations(selectedStations.filter(s => s._id !== station._id));
    } else {
      onSelectStations([...selectedStations, station]);
    }
  };

  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {stations.map((station) => {
        const isSelected = selectedStations.some(s => s._id === station._id);
        
        return (
          <div
            key={station._id}
            className={`relative flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
            onMouseEnter={() => setHoveredCard(station._id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* Selection checkbox (only shown if onSelectStations is provided) */}
            {onSelectStations && (
              <div className="absolute top-3 left-3 z-10">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleStationSelection(station)}
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  aria-label={`Select ${station.name}`}
                />
              </div>
            )}

            {/* Header Image */}
            <div className="relative h-48 w-full bg-gradient-to-br from-gray-100 to-gray-200">
              <Image
                src={station.imageUrl || "/placeholder-station.jpg"}
                alt={`${station.name} logo`}
                fill
                className="object-cover"
                loading="lazy"
                quality={80}
              />

              {/* Status Badge */}
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full backdrop-blur-sm flex items-center gap-2 ${station.isActive
                      ? "bg-green-50/80 text-green-800"
                      : "bg-gray-100/80 text-gray-600"
                    }`}
                >
                  <CircleDot className={`w-3 h-3 ${station.isActive ? "text-green-500" : "text-gray-400"}`} />
                  {station.isActive ? "Live" : "Offline"}
                </span>
              </div>

              {/* Type Badge */}
              <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold bg-blue-50/90 text-blue-700 rounded-full flex items-center gap-1 backdrop-blur-sm">
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

              {/* Listener count */}
              {station.listenerz && (
                <span className="absolute bottom-3 left-3 px-2 py-1 text-xs font-medium bg-black/60 text-white rounded-full flex items-center gap-1">
                  <BarChart2 className="w-3 h-3" />
                  {station.listenerz.toLocaleString()} listeners
                </span>
              )}

              {/* Current show */}
              {station.liveShow && (
                <div className="absolute bottom-3 right-3 max-w-[60%]">
                  <span className="px-2 py-1 text-xs font-medium bg-black/60 text-white rounded-full flex items-center gap-1 truncate">
                    <Clock className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{station.liveShow}</span>
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex flex-col gap-3 p-5 flex-grow">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {station.name}
                </h3>
                <button 
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Add to favorites"
                >
                  <Heart className="w-5 h-5" strokeWidth={hoveredCard === station._id ? 2 : 1.5} />
                </button>
              </div>

              <p className="text-sm text-gray-600 line-clamp-3">
                {station.description || "No description available."}
              </p>

              {/* Genres */}
              {station.genre?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {station.genre.map((g, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center"
                    >
                      <Music className="w-3 h-3 mr-1" />
                      {g}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="line-clamp-1">{station.location || "Unknown location"}</span>
              </div>

              {station.streamUrl && (
                <a
                  href={station.streamUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline mt-2 transition-colors"
                >
                  <RadioReceiver className="h-4 w-4 mr-2" />
                  Listen Live
                </a>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center gap-2 p-4 border-t bg-gray-50">
              <div className="flex gap-1">
                <button
                  onClick={() => onEditStation(station)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  aria-label={`Edit ${station.name}`}
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => onToggleStatus(station)}
                  className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-md transition-colors"
                  aria-label={`Toggle status for ${station.name}`}
                >
                  <ToggleRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex gap-1">
                <button
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                  aria-label={`Share ${station.name}`}
                >
                  <Share2 className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => onDeleteStation(station)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  aria-label={`Delete ${station.name}`}
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}