"use client";

import { motion } from "framer-motion";

export default function StationsOverview() {
  return (
    <section className="bg-white border-t border-gray-200 py-20 px-6 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left - Image with motion */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="w-full h-72 sm:h-96 overflow-hidden rounded-xl shadow-xl"
        >
          <img
            src="/img6.jpg"
            alt="Tetemeko Stations"
            className="w-full h-full object-cover object-center rounded-xl"
          />
        </motion.div>

        {/* Right - Text with motion */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#07131F] mb-6 tracking-tight leading-tight">
            About Tetemeko Stations
          </h2>
          <p className="text-gray-700 text-lg sm:text-xl leading-relaxed font-light">
            At{" "}
            <span className="font-semibold text-blue-900">
              Tetemeko Media Group
            </span>
            , we amplify voices that matter. Our stations celebrate culture,
            creativity, and community—featuring everything from modern gospel
            and urban hits to regional stories and global conversations. Each
            broadcast is crafted to inform, entertain, and uplift the spirit of
            Tanzania and beyond.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
