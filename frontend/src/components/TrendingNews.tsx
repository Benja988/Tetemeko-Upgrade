'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowRight, FiCalendar, FiClock } from 'react-icons/fi';

const news = [
  {
    id: 1,
    title: 'East Africa Music Awards 2025: Full Highlights',
    excerpt: 'The most memorable moments from this year\'s biggest music event in the region',
    image: 'https://picsum.photos/seed/music-awards/800/600',
    slug: 'east-africa-music-awards',
    date: 'May 15, 2025',
    readTime: '4 min read',
    category: 'Entertainment'
  },
  {
    id: 2,
    title: '5G Expansion Plans in Kenya: What to Expect',
    excerpt: 'How the new infrastructure will transform digital connectivity nationwide',
    image: 'https://picsum.photos/seed/5g-kenya/800/600',
    slug: '5g-expansion-kenya',
    date: 'May 12, 2025',
    readTime: '6 min read',
    category: 'Technology'
  },
  {
    id: 3,
    title: 'New Podcast Series: "Voices of the Market" Launching Soon',
    excerpt: 'Documenting the untold stories from East Africa\'s vibrant marketplaces',
    image: 'https://picsum.photos/seed/podcast-launch/800/600',
    slug: 'voices-of-the-market-launch',
    date: 'May 10, 2025',
    readTime: '3 min read',
    category: 'Media'
  },
  {
    id: 4,
    title: 'Meet the Winners of Our Youth Innovation Grant',
    excerpt: '10 young entrepreneurs awarded funding for their groundbreaking ideas',
    image: 'https://picsum.photos/seed/innovation-grant/800/600',
    slug: 'youth-innovation-winners',
    date: 'May 8, 2025',
    readTime: '5 min read',
    category: 'Business'
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
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

export default function TrendingNews() {
  return (
    <section className="relative w-full text-white py-20 md:py-28 overflow-hidden bg-gradient-to-br from-gray-950 to-gray-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-900/20 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-900/20 rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider text-blue-400 bg-blue-900/30 rounded-full mb-4 uppercase">
            Breaking Stories
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
            Trending News
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Stay updated with the latest happenings across East Africa
          </p>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {news.map((item, index) => (
            <motion.div
              key={item.id}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={cardVariants}
              className="group relative bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/10"
            >
              <div className="relative aspect-video w-full">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  placeholder="blur"
                  blurDataURL={`data:image/svg+xml;base64,${btoa(
                    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" fill="#1e293b"><rect width="800" height="600"/></svg>`
                  )}`}
                />
                <div className="absolute top-3 right-3 bg-gray-900/80 text-xs font-medium px-2 py-1 rounded-full">
                  {item.category}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/30 to-transparent" />
              </div>
              
              <div className="p-5">
                <div className="flex items-center gap-3 text-gray-400 text-xs mb-3">
                  <div className="flex items-center gap-1">
                    <FiCalendar size={14} />
                    <span>{item.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiClock size={14} />
                    <span>{item.readTime}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                  {item.title}
                </h3>
                
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {item.excerpt}
                </p>
                
                <Link href={`/news/${item.slug}`} className="inline-flex items-center gap-1 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
                  Read full story <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <Link href="/news">
            <button className="inline-flex items-center px-6 py-3 border border-gray-700 hover:border-blue-500 text-sm font-medium rounded-full text-white bg-gray-800/50 hover:bg-gray-700/50 transition-all group">
              View All News Articles
              <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}