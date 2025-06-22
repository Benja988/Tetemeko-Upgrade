'use client'
import { DIRECTIONS, FROM_DIR, GRID_SIZE } from '@/constants/heroMedia'
import { motion } from 'framer-motion'

export default function HeroGrid({ image }: { image: string }) {
  const cells = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => ({
    x: i % GRID_SIZE,
    y: Math.floor(i / GRID_SIZE),
  }))

  return (
    <>
      {cells.map(({ x, y }) => {
        const delay = (x + y) * 0.05
        const dir = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)]
        const style = {
          top: `${(100 / GRID_SIZE) * y}%`,
          left: `${(100 / GRID_SIZE) * x}%`,
          width: `${100 / GRID_SIZE}%`,
          height: `${100 / GRID_SIZE}%`,
          backgroundImage: `url(${image})`,
          backgroundPosition: `${(100 / (GRID_SIZE - 1)) * x}% ${(100 / (GRID_SIZE - 1)) * y}%`,
          backgroundSize: `${GRID_SIZE * 100}% ${GRID_SIZE * 100}%`,
        }
        return (
          <motion.div
            key={`${x}-${y}-${image}`}
            className="absolute"
            style={style}
            initial={{ opacity: 0, ...(FROM_DIR[dir]), scale: 1.05 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            transition={{ delay, type: 'spring', stiffness: 80, damping: 20 }}
            whileHover={{ scale: 1.05, filter: 'brightness(1.1) contrast(1.05)' }}
            whileTap={{ scale: 0.98 }}
          />
        )
      })}
    </>
  )
}
