"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Station } from "@/interfaces/Station";
import { Play } from "lucide-react";
import StraightLine from "../StraightLine";
import { getStations } from "@/services/stations";// Make sure this path is correct

export default function StationsSection2() {
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch stations from API on mount
  useEffect(() => {
    const fetchData = async () => {
      const data = await getStations();
      setStations(data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const openModal = (station: Station) => {
    setSelectedStation(station);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStation(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    if (isModalOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  return (
    <section className="py-20 px-4 sm:px-6 md:px-16 text-white">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          📡 Explore Our Live Stations
        </motion.h2>
        <StraightLine />

        {loading ? (
          <p className="text-center text-gray-400">Loading stations...</p>
        ) : (
          <div className="flex overflow-x-auto gap-6 md:grid md:grid-cols-2 lg:grid-cols-3 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            {stations.map((station, index) => (
              <motion.div
                key={station._id}
                className="min-w-[85%] md:min-w-0 relative group bg-white/5 border border-white/10 rounded-2xl p-5 text-center hover:scale-[1.03] hover:shadow-xl transition-all duration-300 cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                onClick={() => openModal(station)}
              >
                <div className="relative w-full h-44 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={station.imageUrl}
                    alt={`${station.name} Logo`}
                    fill
                    loading="lazy"
                    className="object-cover transition-all duration-300 group-hover:scale-105"
                  />
                </div>

                <h3 className="text-xl font-semibold mb-1">{station.name}</h3>

                <p
                  className="text-sm text-gray-400 mb-2 truncate"
                  title={`${station.type} • ${station.genre.join(", ")}`}
                >
                  {station.type} • {station.genre.slice(0, 2).join(", ")}
                  {station.genre.length > 2 && "…"}
                </p>

                <p className="text-sm text-gray-300 line-clamp-2">
                  {station.description}
                </p>

                <div className="mt-4 flex items-center justify-center gap-2">
                  {station.isActive && (
                    <span className="bg-green-500/20 text-green-400 text-xs font-semibold px-2 py-0.5 rounded-full animate-pulse">
                      ● Live Now
                    </span>
                  )}
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition"
                    title="Play Live Stream"
                  >
                    <Play size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>

      {/* Modal */}
      {isModalOpen && selectedStation && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="relative bg-white text-black rounded-xl w-full max-w-md p-6 shadow-2xl">
            <button
              onClick={closeModal}
              className="absolute top-3 right-4 text-2xl font-bold text-gray-500 hover:text-gray-800"
              aria-label="Close modal"
            >
              &times;
            </button>

            <div className="mb-4 rounded overflow-hidden">
              <Image
                src={selectedStation.imageUrl}
                alt={`${selectedStation.name} banner`}
                width={500}
                height={300}
                className="object-cover w-full h-40 rounded-lg"
              />
            </div>

            <h2 className="text-2xl font-bold mb-1">{selectedStation.name}</h2>
            <p className="text-sm text-gray-600 mb-2">
              {selectedStation.type} • {selectedStation.genre.join(", ")}
            </p>

            <p className="text-gray-800 mb-4">{selectedStation.description}</p>

            <div className="text-sm text-gray-700 space-y-1 mb-4">
              <p>
                <strong>Live Show:</strong> {selectedStation.liveShow || "N/A"}
              </p>
              <p>
                <strong>Location:</strong> {selectedStation.location}
              </p>
              <p>
                <strong>Listeners:</strong>{" "}
                {selectedStation.listenerz?.toLocaleString() || "Unknown"}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={
                    selectedStation.isActive
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {selectedStation.isActive ? "Live" : "Offline"}
                </span>
              </p>
            </div>

            {selectedStation.streamUrl ? (
              <audio
                controls
                autoPlay
                className="w-full mt-2 rounded bg-gray-100 p-2"
              >
                <source src={selectedStation.streamUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            ) : (
              <p className="text-red-500 mt-4">Live stream not available.</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
