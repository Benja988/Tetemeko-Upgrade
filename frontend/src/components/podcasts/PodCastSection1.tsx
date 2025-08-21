"use client";

import React, { useState, useRef, useEffect } from "react";
import { Podcast, Episode } from "@/interfaces/podcasts";
import { podcastService } from "@/services/podcasts/podcastsService";
import { episodeService } from "@/services/episodes/episodeServices";

export default function PodCastSection1() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [featuredPodcast, setFeaturedPodcast] = useState<Podcast | null>(null);
  const [latestEpisode, setLatestEpisode] = useState<Episode | null>(null);

  useEffect(() => {
  const fetchFeatured = async () => {
    try {
      // ✅ fetch podcasts with page + limit
      const res = await podcastService.getAll({ page: 1, limit: 1 });
      const podcast = res.podcasts[0];
      if (podcast) {
        setFeaturedPodcast(podcast);

        // ✅ fetch its episodes (latest only)
        const episodesRes = await episodeService.getAll(podcast._id, { page: 1, limit: 1 });
        setLatestEpisode(episodesRes.episodes[0] || null);
      }
    } catch (err) {
      console.error("Failed to load featured podcast", err);
    }
  };
  fetchFeatured();
}, []);


  if (!featuredPodcast || !latestEpisode) return null;

  const togglePlay = () => {
    if (!audioRef.current) return;
    isPlaying ? audioRef.current.pause() : audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  return (
    <section className="bg-gradient-to-r text-white py-20 px-8 md:px-16 rounded-2xl shadow-2xl max-w-7xl mx-auto font-poppins">
      <div className="max-w-4xl mx-auto text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
          Welcome to <span className="text-purple-400">{featuredPodcast.title}</span>
        </h1>
        <p className="text-lg mb-12 text-purple-200">{featuredPodcast.description}</p>

        <article
          className="flex flex-col md:flex-row items-center bg-white bg-opacity-10 rounded-3xl p-8 md:p-12 shadow-lg"
          onClick={togglePlay}
        >
          {featuredPodcast.coverImage && (
            <img
              src={featuredPodcast.coverImage}
              alt={featuredPodcast.title}
              className="w-48 h-48 rounded-2xl object-cover shadow-md mb-6 md:mb-0 md:mr-10"
            />
          )}
          <div className="flex-1 text-left">
            <h2 className="text-2xl font-semibold mb-3">{latestEpisode.title}</h2>
            <p className="mb-6 text-purple-100">{latestEpisode.description}</p>

            <audio
              ref={audioRef}
              src={latestEpisode.audioUrl}
              onEnded={() => setIsPlaying(false)}
            />

            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="inline-flex items-center gap-3 bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-full text-white font-semibold"
            >
              {isPlaying ? "Pause Episode" : "Play Episode"}
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}
