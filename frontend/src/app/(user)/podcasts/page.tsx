"use client";

import PodcastList from "@/components/podcasts/PodcastList";
import Navbar from "@/components/Navbar";
import { PodcastProvider } from "@/context/PodcastContext";
import TrendingPodcasts from "@/components/podcasts/TrendingPodcasts";
import PageHeader from "@/components/podcasts/PageHeader";
import PodcastRecommendations from "@/components/podcasts/PodcastRecommendations";  // New Podcast Recommendations component
import FeaturedPodcast from "@/components/podcasts/FeaturedPodcast";
import PodcastSearchBar from "@/components/podcasts/PodacastSearchBar";
import PodcastCategories from "@/components/podcasts/PodcastCategories";

export default function PodcastPage() {
  // Search function (you can adapt this to filter the podcast list based on user input)
  const handleSearch = (query: string) => {
    console.log("Search query:", query);
    // Implement search functionality here
  };

  return (
    <PodcastProvider>
      <div className="min-h-screen bg-gray-50 py-16 px-8">
        {/* Navbar */}
        <Navbar />
        
        {/* Search Bar */}
        <div className="max-w-7xl mx-auto mb-8">
          <PodcastSearchBar onSearch={handleSearch} />
        </div>

        {/* Featured Podcast */}
        <FeaturedPodcast />

        {/* Page Header */}
        <PageHeader
          title="Our Latest Podcasts"
          subtitle="Listen and learn from experts around the world."
        />

        {/* Podcast Categories */}
        <PodcastCategories />

        {/* Latest Podcasts */}
        <section className="mb-16">
          <PodcastList />
        </section>

        {/* Trending Podcasts */}
        <section>
          <TrendingPodcasts />
        </section>

        {/* Podcast Recommendations */}
        <section className="mt-16">
          <PodcastRecommendations />
        </section>

      </div>
    </PodcastProvider>
  );
}
