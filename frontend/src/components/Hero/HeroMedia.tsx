'use client'
import { motion, AnimatePresence } from 'framer-motion'
import HeroGrid from './HeroGrid'

export default function HeroMedia({ media }: { media: { type: 'video' | 'image'; src: string } }) {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
      <AnimatePresence>
        {media.type === 'video' ? (
          <motion.video
            key={media.src}
            src={media.src}
            autoPlay
            muted
            loop
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          />
        ) : (
          <HeroGrid key={media.src} image={media.src} />
        )}
      </AnimatePresence>
    </div>
  )
}
