"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function StationsSection5() {
  return (
    <section className="py-20 px-6 md:px-16 text-white">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Text Section */}
        <motion.div
          className="flex-1 text-center md:text-left"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-poppins font-bold mb-6">
            Broadcasting Change, Empowering Voices
          </h2>
          <p className="text-gray-300 font-inter mb-8">
            At Tetemeko Media, we don’t just entertain — we inspire. From youth empowerment to real-time community updates, we amplify stories that matter.
          </p>

          <a
            href="#"
            className="inline-block bg-white text-primary px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
          >
            Discover Our Impact
          </a>
        </motion.div>

        {/* Right Image */}
        <motion.div
          className="flex-1 relative w-full h-72 md:h-[400px]"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Image
            src="/team.jpg" // Replace with a real image
            alt="Tetemeko community impact"
            fill
            className="object-cover rounded-xl shadow-lg"
          />
        </motion.div>
      </div>
    </section>
  );
}
