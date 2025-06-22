"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { getStations } from "@/services/stations";// Adjust path if needed
import { Station } from "@/interfaces/Station";
import StraightLine from "../StraightLine";
import { Headphones } from "lucide-react";

export default function StationsSection3() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStations = async () => {
      setLoading(true);
      const data = await getStations();
      setStations(data);
      setLoading(false);
    };
    fetchStations();
  }, []);

  return (
    <section className="py-20 px-4 sm:px-6 md:px-16 bg-primary text-white">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          📡 Live Broadcast Directory
        </motion.h2>
        <StraightLine />

        {loading ? (
          <p className="text-center mt-10 text-gray-300">Loading stations...</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/10 mt-8">
            <table className="w-full min-w-[950px] bg-white/5 text-sm md:text-base text-left table-auto">
              <thead className="bg-white/10 text-gray-300 uppercase text-xs tracking-wider sticky top-0 z-10">
                <tr>
                  <th className="p-4">Station</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Genres</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Live Show</th>
                  <th className="p-4">Listeners</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Stream</th>
                </tr>
              </thead>
              <tbody>
                {stations.map((station: Station, index: number) => (
                  <motion.tr
                    key={station._id}
                    className={`border-t border-white/10 transition-all hover:bg-white/10 ${
                      index % 2 === 0 ? "bg-white/5" : "bg-white/0"
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <td className="p-4 flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                        <Image
                          src={station.imageUrl}
                          alt={station.name}
                          fill
                          loading="lazy"
                          className="object-cover"
                        />
                      </div>
                      <div className="font-semibold text-white truncate max-w-[180px]" title={station.name}>
                        {station.name}
                      </div>
                    </td>

                    <td className="p-4 text-gray-300">{station.type}</td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {station.genre.slice(0, 3).map((genre, i) => (
                          <span
                            key={i}
                            className="bg-gray-700 text-white text-xs px-2 py-0.5 rounded-full"
                          >
                            {genre}
                          </span>
                        ))}
                        {station.genre.length > 3 && (
                          <span className="text-xs text-gray-400">+{station.genre.length - 3}</span>
                        )}
                      </div>
                    </td>

                    <td className="p-4 text-gray-300">{station.location}</td>

                    <td className="p-4 text-gray-300">
                      {station.liveShow || <span className="italic text-gray-500">N/A</span>}
                    </td>

                    <td className="p-4 text-gray-300">
                      {station.listenerz?.toLocaleString() || 0}
                    </td>

                    <td className="p-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          station.isActive
                            ? "bg-green-600 text-white animate-pulse"
                            : "bg-gray-600 text-white"
                        }`}
                      >
                        {station.isActive ? "Live" : "Offline"}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      {station.streamUrl ? (
                        <a
                          href={station.streamUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded-full transition"
                          title="Open stream in new tab"
                        >
                          <Headphones size={14} /> Listen
                        </a>
                      ) : (
                        <span className="text-xs text-gray-500 italic">Unavailable</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
