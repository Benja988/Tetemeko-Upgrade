'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FaPlay } from 'react-icons/fa';

const podcasts = [
  {
    id: 1,
    title: 'Voices of the Nile',
    host: 'Hosted by Achieng L.',
    image: '/podcasts/podcast1.jpg',
    slug: 'voices-of-the-nile',
  },
  {
    id: 2,
    title: 'AfroTech Talks',
    host: 'Tech & Innovation in Africa',
    image: '/podcasts/podcast2.jpg',
    slug: 'afrotech-talks',
  },
  {
    id: 3,
    title: 'Roots & Culture',
    host: 'Luo heritage and stories',
    image: '/podcasts/podcast3.jpg',
    slug: 'roots-and-culture',
  },
  {
    id: 4,
    title: 'Youth Wave',
    host: 'Urban talk & fresh music',
    image: '/podcasts/podcast4.jpg',
    slug: 'youth-wave',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: 'easeOut',
    },
  }),
};

export default function TrendingPodcasts() {
  return (
    <section className="bg-[#07131F] py-20 text-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8 lg:px-16">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-2">Trending Podcasts</h2>
          <div className="mx-auto w-24 h-1 bg-blue-500 rounded-full mb-3" />
          <p className="text-blue-200 max-w-2xl mx-auto text-sm sm:text-base">
            Discover what’s buzzing in our audio library. Fresh voices. Real conversations.
          </p>
        </div>

        {/* Podcast Cards */}
        <div className="flex gap-5 overflow-x-auto sm:grid sm:grid-cols-2 lg:grid-cols-4 hide-scrollbar scroll-smooth">
          {podcasts.map((podcast, index) => (
            <motion.div
              key={podcast.id}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              className="min-w-[240px] sm:min-w-0 bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="relative h-44 sm:h-48 w-full">
                <Image
                  src={podcast.image}
                  alt={podcast.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2">
                  {podcast.title}
                </h3>
                <p className="text-blue-300 text-sm mb-3 line-clamp-1">{podcast.host}</p>
                <Link href={`/podcasts/${podcast.slug}`}>
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-xs font-medium rounded-full text-white transition">
                    <FaPlay size={12} /> Listen
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
