'use client'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { getStations } from '@/services/stations'
import { Station } from '@/interfaces/Station'

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut', delay }
  }),
}

// Timeline data with inferred types
const timelineData = {
  '2020s': {
    title: 'Digital Expansion Era',
    events: [
      'Launched 3 new digital radio stations',
      'Expanded to 10 counties across Kenya',
      'Reached 1M+ monthly listeners'
    ],
    image: '/about/2020s.jpg'
  },
  '2010s': {
    title: 'Growth Phase',
    events: [
      'Acquired 2 regional radio stations',
      'Launched first TV channel',
      'Established digital presence'
    ],
    image: '/about/2010s.jpg'
  },
  '2000s': {
    title: 'Foundation Years',
    events: [
      'Founded first radio station in Nairobi',
      'Built core team of 15 media professionals',
      'Established brand identity'
    ],
    image: '/about/2000s.jpg'
  }
} as const

// Types inferred from timelineData
type Decade = keyof typeof timelineData
type TimelineEntry = typeof timelineData[Decade]

export default function AboutUs() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [stations, setStations] = useState<Station[]>([])
  const [activeDecade, setActiveDecade] = useState<Decade>('2020s')

  useEffect(() => {
    const fetchStations = async () => {
      const data = await getStations()
      setStations(data)
    }
    fetchStations()
  }, [])

  return (
    <section
      id="about-us"
      ref={ref}
      className="relative bg-primary text-white py-24 px-4 sm:px-10 lg:px-24 overflow-hidden"
    >
      {/* Animated particles background */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: -100 }}
            animate={{
              opacity: [0, 0.3, 0],
              y: ['0%', '100vh'],
              x: `${Math.random() * 100}%`
            }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            className="absolute w-1 h-1 rounded-full bg-white"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-10%`
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={{
            visible: { transition: { staggerChildren: 0.15 } },
            hidden: {}
          }}
          className="text-center mb-16"
        >
          <motion.h2
            variants={fadeUp}
            className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6 tracking-tight"
          >
            Our <span className="text-indigo-200">Journey</span> Through The Years
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={0.2}
            className="text-lg text-gray-300 font-light leading-relaxed max-w-3xl mx-auto"
          >
            From humble beginnings to becoming a media powerhouse, our story is
            one of innovation, passion, and commitment to our audience.
          </motion.p>
        </motion.div>

        {/* Timeline Navigation */}
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
            hidden: {}
          }}
          className="flex justify-center gap-4 mb-12"
        >
          {Object.keys(timelineData).map((decade, i) => (
            <motion.button
              key={decade}
              variants={fadeUp}
              custom={i * 0.2}
              onClick={() => setActiveDecade(decade as Decade)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                activeDecade === decade
                  ? 'bg-white text-primary'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {decade}
            </motion.button>
          ))}
        </motion.div>

        {/* Timeline Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="relative h-96 w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 group"
          >
            <Image
              src={timelineData[activeDecade].image}
              alt={`Tetemeko Media in ${activeDecade}`}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 z-10">
              <h3 className="text-2xl font-bold">
                {timelineData[activeDecade].title}
              </h3>
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.3 }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-bold text-indigo-200">
              {timelineData[activeDecade].title}
            </h3>
            <ul className="space-y-4">
              {timelineData[activeDecade].events.map((event: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1 w-3 h-3 rounded-full bg-indigo-400" />
                  <p className="text-gray-300">{event}</p>
                </li>
              ))}
            </ul>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              {[
                { label: 'Stations', value: `${stations.length}+`, color: 'text-yellow-400' },
                { label: 'Employees', value: '150+', color: 'text-cyan-400' },
                { label: 'Awards', value: '24', color: 'text-green-400' }
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white/5 px-4 py-3 rounded-xl text-center backdrop-blur-md border border-white/10"
                >
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-sm text-gray-300 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stations Grid */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold mb-8 text-center">Our Network</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {stations.slice(0, 8).map((station, i) => (
              <motion.div
                key={station._id || station.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="relative aspect-square rounded-xl overflow-hidden shadow-lg group"
              >
                <Image
                  src={station.imageUrl || '/default-logo.jpg'}
                  alt={`${station.name} Logo`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-end p-4 z-10">
                  <div>
                    <h4 className="font-bold text-white">{station.name}</h4>
                    <p className="text-xs text-gray-300">{station.type}</p>
                  </div>
                </div>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-indigo-400 transition-all duration-300" />
              </motion.div>
            ))}
          </div>
          {stations.length > 8 && (
            <div className="text-center mt-8">
              <button className="px-6 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition">
                View All {stations.length} Stations
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
