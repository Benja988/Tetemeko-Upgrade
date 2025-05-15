"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Play } from "lucide-react";
import Image from "next/image";

interface StationModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  description: string;
  type: string;
  genre: string;
  imageUrl: string;
}

export default function StationModal({
  isOpen,
  onClose,
  name,
  description,
  type,
  genre,
  imageUrl,
}: StationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} // Close modal when clicking on backdrop
        >
          <motion.div
            className="bg-white max-w-3xl w-full rounded-3xl shadow-2xl overflow-hidden relative transform transition-all duration-300"
            initial={{ scale: 0.95, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 30 }}
            transition={{ duration: 0.4 }}
            onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside the modal
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition duration-200"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image */}
            <div className="w-full h-64 relative">
              <Image
                src={imageUrl}
                alt={name}
                fill
                className="object-cover rounded-t-3xl"
              />
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-[#07131F]">{name}</h2>
                <button
                  className="p-3 bg-blue-950 text-white rounded-full hover:bg-blue-900 transition-all duration-200"
                  aria-label="Play station"
                >
                  <Play className="w-6 h-6" />
                </button>
              </div>

              <p className="text-gray-500 text-sm italic">{type} • {genre}</p>

              <p className="text-gray-700 text-base leading-relaxed">
                {description}
              </p>
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-100 rounded-b-3xl">
              <button
                onClick={onClose}
                className="w-full py-3 bg-blue-950 text-white text-lg rounded-lg shadow-md hover:bg-blue-900 transition duration-200"
                aria-label="Close modal"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
