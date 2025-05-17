"use client";

import { motion } from "framer-motion";
import { stations } from "@/data/stations"; // Extend your data to include new fields
import { Station } from "@/interfaces/Station";

export default function StationsSection3() {
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
          Live Broadcast Directory
        </motion.h2>

        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[800px] table-auto bg-white/5 text-sm md:text-base">
            <thead className="bg-white/10 text-left font-semibold text-gray-300 uppercase tracking-wide">
              <tr>
                <th className="p-4">Station</th>
                <th className="p-4">Type</th>
                <th className="p-4">Genre</th>
                <th className="p-4">Location</th>
                <th className="p-4">Live Show</th>
                <th className="p-4">Listeners</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {stations.map((station: Station, index) => (
                <motion.tr
                  key={station.id}
                  className="border-t border-white/10 hover:bg-white/10 transition"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <td className="p-4 font-medium text-white">{station.name}</td>
                  <td className="p-4 text-gray-300">{station.type}</td>
                  <td className="p-4 text-gray-300">{station.genre}</td>
                  <td className="p-4 text-gray-300">{station.location}</td>
                  <td className="p-4 text-gray-300">{station.liveShow}</td>
                  <td className="p-4 text-gray-300">{station.listeners}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        station.status === "Live"
                          ? "bg-green-600 text-white"
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      {station.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
