'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  FaBroadcastTower,
  FaShoppingCart,
  FaCalendarCheck,
  FaGlobeAfrica,
  FaBoxOpen,
} from 'react-icons/fa'
import { FaRadio } from 'react-icons/fa6'
import ReserveButton from '../ReserveButton'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

export default function HeroContent() {
  return (
    <motion.div
      className="relative z-20 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-24 h-full pt-32 sm:pt-24 pb-20"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background glow */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full z-0 bg-gradient-to-br from-primary/10 to-transparent blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
      />

      {/* Tagline */}
      <motion.p
        className="uppercase tracking-wider bg-white px-4 py-1 rounded-full text-sm sm:text-base text-primary font-semibold shadow-md mb-5 relative z-10"
        variants={itemVariants}
      >
        Kenya&apos;s Premier Multimedia Experience
      </motion.p>

      {/* Headline */}
      <motion.h1
        className="font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight tracking-tight mb-6 relative z-10"
        variants={itemVariants}
      >
        Tune In. Shop. Connect. <br />
        Only at{' '}
        <span className="text-white px-2 py-1 rounded-md shadow-sm">
          Tetemeko Media Group
        </span>
      </motion.h1>

      {/* Subtext */}
      <motion.p
        className="text-base sm:text-lg md:text-xl text-gray-200 mb-8 max-w-2xl leading-relaxed relative z-10"
        variants={itemVariants}
      >
        Stream electrifying radio, explore trending African stories, dive into bold podcasts, and shop
        unique products — all in one vibrant digital hub. Need media services? We’ve got you covered.
      </motion.p>

      {/* CTA Buttons (Listen + Shop) */}
      <motion.div
        className="flex flex-wrap gap-4 justify-center relative z-10"
        variants={itemVariants}
      >
        <Link href="/stations">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary flex items-center gap-2 px-5 py-3 rounded-md shadow-md transition duration-300"
          >
            <FaBroadcastTower /> Listen Live
          </motion.button>
        </Link>

        <Link href="/marketplace">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-secondary flex items-center gap-2 px-5 py-3 rounded-md shadow-md transition duration-300"
          >
            <FaShoppingCart /> Shop Now
          </motion.button>
        </Link>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="mt-10 text-gray-300 text-sm sm:text-base tracking-wide flex flex-wrap gap-4 justify-center relative z-10"
        variants={itemVariants}
        transition={{ delay: 1.2 }}
      >
        <div className="flex items-center gap-2">
          <FaRadio /> 3+ Radio Stations
        </div>
        <div className="flex items-center gap-2">
          <FaGlobeAfrica /> 10k+ Listeners
        </div>
        <div className="flex items-center gap-2">
          <FaBoxOpen /> 1,000+ Products
        </div>
      </motion.div>

      {/* Large Reserve Button */}
      <ReserveButton />
    </motion.div>
  )
}
