"use client";

import React, { useState, useRef } from "react";
// import { podcasts } from "@/data/podcasts";

export default function PodCastSection1() {
  // const featuredPodcast = podcasts.find((p) => p.id === "3");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // if (!featuredPodcast) return null;

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const onAudioEnded = () => setIsPlaying(false);

  return (
    <></>
    // <section
    //   aria-label="Featured Podcast Episode"
    //   className="bg-gradient-to-r text-white py-20 px-8 md:px-16 rounded-2xl shadow-2xl max-w-7xl mx-auto font-poppins"
    // >
    //   <div className="max-w-4xl mx-auto text-center md:text-left">
    //     <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6 drop-shadow-md">
    //       Welcome to <span className="text-purple-400">Tetemeko Podcasts</span>
    //     </h1>
    //     <p className="text-lg md:text-xl max-w-3xl mx-auto md:mx-0 mb-12 text-purple-200 font-light tracking-wide">
    //       Dive into exclusive interviews, stories, and insights from your favorite
    //       hosts. Stay tuned and catch the latest episodes from Tetemeko Media.
    //     </p>

    //     <article
    //       tabIndex={0}
    //       className="flex flex-col md:flex-row items-center bg-white bg-opacity-10 rounded-3xl p-8 md:p-12 shadow-lg hover:bg-opacity-20 focus-within:bg-opacity-20 transition cursor-pointer"
    //       onClick={togglePlay}
    //       onKeyDown={(e) => {
    //         if (e.key === "Enter" || e.key === " ") {
    //           e.preventDefault();
    //           togglePlay();
    //         }
    //       }}
    //       aria-live="polite"
    //       aria-pressed={isPlaying}
    //       role="button"
    //     >
    //       <img
    //         src={featuredPodcast.image}
    //         alt={`Podcast cover art for episode titled "${featuredPodcast.title}"`}
    //         className="w-48 h-48 rounded-2xl object-cover shadow-md mb-6 md:mb-0 md:mr-10 flex-shrink-0"
    //         loading="lazy"
    //         decoding="async"
    //       />

    //       <div className="flex-1 text-left select-text">
    //         <h2 className="text-3xl font-semibold mb-3 drop-shadow-sm">
    //           {featuredPodcast.title}
    //         </h2>
    //         <p className="mb-6 text-purple-100 text-base md:text-lg leading-relaxed italic tracking-wide font-light">
    //           {featuredPodcast.description}
    //         </p>

    //         <audio
    //           ref={audioRef}
    //           src={featuredPodcast.audio}
    //           onEnded={onAudioEnded}
    //           preload="none"
    //           aria-label={`Audio player for ${featuredPodcast.title}`}
    //         />

    //         <button
    //           onClick={(e) => {
    //             e.stopPropagation();
    //             togglePlay();
    //           }}
    //           className="inline-flex items-center gap-3 bg-purple-600 hover:bg-purple-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 transition px-8 py-3 rounded-full text-white font-semibold shadow-lg select-none"
    //           aria-label={isPlaying ? "Pause podcast episode" : "Play podcast episode"}
    //           aria-pressed={isPlaying}
    //           type="button"
    //         >
    //           {isPlaying ? (
    //             <svg
    //               xmlns="http://www.w3.org/2000/svg"
    //               className="h-7 w-7"
    //               fill="none"
    //               viewBox="0 0 24 24"
    //               stroke="currentColor"
    //               strokeWidth={2}
    //               aria-hidden="true"
    //             >
    //               <rect x="6" y="5" width="4" height="14" rx="1" />
    //               <rect x="14" y="5" width="4" height="14" rx="1" />
    //             </svg>
    //           ) : (
    //             <svg
    //               xmlns="http://www.w3.org/2000/svg"
    //               className="h-7 w-7 animate-pulse"
    //               fill="currentColor"
    //               viewBox="0 0 24 24"
    //               aria-hidden="true"
    //             >
    //               <path d="M5 3v18l15-9L5 3z" />
    //             </svg>
    //           )}
    //           {isPlaying ? "Pause Episode" : "Play Episode"}
    //         </button>
    //       </div>
    //     </article>
    //   </div>
    // </section>
  );
}
