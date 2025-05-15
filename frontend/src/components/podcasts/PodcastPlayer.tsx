"use client";

import { useEffect, useState } from "react";
import { usePodcast } from "@/context/PodcastContext";
import { FaPlay, FaPause, FaVolumeUp, FaEllipsisH, FaTimes } from "react-icons/fa";

export default function PodcastPlayer() {
  const { audioSrc, title, image, isPlaying, togglePlayPause, audioRef } = usePodcast(); // <-- fixed thumbnail to image
  const [isVisible, setIsVisible] = useState(true);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [audioSrc, isPlaying, volume, audioRef]);

  const handleClose = () => {
    setIsVisible(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  if (!audioSrc || !isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-xl flex items-center justify-between px-4 md:px-8 py-2 z-50">
      {/* Left: Thumbnail and Title */}
      <div className="flex items-center min-w-0">
        {image && (
          <img
            src={image}
            alt={title}
            className="w-12 h-12 rounded-md object-cover mr-4"
          />
        )}
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate">{title}</h3>
        </div>
      </div>

      {/* Center: Controls */}
      <div className="flex items-center space-x-4">
        {/* Play/Pause */}
        <button
          onClick={togglePlayPause}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 transition flex items-center justify-center"
        >
          {isPlaying ? <FaPause size={18} /> : <FaPlay size={18} />}
        </button>

        {/* Volume Control */}
        <div className="hidden md:flex items-center space-x-2">
          <FaVolumeUp className="text-gray-600" size={16} />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24 h-1 bg-gray-300 rounded-full appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-3 ml-4">
        {/* More Options */}
        <button
          aria-label="More Options"
          className="text-gray-600 hover:text-gray-800 p-2 transition"
        >
          <FaEllipsisH size={16} />
        </button>

        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close Player"
          className="text-gray-600 hover:text-red-500 p-2 transition"
        >
          <FaTimes size={16} />
        </button>
      </div>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={audioSrc} preload="metadata" />
    </div>
  );
}
