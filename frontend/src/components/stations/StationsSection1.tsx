"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FaPlay } from "react-icons/fa"; // Adjust path as needed
import Breadcrumbs from "../Breadcrumbs";

export default function StationsSection1() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Stations" },
  ];

  return (
    <section className="relative bg-primary text-white overflow-hidden">
      {/* Background Image + Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/tower1.jpg"
          alt="Tetemeko Studios"
          layout="fill"
          objectFit="cover"
          className="opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 py-32 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Text Side */}
        <div className="flex-1 text-center lg:text-left">
          {/* Breadcrumbs here */}
          <Breadcrumbs items={breadcrumbItems} />

          <motion.h1
            className="text-4xl md:text-5xl font-poppins font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Discover the Voice of a Generation
          </motion.h1>

          <motion.p
            className="text-lg text-gray-300 font-inter mb-8 max-w-xl mx-auto lg:mx-0"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Stream live radio and TV, explore original shows, and connect with the future of African media — powered by Tetemeko.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <button className="bg-white text-primary font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition">
              Browse Stations
            </button>
            <button className="flex items-center gap-2 border border-white px-6 py-3 rounded-full hover:bg-white hover:text-primary transition">
              <FaPlay className="text-sm" />
              Watch Live
            </button>
          </motion.div>
        </div>

        {/* Visual Side */}
        <motion.div
          className="flex-1 w-full h-64 md:h-96 flex items-center justify-center"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Image
            src="/tower1.jpg"
            alt="Audio Visual"
            width={500}
            height={300}
            className="object-contain"
          />
        </motion.div>
      </div>
    </section>
  );
}
