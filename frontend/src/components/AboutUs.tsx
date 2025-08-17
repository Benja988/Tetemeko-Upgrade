'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { getStations } from '@/services/stations'
import { Station } from '@/interfaces/Station'
import { FiChevronRight, FiRadio, FiUsers, FiAward, FiPlay } from 'react-icons/fi'

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay },
  }),
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
}

// Timeline data
const timelineData = {
  '2020s': {
    title: 'Digital Expansion Era',
    events: [
      'Launched 3 new digital radio stations',
      'Expanded to 10 counties across Kenya',
      'Reached 1M+ monthly listeners',
      'Introduced mobile streaming app',
      'Partnered with 50+ local artists'
    ],
    image: '/googleDeepmind.jpg',
    video: '/about/2020s-video.mp4',
    stats: {
      listeners: '1.2M',
      coverage: '85%',
      partnerships: '50+'
    }
  },
  '2010s': {
    title: 'Growth Phase',
    events: [
      'Acquired 2 regional radio stations',
      'Launched first TV channel',
      'Established digital presence',
      'Won National Media Award',
      'Expanded to 5 counties'
    ],
    image: '/network090.jpg',
    video: '/about/2010s-video.mp4',
    stats: {
      listeners: '500K',
      coverage: '45%',
      partnerships: '20+'
    }
  },
  '2000s': {
    title: 'Foundation Years',
    events: [
      'Founded first radio station in Nairobi',
      'Built core team of 15 media professionals',
      'Established brand identity',
      'First live broadcast',
      'Pioneered local music showcase'
    ],
    image: '/network098.jpg',
    video: '/about/2000s-video.mp4',
    stats: {
      listeners: '50K',
      coverage: 'Nairobi',
      partnerships: '5+'
    }
  },
} as const

type Decade = keyof typeof timelineData
// type TimelineEntry = typeof timelineData[Decade]

export default function AboutUs() {
  const [stations, setStations] = useState<Station[]>([])
  const [activeDecade, setActiveDecade] = useState<Decade>('2020s')
  const [isPlayingVideo, setIsPlayingVideo] = useState(false)
  const [isHoveringStation, setIsHoveringStation] = useState<number | null>(null)

  // Auto-rotate decades
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDecade(prev => {
        const decades = Object.keys(timelineData) as Decade[]
        const currentIndex = decades.indexOf(prev)
        return decades[(currentIndex + 1) % decades.length]
      })
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  // Pre-generate particles for consistent animation
  const particles = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 100}%`,
        size: `${Math.random() * 4 + 1}px`,
        duration: 15 + Math.random() * 30,
        delay: Math.random() * 10,
      })),
    []
  )

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const data = await getStations({
          fields: ['_id', 'name', 'imageUrl', 'type', 'frequency'],
          limit: 0
        })
        setStations(data)
      } catch (err) {
        console.error('Failed to fetch stations', err)
      }
    }
    fetchStations()
  }, [])

  const currentEra = timelineData[activeDecade]

  return (
    <section
      id="about-us"
      className="relative bg-gradient-to-b from-primary to-primary-dark text-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-20 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: -100 }}
            animate={{
              opacity: [0, 0.15, 0],
              y: ['0%', '100vh'],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: 'linear'
            }}
            className="absolute rounded-full bg-white/30"
            style={{ 
              left: p.x,
              top: '-10%',
              width: p.size,
              height: p.size
            }}
          />
        ))}
      </div>

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/30 via-primary/80 to-primary" />

      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          className="text-center mb-16 md:mb-20"
        >
          <motion.h2
            variants={fadeUp}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight"
          >
            Our <span className="text-indigo-200">Journey</span> Through The Years
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={0.2}
            className="text-lg md:text-xl text-gray-300 font-light max-w-3xl mx-auto leading-relaxed"
          >
            From humble beginnings to becoming a media powerhouse, our story is one of
            innovation, passion, and commitment to our audience.
          </motion.p>
        </motion.div>

        {/* Timeline decade selector */}
        <div className="flex justify-center gap-2 md:gap-4 mb-12 md:mb-16 flex-wrap">
          {(Object.keys(timelineData) as Decade[]).map((decade, i) => (
            <motion.button
              key={decade}
              variants={fadeUp}
              custom={i * 0.2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              onClick={() => setActiveDecade(decade)}
              className={`px-4 md:px-6 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
                activeDecade === decade
                  ? 'bg-white text-primary shadow-lg'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {activeDecade === decade && (
                <motion.span 
                  layoutId="decadeIndicator"
                  className="w-2 h-2 rounded-full bg-indigo-500"
                />
              )}
              {decade}
            </motion.button>
          ))}
        </div>

        {/* Timeline content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center mb-20">
          {/* Media display */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-80 sm:h-96 md:h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl border-2 border-white/10 group"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDecade}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full h-full"
              >
                {isPlayingVideo ? (
                  <video
                    src={currentEra.video}
                    autoPlay
                    muted
                    loop
                    className="w-full h-full object-cover"
                    onClick={() => setIsPlayingVideo(false)}
                  />
                ) : (
                  <>
                    <Image
                      src={currentEra.image}
                      alt={`${activeDecade} era`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      priority
                    />
                    <button
                      onClick={() => setIsPlayingVideo(true)}
                      className="absolute inset-0 flex items-center justify-center group"
                    >
                      <div className="absolute inset-0 bg-black/30 transition-all group-hover:bg-black/20" />
                      <div className="relative z-10 w-16 h-16 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full border-2 border-white/30 group-hover:bg-white/30 group-hover:scale-110 transition-all">
                        <FiPlay className="text-white" size={24} />
                      </div>
                    </button>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 z-10">
              <motion.h3 
                className="text-2xl font-bold"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {currentEra.title}
              </motion.h3>
            </div>
          </motion.div>

          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="space-y-6"
          >
            <motion.div
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h3 className="text-3xl md:text-4xl font-bold text-indigo-200 mb-4">
                The {activeDecade}
              </h3>
              <h4 className="text-xl md:text-2xl font-semibold text-white mb-6">
                {currentEra.title}
              </h4>
            </motion.div>

            <ul className="space-y-4">
              {currentEra.events.map((event, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="flex-shrink-0 mt-1.5 w-3 h-3 rounded-full bg-indigo-400" />
                  <p className="text-gray-300">{event}</p>
                </motion.li>
              ))}
            </ul>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-4 mt-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              {[
                { 
                  label: 'Monthly Listeners', 
                  value: currentEra.stats.listeners, 
                  icon: <FiRadio className="text-yellow-400" size={20} />,
                  color: 'text-yellow-400'
                },
                { 
                  label: 'Coverage', 
                  value: currentEra.stats.coverage, 
                  icon: <FiUsers className="text-cyan-400" size={20} />,
                  color: 'text-cyan-400' 
                },
                { 
                  label: 'Partnerships', 
                  value: currentEra.stats.partnerships, 
                  icon: <FiAward className="text-green-400" size={20} />,
                  color: 'text-green-400' 
                },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="bg-white/5 px-4 py-4 rounded-xl backdrop-blur-sm border border-white/10 hover:border-indigo-400/30 transition-colors"
                >
                  <div className="flex justify-center mb-2">
                    {stat.icon}
                  </div>
                  <div className={`text-2xl md:text-3xl font-bold text-center ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-300 mt-1 text-center">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Stations section */}
        <div className="mt-16 md:mt-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            className="text-center mb-12"
          >
            <motion.h3 variants={fadeUp} className="text-2xl md:text-3xl font-bold mb-2">
              Our Media Network
            </motion.h3>
            <motion.p variants={fadeUp} custom={0.1} className="text-gray-300 max-w-2xl mx-auto">
              Connecting communities across Kenya through diverse programming and local content
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {stations.slice(0, 10).map((station, i) => (
              <motion.div
                key={station._id ?? station.name ?? i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -50px 0px" }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                whileHover={{ y: -8 }}
                onHoverStart={() => setIsHoveringStation(i)}
                onHoverEnd={() => setIsHoveringStation(null)}
                className="relative aspect-square rounded-xl overflow-hidden shadow-lg group cursor-pointer"
              >
                <Image
                  src={station.imageUrl || '/default-logo.jpg'}
                  alt={`${station.name || 'Station'} logo`}
                  fill
                  className={`object-cover transition-all duration-500 ${
                    isHoveringStation === i ? 'scale-110' : 'scale-100'
                  }`}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-end p-4 z-10">
                  <div className="w-full">
                    <h4 className="font-bold text-white truncate">{station.name || 'Unnamed'}</h4>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-gray-300">{station.type || 'Radio'}</p>
                      {station.frequency && (
                        <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">
                          {station.frequency}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className={`absolute inset-0 border-2 transition-all duration-300 ${
                  isHoveringStation === i ? 'border-indigo-400' : 'border-transparent'
                }`} />
              </motion.div>
            ))}
          </div>

          {stations.length > 10 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center mt-10"
            >
              <button className="px-6 py-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition flex items-center gap-2 mx-auto">
                View All {stations.length} Stations
                <FiChevronRight />
              </button>
            </motion.div>
          )}
        </div>

        {/* Milestones CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-24 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl p-8 md:p-12 border border-white/10 backdrop-blur-sm"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Become Part of Our Story</h3>
            <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto">
              Join us as we continue to innovate and connect communities across Kenya through media.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-white text-primary rounded-full font-medium hover:bg-gray-100 transition">
                Partner With Us
              </button>
              <button className="px-8 py-3 border border-white/30 text-white rounded-full font-medium hover:bg-white/10 transition">
                Career Opportunities
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}