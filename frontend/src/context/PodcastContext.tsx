"use client";
import { createContext, useContext, useState, useRef } from "react";

interface PodcastContextProps {
  audioSrc: string;
  title: string;
  image: string;
  isPlaying: boolean;
  playPodcast: (src: string, title: string, image: string) => void;
  togglePlayPause: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const PodcastContext = createContext<PodcastContextProps | null>(null);

export function PodcastProvider({ children }: { children: React.ReactNode }) {
  const [audioSrc, setAudioSrc] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playPodcast = (src: string, title: string, image: string) => {
    setAudioSrc(src);
    setTitle(title);
    setImage(image);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <PodcastContext.Provider
      value={{
        audioSrc,
        title,
        image,
        isPlaying,
        playPodcast,
        togglePlayPause,
        audioRef,
      }}
    >
      {children}
    </PodcastContext.Provider>
  );
}

export function usePodcast() {
  const context = useContext(PodcastContext);
  if (!context) throw new Error("usePodcast must be used inside PodcastProvider");
  return context;
}
