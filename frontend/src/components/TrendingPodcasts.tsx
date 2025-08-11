'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FaPlay, FaHeadphones } from 'react-icons/fa';
import { FiClock } from 'react-icons/fi';

const podcasts = [
  {
    id: 1,
    title: 'Voices of the Nile',
    host: 'Achieng L.',
    image: 'https://picsum.photos/seed/podcast1/600/600',
    slug: 'voices-of-the-nile',
    duration: '42 min',
    listens: '12.4K',
    category: 'Culture'
  },
  {
    id: 2,
    title: 'AfroTech Talks',
    host: 'Tech & Innovation in Africa',
    image: 'https://picsum.photos/seed/podcast2/600/600',
    slug: 'afrotech-talks',
    duration: '35 min',
    listens: '8.7K',
    category: 'Technology'
  },
  {
    id: 3,
    title: 'Roots & Culture',
    host: 'Luo heritage and stories',
    image: 'https://picsum.photos/seed/podcast3/600/600',
    slug: 'roots-and-culture',
    duration: '58 min',
    listens: '15.2K',
    category: 'History'
  },
  {
    id: 4,
    title: 'Youth Wave',
    host: 'Urban talk & fresh music',
    image: 'https://picsum.photos/seed/podcast4/600/600',
    slug: 'youth-wave',
    duration: '45 min',
    listens: '21.1K',
    category: 'Music'
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.16, 0.77, 0.47, 0.97],
    },
  }),
};

export default function TrendingPodcasts() {
  return (
    <section className="bg-gradient-to-b from-gray-950 to-gray-900 py-16 md:py-24 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 text-xs font-semibold bg-blue-900/30 text-blue-400 rounded-full mb-4">
            TRENDING NOW
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
            Popular Podcasts
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
            Discover what's buzzing in our audio library. Fresh voices. Real conversations.
          </p>
        </div>

        {/* Podcast Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {podcasts.map((podcast, index) => (
            <motion.div
              key={podcast.id}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={cardVariants}
              className="group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700 hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/10"
            >
              <div className="relative aspect-square w-full">
                <Image
                  src={podcast.image}
                  alt={podcast.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  placeholder="blur"
                  blurDataURL={`data:image/svg+xml;base64,${btoa(
                    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" fill="#1e293b"><rect width="600" height="600"/></svg>`
                  )}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
                <div className="absolute top-3 right-3 bg-gray-900/80 text-xs font-medium px-2 py-1 rounded-full">
                  {podcast.category}
                </div>
              </div>
              
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-white line-clamp-2">
                    {podcast.title}
                  </h3>
                </div>
                
                <p className="text-blue-400 text-sm mb-4">Hosted by {podcast.host}</p>
                
                <div className="flex items-center gap-4 text-gray-400 text-xs mb-5">
                  <div className="flex items-center gap-1">
                    <FiClock size={14} />
                    <span>{podcast.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaHeadphones size={14} />
                    <span>{podcast.listens}</span>
                  </div>
                </div>
                
                <Link href={`/podcasts/${podcast.slug}`}>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-sm font-medium rounded-lg text-white transition-all group-hover:shadow-lg group-hover:shadow-blue-500/20">
                    <FaPlay size={12} /> Listen Now
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* View All Button */}
        <div className="text-center mt-12">
          <Link href="/podcasts">
            <button className="inline-flex items-center px-6 py-3 border border-gray-700 hover:border-blue-500 text-sm font-medium rounded-full text-white bg-gray-800/50 hover:bg-gray-700/50 transition-all">
              View All Podcasts
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}