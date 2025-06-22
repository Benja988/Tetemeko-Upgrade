'use client'
import { HERO_MEDIA } from '@/constants/heroMedia'
import { useEffect, useState, useCallback } from 'react'
import HeroMedia from './Hero/HeroMedia'
import HeroNavbar from './Hero/HeroNavbar'
import HeroContent from './Hero/HeroContent'
import HeroControls from './Hero/HeroControls'

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const total = HERO_MEDIA.length

  const nextSlide = useCallback(() => {
    setCurrent(c => (c + 1) % total)
  }, [total])

  const prevSlide = useCallback(() => {
    setCurrent(c => (c - 1 + total) % total)
  }, [total])

  useEffect(() => {
    const id = setInterval(() => {
      if (!paused) nextSlide()
    }, 8000)
    return () => clearInterval(id)
  }, [paused, nextSlide])

  return (
    <section
      className="relative min-h-screen w-full bg-primary text-white overflow-hidden flex flex-col"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <HeroMedia media={HERO_MEDIA[current]} />

      <div className="absolute inset-0 bg-black bg-opacity-60 z-10" />

      <HeroNavbar />
      <HeroContent />
      <HeroControls onPrev={prevSlide} onNext={nextSlide} />
    </section>
  )
}
