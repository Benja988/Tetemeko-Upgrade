// TrendingPodcasts Component
'use client'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { FiClock, FiArrowRight } from 'react-icons/fi'
import { FaPlay, FaHeadphones } from 'react-icons/fa'

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
  {
    id: 5,
    title: 'Business Insights',
    host: 'East Africa Market Trends',
    image: 'https://picsum.photos/seed/podcast5/600/600',
    slug: 'business-insights',
    duration: '38 min',
    listens: '9.3K',
    category: 'Business'
  },
  {
    id: 6,
    title: 'Health Matters',
    host: 'Dr. Wanjiku M.',
    image: 'https://picsum.photos/seed/podcast6/600/600',
    slug: 'health-matters',
    duration: '52 min',
    listens: '14.7K',
    category: 'Health'
  }
]

type Podcast = {
  id: number
  title: string
  host: string
  image: string
  slug: string
  duration: string
  listens: string
  category: string
}

type PodcastCardProps = {
  podcast: Podcast
  index: number
  isActive: boolean
}

const PodcastCard: React.FC<PodcastCardProps> = React.memo(({ podcast, index, isActive }) => (
  <motion.div
    className="flex-shrink-0 w-[300px]"
    style={{
      scale: isActive ? 1 : 0.9,
      opacity: isActive ? 1 : 0.7,
      zIndex: isActive ? 10 : 1
    }}
    whileHover={{ scale: 1.05 }}
  >
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700 hover:border-blue-500/30 transition-all duration-300 h-full flex flex-col">
      <div className="relative aspect-square">
        <Image
          src={podcast.image}
          alt={podcast.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
        <div className="absolute top-3 right-3 bg-gray-900/80 text-xs font-medium px-2 py-1 rounded-full">
          {podcast.category}
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-white line-clamp-2 mb-2">
          {podcast.title}
        </h3>
        <p className="text-blue-400 text-sm mb-4">Hosted by {podcast.host}</p>
        
        <div className="flex items-center gap-4 text-gray-400 text-xs mb-5 mt-auto">
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
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-sm font-medium rounded-lg text-white transition-all">
            <FaPlay size={12} /> Listen Now
          </button>
        </Link>
      </div>
    </div>
  </motion.div>
));

export default function TrendingPodcasts() {
  const [width, setWidth] = useState(0)
  const carousel = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const x = useMotionValue(0)
  const scale = useTransform(x, [-200, 0, 200], [0.8, 1, 0.8])
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5])

  useEffect(() => {
    if (carousel.current) {
      setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth)
    }
  }, [])

  useEffect(() => {
    const controls = animate(x, -activeIndex * 320, {
      type: 'spring',
      stiffness: 50,
      damping: 15
    })
    return controls.stop
  }, [activeIndex, x])

  const handlePrev = () => {
    setActiveIndex(prev => (prev === 0 ? podcasts.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setActiveIndex(prev => (prev === podcasts.length - 1 ? 0 : prev + 1))
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-950 to-gray-900 text-white relative overflow-hidden">
      {/* Floating sound waves */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute top-0 h-full w-1 bg-blue-500"
            style={{
              left: `${(i + 1) * 8}%`,
              height: `${20 + Math.random() * 80}%`,
              transform: 'translateY(-50%)'
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 text-xs font-semibold bg-blue-900/30 text-blue-400 rounded-full mb-4">
            TRENDING NOW
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
            Popular Podcasts
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover what's buzzing in our audio library. Fresh voices. Real conversations.
          </p>
        </div>

        {/* 3D Carousel */}
        <div className="relative">
          <motion.div
            ref={carousel}
            className="cursor-grab overflow-hidden"
            whileTap={{ cursor: 'grabbing' }}
          >
            <motion.div
              drag="x"
              dragConstraints={{ right: 0, left: -width }}
              className="flex gap-8"
              style={{ x }}
            >
              {podcasts.map((podcast, index) => (
                <PodcastCard
                  key={podcast.id}
                  podcast={podcast}
                  index={index}
                  isActive={index === activeIndex}
                />
              ))}
            </motion.div>
          </motion.div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 bg-gray-800/80 hover:bg-gray-700/80 p-3 rounded-full shadow-lg z-20"
          >
            <FiArrowRight className="rotate-180" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 bg-gray-800/80 hover:bg-gray-700/80 p-3 rounded-full shadow-lg z-20"
          >
            <FiArrowRight />
          </button>
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <Link href="/podcasts">
            <button className="inline-flex items-center px-6 py-3 border border-gray-700 hover:border-blue-500 text-sm font-medium rounded-full text-white bg-gray-800/50 hover:bg-gray-700/50 transition-all group">
              View All Podcasts
              <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}