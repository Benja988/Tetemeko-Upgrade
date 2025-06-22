'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const news = [
  {
    id: 1,
    title: 'East Africa Music Awards 2025: Full Highlights',
    image: '/news/news1.jpg',
    slug: 'east-africa-music-awards',
  },
  {
    id: 2,
    title: '5G Expansion Plans in Kenya: What to Expect',
    image: '/news/news2.jpg',
    slug: '5g-expansion-kenya',
  },
  {
    id: 3,
    title: 'New Podcast Series: “Voices of the Market” Launching Soon',
    image: '/news/news3.jpg',
    slug: 'voices-of-the-market-launch',
  },
  {
    id: 4,
    title: 'Meet the Winners of Our Youth Innovation Grant',
    image: '/news/news4.jpg',
    slug: 'youth-innovation-winners',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

export default function TrendingNews() {
  return (
    <section className="relative w-full text-white py-24 overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 brightness-[0.4]"
      >
        <source src="/GlobeE.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-[#07131F]/60 z-0" />

      {/* Content */}
      <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-8 lg:px-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold">Trending News</h2>
          <div className="mx-auto mt-2 w-24 h-1 bg-blue-500 rounded-full" />
          <p className="text-blue-200 mt-3 max-w-xl mx-auto text-sm sm:text-base">
            Get the latest updates from around East Africa and beyond.
          </p>
        </div>

        {/* News Cards */}
        <div className="flex gap-6 overflow-x-auto sm:grid sm:grid-cols-2 lg:grid-cols-4 hide-scrollbar scroll-smooth">
          {news.map((item, index) => (
            <motion.div
              key={item.id}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              className="min-w-[250px] sm:min-w-0 bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition"
            >
              <div className="relative h-40 sm:h-48 w-full">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-base font-semibold text-white line-clamp-2 mb-3">
                  {item.title}
                </h3>
                <Link href={`/news/${item.slug}`}>
                  <button className="text-sm px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition">
                    Read More
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
