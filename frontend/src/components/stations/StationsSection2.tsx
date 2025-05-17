"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { stations } from "@/data/stations";
import { Station } from "@/interfaces/Station";

export default function StationsSection2() {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const visibleStations = stations.slice(0, 4);

  const openModal = (station: Station) => {
    setSelectedStation(station);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStation(null);
  };

  return (
    <section className="py-24 px-6 md:px-16 text-white">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-poppins font-semibold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Our Vibrant Stations
        </motion.h2>

        <div
          className="grid gap-8 justify-center"
          style={{
            gridTemplateColumns: `repeat(auto-fit, minmax(280px, 1fr))`,
            justifyContent: "center",
          }}
        >
          {visibleStations.map((station, index) => (
            <motion.div
              key={station.id}
              className="cursor-pointer bg-white/5 border border-white/10 rounded-2xl p-5 text-center hover:scale-105 hover:shadow-xl transition duration-300 max-w-sm w-full mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              onClick={() => openModal(station)}
            >
              <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden">
                <Image
                  src={station.imageUrl}
                  alt={station.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold font-poppins mb-1">{station.name}</h3>
              <p className="text-sm text-gray-400 font-inter mb-2">
                {station.type} • {station.genre}
              </p>
              <p className="text-sm text-gray-300 font-inter line-clamp-2">{station.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedStation && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
          <div className="bg-white text-black rounded-xl max-w-md w-full p-6 relative shadow-2xl">
            <button
              onClick={closeModal}
              className="absolute top-3 right-4 text-2xl font-bold text-gray-500 hover:text-gray-800"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold font-poppins mb-2">{selectedStation.name}</h2>
            <p className="text-sm text-gray-600 mb-2 font-inter">
              {selectedStation.type} • {selectedStation.genre}
            </p>
            <p className="text-gray-800 mb-4 font-inter">{selectedStation.description}</p>

            {/* Replace "#" with actual link if available */}
            <a
              href={selectedStation.link || "#"}
              className="inline-block mt-2 text-sm font-medium text-blue-600 hover:underline"
            >
              Visit Station Page &rarr;
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
