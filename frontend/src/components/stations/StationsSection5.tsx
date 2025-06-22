"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function StationsSection5() {
  const [showModal, setShowModal] = useState(false);

  return (
    <section className="py-20 px-6 md:px-16 text-white relative z-10">
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

          <button
            onClick={() => setShowModal(true)}
            className="inline-block bg-white text-primary px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
          >
            Discover Our Impact
          </button>
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
            src="/hero-images/network098.jpg"
            alt="Tetemeko community impact"
            fill
            className="object-cover rounded-xl shadow-lg"
          />
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="bg-white text-primary rounded-xl max-w-xl w-full p-6 relative"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()} // Prevent closing on inner click
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
              >
                &times;
              </button>
              <h3 className="text-2xl font-bold mb-4">
                How Tetemeko Media Makes a Difference
              </h3>
              <p className="mb-3 text-gray-700 leading-relaxed">
                Tetemeko Media is a platform for empowerment. Through our radio and TV stations,
                we spotlight local talent, promote civic education, and provide real-time updates
                that affect daily life in our communities.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our initiatives include youth forums, talent showcases, community-driven
                storytelling, and access to emergency information during crises. Every broadcast
                aims to connect, educate, and uplift.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
