"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaPlay } from "react-icons/fa";
import Breadcrumbs from "../Breadcrumbs";

export default function StationsSection1() {
  const [showVideo, setShowVideo] = useState(false);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Stations" },
  ];

  return (
    <section className="relative text-white overflow-hidden">
      {/* Background Image + Gradient Overlay + Content */}
      <div className="absolute inset-0 z-0">
        {/* <Image
          src="/tower1.jpg"
          alt="Tetemeko Studios"
          layout="fill"
          objectFit="cover"
          className="opacity-40"
          priority
          placeholder="blur"
          // blurDataURL="/blur/tower1-blur.jpg"
        /> */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        {/* Text on Background */}
        <div className="absolute bottom-4 left-6 md:left-16 z-10 text-sm md:text-base max-w-md">
          <p className="bg-white/10 backdrop-blur-md px-4 py-2 rounded text-gray-100">
            Broadcasting from the heart of Africa – connecting cultures, stories, and voices through Tetemeko Studios.
          </p>
        </div>
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 py-32 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Text Side */}
        <div className="flex-1 text-center lg:text-left">
          <Breadcrumbs items={breadcrumbItems} />

          <motion.span
            className="text-sm uppercase tracking-widest text-secondary-light mb-2 inline-block"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Africa’s Voice, Live and Direct
          </motion.span>

          <motion.h1
            className="text-4xl md:text-5xl font-poppins font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Discover the Voice of a Generation
          </motion.h1>

          <motion.p
            className="text-lg text-gray-300 font-inter mb-8 max-w-xl mx-auto lg:mx-0"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Stream live radio and TV, enjoy original shows, and connect with the future of African media — only on Tetemeko.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <button
              onClick={() =>
                document.getElementById("stations")?.scrollIntoView({ behavior: "smooth" })
              }
              className="bg-white text-primary font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition"
            >
              Browse Stations
            </button>
            <button
              onClick={() => setShowVideo(true)}
              className="flex items-center gap-2 border border-white px-6 py-3 rounded-full hover:bg-white hover:text-primary transition"
            >
              <FaPlay className="text-sm" />
              Watch Live
            </button>
          </motion.div>
        </div>

        {/* Visual Side with Overlay Text */}
        <motion.div
          className="flex-1 w-full h-64 md:h-96 relative flex items-center justify-center"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Image
            src="/neantena.jpg"
            alt="Broadcasting Equipment"
            width={500}
            height={300}
            className="object-contain rounded-lg shadow-lg"
            loading="lazy"
          />
          {/* Text over Image */}
          <div className="absolute bottom-4 left-4 right-4 bg-black/50 text-white text-sm px-4 py-2 rounded backdrop-blur-sm">
            Our state-of-the-art transmission empowers real-time storytelling across borders.
          </div>
        </motion.div>
      </div>

      {/* Modal for Live Stream */}
      {showVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-white rounded-lg overflow-hidden max-w-3xl w-full relative">
            <div className="relative pb-[56.25%]">
              <iframe
                src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
                className="absolute top-0 left-0 w-full h-full"
                title="Live Stream"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-2 right-2 text-black bg-white rounded-full p-2 hover:bg-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
