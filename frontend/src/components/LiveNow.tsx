'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { getStations } from '@/services/stations';
import { Station } from '@/interfaces/Station';

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

export default function LiveNow() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = 280;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -amount : amount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const fetchStations = async () => {
      const data = await getStations();
      const liveStations = (data || []).filter((station: Station) => station.isActive);
      setStations(liveStations);
      setLoading(false);
    };

    fetchStations();
  }, []);

  return (
    <section className="py-20 bg-[#07131F] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-2">Live Now</h2>
          <div className="mx-auto h-1 w-28 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400 rounded-full mb-4" />
          <p className="text-blue-200 max-w-xl mx-auto text-base sm:text-lg">
            Tune in to our stations broadcasting live across East Africa.
          </p>
        </div>

        {/* Mobile Arrows */}
        <div className="relative sm:hidden mt-6 mb-3">
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#0a1b2d] p-2 rounded-full shadow text-white"
          >
            <IoIosArrowBack size={20} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#0a1b2d] p-2 rounded-full shadow text-white"
          >
            <IoIosArrowForward size={20} />
          </button>
        </div>

        {/* Station Cards */}
        {loading ? (
          <p className="text-center text-blue-200">Loading live stations...</p>
        ) : stations.length === 0 ? (
          <p className="text-center text-blue-400">No stations are live at the moment.</p>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto sm:overflow-visible sm:grid sm:grid-cols-2 lg:grid-cols-3 hide-scrollbar scroll-smooth px-1 sm:px-0"
          >
            {stations.map((station, index) => (
              <motion.div
                key={station._id}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={cardVariants}
                className="min-w-[250px] sm:min-w-0 bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-md hover:shadow-xl transition-all duration-300"
              >
                {/* Logo & Name */}
                <div className="flex items-center gap-4 mb-3">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border border-white/20">
                    <Image
                      src={station.imageUrl}
                      alt={station.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-blue-100 font-semibold text-base sm:text-lg">
                    {station.name}
                  </div>
                </div>

                {/* Description */}
                <p className="text-blue-300 text-sm mb-4 hidden sm:block line-clamp-3">
                  {station.description}
                </p>

                {/* Bottom Section */}
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex gap-1 flex-wrap text-xs">
                    {station.genre.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-600/20 border border-blue-500/30 text-blue-300 px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link href={`/stations/${station._id}`} passHref>
                    <button className="ml-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-xs sm:text-sm font-semibold rounded-lg transition">
                      Listen Live
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
