"use client";

import { useEffect, useState } from "react";
import { Play, User, Clock, TrendingUp } from "lucide-react";
import { Podcast } from "@/interfaces/podcasts";
import { podcastService } from "@/services/podcasts/podcastsService";
import EpisodeModal from "./EpisodeModal";

export default function PodCastSection2() {
  const [allPodcasts, setAllPodcasts] = useState<Podcast[]>([]);
  const [displayedPodcasts, setDisplayedPodcasts] = useState<Podcast[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(6); // Start with 6 on large screens

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const res = await podcastService.getAll({ page: 1, limit: 12 });
        setAllPodcasts(res.podcasts);
        setDisplayedPodcasts(res.podcasts.slice(0, visibleCount));
      } catch (err) {
        console.error("Failed to load podcasts", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPodcasts();
  }, []);

  useEffect(() => {
    // Adjust initial visible count based on screen size
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(3); // 3 on mobile
      } else if (window.innerWidth < 1024) {
        setVisibleCount(4); // 4 on tablet
      } else {
        setVisibleCount(6); // 6 on desktop
      }
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setDisplayedPodcasts(allPodcasts.slice(0, visibleCount));
  }, [visibleCount, allPodcasts]);

  const handlePodcastClick = (podcast: Podcast) => {
    setSelectedPodcast(podcast);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPodcast(null);
  };

  const loadMore = () => {
    setVisibleCount(prev => prev + 3); // Load 3 more items
  };

  const filterOptions = [
    { id: "all", label: "All Shows" },
    { id: "popular", label: "Popular" },
    { id: "recent", label: "Recent" },
    { id: "trending", label: "Trending" }
  ];

  if (isLoading) {
    return (
      <section className="py-12 lg:py-16 px-4 sm:px-6 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 lg:mb-12">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-800/50 text-xs mb-4 animate-pulse">
              <div className="w-16 h-3 bg-slate-700 rounded"></div>
            </div>
            <div className="h-8 sm:h-10 bg-slate-800 rounded-lg max-w-md mx-auto mb-4"></div>
            <div className="h-4 bg-slate-800 rounded max-w-sm mx-auto"></div>
          </div>
          
          {/* Filter Skeleton */}
          <div className="flex flex-wrap justify-center gap-2 mb-8 lg:mb-10">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-8 w-20 bg-slate-800 rounded-full animate-pulse"></div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30 animate-pulse">
                <div className="w-full aspect-square bg-slate-700 rounded-lg mb-3"></div>
                <div className="h-5 bg-slate-700 rounded mb-2"></div>
                <div className="h-3 bg-slate-700 rounded mb-2 w-3/4"></div>
                <div className="h-3 bg-slate-700 rounded mb-3 w-1/2"></div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-slate-700 rounded-full mr-2"></div>
                  <div className="h-3 bg-slate-700 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-12 lg:py-16 px-4 sm:px-6 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-10 lg:mb-12">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-300 text-xs mb-4 backdrop-blur-sm border border-purple-500/20">
              <TrendingUp className="h-3 w-3 mr-1" />
              Curated Collection
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-white">
              Explore Podcasts
            </h2>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              Discover engaging shows that inspire, inform, and entertain you.
            </p>
          </div>
          
          {/* Filter Options */}
          <div className="flex flex-wrap justify-center gap-2 mb-8 lg:mb-10">
            {filterOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setActiveFilter(option.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  activeFilter === option.id
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md"
                    : "bg-slate-800/50 text-gray-400 hover:bg-slate-700/50 hover:text-white border border-slate-700/30"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          
          {/* Podcast Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {displayedPodcasts.map((podcast) => (
              <div 
                key={podcast._id} 
                className="group bg-slate-800/30 hover:bg-slate-800/40 rounded-xl p-4 transition-all duration-300 border border-slate-700/30 hover:border-purple-400/30 cursor-pointer"
                onClick={() => handlePodcastClick(podcast)}
              >
                <div className="relative overflow-hidden rounded-lg mb-3">
                  {podcast.coverImage && (
                    <img
                      src={podcast.coverImage}
                      alt={podcast.title}
                      className="w-full aspect-square object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <button className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-full flex items-center justify-center shadow-md">
                      <Play className="h-3 w-3 ml-0.5" />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-sm font-semibold mb-2 text-white line-clamp-1">
                  {podcast.title}
                </h3>
                
                <p className="text-xs text-gray-400 mb-3 line-clamp-2 leading-relaxed">
                  {podcast.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center mr-2">
                      <User className="h-3 w-3 text-gray-400" />
                    </div>
                    <span className="text-xs text-gray-400">
                      {podcast.createdBy?.name || "Unknown Host"}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>45m</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Load More Button - Only show if there are more podcasts to load */}
          {visibleCount < allPodcasts.length && (
            <div className="text-center mt-10">
              <button 
                onClick={loadMore}
                className="px-6 py-2.5 bg-slate-800/50 hover:bg-slate-700/50 text-gray-400 hover:text-white rounded-lg border border-slate-700/30 hover:border-purple-400/30 transition-all duration-200 text-sm"
              >
                Load More ({allPodcasts.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Episode Modal */}
      {selectedPodcast && (
        <EpisodeModal
          podcastId={selectedPodcast._id}
          podcastTitle={selectedPodcast.title}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </>
  );
}