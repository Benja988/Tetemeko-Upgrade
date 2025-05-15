"use client";

import { stations } from "@/constants/stations";
import StationCard from "@/components/stations/StationCard";
import StationsOverview from "@/components/stations/StationsOverview";
import Navbar from "@/components/Navbar";

import { motion } from "framer-motion";

export default function StationsPage() {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Page Header */}


      <header className="relative bg-gradient-to-r from-blue-950 to-blue-800 text-white py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl sm:text-6xl font-extrabold mb-6 tracking-tight"
          >
            Voices that Move the Nation
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.2, ease: "easeOut" }}
            className="text-xl sm:text-2xl text-blue-200 max-w-3xl mx-auto leading-relaxed font-light"
          >
            From the pulse of urban music to the heartbeat of local culture, Tetemeko Stations connect communities,
            celebrate diversity, and broadcast the stories that shape Tanzania—loud, proud, and clear.
          </motion.p>
        </div>

        {/* Decorative Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/30 to-gray-100 opacity-40 pointer-events-none" />
      </header>



      {/* Overview Section */}
      <StationsOverview />

      {/* Stations Section */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#07131F] text-center mb-12">
          Explore Our Stations
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {stations.map((station) => (
            <StationCard
              key={station.id}
              name={station.name}
              type={station.type}
              description={station.description}
              genre={station.genre}
              imageUrl={station.imageUrl}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
