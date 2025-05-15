'use client';

import { podcasts } from '@/constants/podcasts';
import { posts } from '@/constants/post';
import PodcastCard from './podcasts/PodcastCard';
// import NewsCard from './news/NewsCard';

export default function PodcastsAndNews() {
  const latestPodcasts = podcasts.slice(0, 3);
  const latestNews = [...posts]
    .filter((post) => post.type === 'news')
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3);

  return (
    <section className="bg-[#F8FAFC] py-20 px-4 md:px-12">
      <div className="max-w-7xl mx-auto space-y-16">
        <h2 className="text-4xl font-bold text-center text-[#07131F]">
          Podcasts & News
        </h2>

        {/* Podcasts Section */}
        <div>
          <h3 className="text-2xl font-semibold text-[#07131F] mb-6 border-b border-gray-200 pb-2">
            Latest Podcasts
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestPodcasts.map((podcast) => (
              <PodcastCard key={podcast.id} podcast={podcast} />
            ))}
          </div>
        </div>

        {/* News Section */}
        {/* <div>
          <h3 className="text-2xl font-semibold text-[#07131F] mb-6 border-b border-gray-200 pb-2">
            Latest News
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestNews.map((post) => (
              <NewsCard key={post.id} post={post} variant="detailed" />
            ))}
          </div>
        </div> */}
      </div>
    </section>
  );
}
