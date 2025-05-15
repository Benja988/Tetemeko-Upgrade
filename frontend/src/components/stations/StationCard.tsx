"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import StationModal from "./StationModal";

interface StationCardProps {
  name: string;
  type: string;
  description: string;
  genre: string;
  imageUrl: string;
}

export default function StationCard({
  name,
  type,
  description,
  genre,
  imageUrl,
}: StationCardProps) {
  const [imgSrc, setImgSrc] = useState(imageUrl);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative bg-[#0E1A2B] rounded-2xl shadow-md overflow-hidden group hover:scale-[1.015] transition-transform hover:shadow-xl"
    >
      <img
        src={imgSrc}
        onError={() => setImgSrc("/fallback.jpg")}
        alt={name}
        loading="lazy"
        className="w-full h-60 object-cover transition-opacity group-hover:opacity-90"
      />

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-5">
        <header>
          <h3 className="text-2xl font-semibold text-white tracking-tight mb-1">
            {name}
          </h3>
          <p className="text-sm text-gray-300 font-medium">{type}</p>
        </header>

        <p className="text-sm text-gray-400 mt-3 line-clamp-3">
          {description}
        </p>

        <p className="text-xs text-gray-400 mt-2 italic">{genre}</p>

        <button
          onClick={() => setIsOpen(true)}
          className="mt-4 text-blue-400 text-sm font-semibold underline group-hover:text-blue-300 transition-colors"
        >
          Listen Now →
        </button>

        {/* Station Modal */}
        <StationModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          name={name}
          description={description}
          type={type}
          genre={genre}
          imageUrl={imageUrl}
        />
      </div>

      {/* Clickable Link Layer */}
      {/* <Link
        href={link}
        aria-label={`Visit ${name} station`}
        className="absolute inset-0"
      /> */}
    </motion.article>
  );
}
