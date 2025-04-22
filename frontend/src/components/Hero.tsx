'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Menu, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { HEROIMAGES } from '@/constants/heroImages'
import { navLinks } from '@/constants/navLinks'
import Image from 'next/image'

const GRID_SIZE = 5

export default function Hero() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [prevIndex, setPrevIndex] = useState<number | null>(null)
    const [mobileOpen, setMobileOpen] = useState(false)

    type Direction = 'top' | 'bottom' | 'left' | 'right'

    useEffect(() => {
        const interval = setInterval(() => {
            handleNext()
        }, 8000)
        return () => clearInterval(interval)
    }, [currentIndex])

    const handleNext = () => {
        setPrevIndex(currentIndex)
        setCurrentIndex((currentIndex + 1) % HEROIMAGES.length)
    }

    const handlePrev = () => {
        setPrevIndex(currentIndex)
        setCurrentIndex((currentIndex - 1 + HEROIMAGES.length) % HEROIMAGES.length)
    }

    const generateGrid = () => {
        const grid = []
        const directions: Direction[] = ['top', 'bottom', 'left', 'right']
        const fromDir = {
            top: { y: -50, x: 0 },
            bottom: { y: 50, x: 0 },
            left: { x: -50, y: 0 },
            right: { x: 50, y: 0 },
        }

        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                const delay = (x + y) * 0.05
                const dir: Direction = directions[Math.floor(Math.random() * directions.length)]

                const positionStyles = {
                    top: `${(100 / GRID_SIZE) * y}%`,
                    left: `${(100 / GRID_SIZE) * x}%`,
                    width: `${100 / GRID_SIZE}%`,
                    height: `${100 / GRID_SIZE}%`,
                    backgroundPosition: `${(100 / (GRID_SIZE - 1)) * x}% ${(100 / (GRID_SIZE - 1)) * y}%`,
                    backgroundSize: `${GRID_SIZE * 100}% ${GRID_SIZE * 100}%`,
                }

                if (prevIndex !== null) {
                    grid.push(
                        <motion.div
                            key={`prev-${x}-${y}-${prevIndex}`}
                            className="absolute"
                            style={{
                                ...positionStyles,
                                backgroundImage: `url(${HEROIMAGES[prevIndex]})`,
                                zIndex: 0,
                            }}
                            initial={{ opacity: 1, scale: 1 }}
                            animate={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay, duration: 0.4 }}
                        />
                    )
                }

                grid.push(
                    <motion.div
                        key={`curr-${x}-${y}-${currentIndex}`}
                        className="absolute group"
                        style={{
                            ...positionStyles,
                            backgroundImage: `url(${HEROIMAGES[currentIndex]})`,
                            zIndex: 1,
                            willChange: 'transform',
                        }}
                        initial={{
                            opacity: 0,
                            ...fromDir[dir],
                            scale: 1.05,
                        }}
                        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                        transition={{
                            delay,
                            type: 'spring',
                            stiffness: 80,
                            damping: 20,
                        }}
                        whileHover={{
                            scale: 1.05,
                            filter: 'brightness(1.1) contrast(1.05)',
                        }}
                        whileTap={{
                            scale: 0.98,
                        }}
                    />
                )
            }
        }

        return grid
    }

    return (
        <section className="relative min-h-screen w-full text-white overflow-hidden bg-black flex flex-col">
            <div className="absolute inset-0 z-0">{generateGrid()}</div>
            <div className="absolute inset-0 bg-black bg-opacity-60 z-10" />

            {/* Navbar */}
            <div className="absolute top-0 left-0 w-full z-50 px-4 sm:px-6 lg:px-24 py-4 flex items-center justify-between bg-transparent">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <Image
                        src="/logo.jpg"
                        alt="Tetemeko Logo"
                        width={36}
                        height={36}
                        className="rounded-none bg-inherit shadow-lg"
                        style={{ height: "auto" }} // preserves aspect ratio
                        priority
                    />

                    <span className="text-lg sm:text-xl md:text-2xl font-bold text-white">Tetemeko Media Group</span>
                </div>

                {/* Desktop nav */}
                <nav className="hidden md:flex gap-4 lg:gap-6 items-center">
                    {navLinks.map(link => (
                        <Link
                            key={link.name}
                            href={link.path}
                            className="text-sm font-medium text-gray-200 hover:text-white transition"
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Mobile menu toggle */}
                <div className="md:hidden relative z-50">
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="text-white border p-2 border-white rounded-md z-50 relative"
                    >
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    {mobileOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-95 z-40 flex flex-col items-center justify-center p-6 transition-all duration-300 ease-in-out">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.path}
                                    onClick={() => setMobileOpen(false)}
                                    className="text-white text-xl font-medium py-3 px-4 rounded hover:bg-white hover:text-black transition w-full text-center"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

            </div>


            {/* Hero Content */}
            <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-24 h-full w-full pt-32 sm:pt-24 pb-12 font-sans">
                {/* Tagline */}
                <motion.p
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="uppercase tracking-[0.25em] text-sm sm:text-base text-primary bg-white px-4 py-1 rounded-full mb-5 font-semibold shadow-md"
                >
                    Africa's Premier Multimedia Experience
                </motion.p>

                {/* Main Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight mb-6"
                >
                    Tune In. Shop. Connect. <br />
                    Only at{" "}
                    <span className="text-primary bg-white px-2 py-1 rounded-md shadow-sm">
                        Tetemeko Media Group
                    </span>
                </motion.h1>

                {/* Subheading */}
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-base sm:text-lg md:text-xl text-gray-200 mb-8 max-w-2xl leading-relaxed"
                >
                    Stream electrifying radio, explore trending African stories, dive into bold podcasts, and shop unique products — all in one vibrant digital hub. Need media services? We’ve got you covered.
                </motion.p>

                {/* Call to Action Buttons */}
                <motion.div
                    className="flex flex-wrap gap-4 justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                >
                    <Link
                        href="/stations"
                        className="bg-primary hover:bg-primary-dark text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl font-semibold shadow-lg text-base sm:text-lg transition-all duration-300"
                    >
                        🎧 Listen Live
                    </Link>
                    <Link
                        href="/marketplace"
                        className="bg-white hover:bg-gray-100 text-primary px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl font-semibold shadow-lg text-base sm:text-lg transition-all duration-300"
                    >
                        🛒 Shop Now
                    </Link>
                    <Link
                        href="/services"
                        className="bg-gray-800 hover:bg-gray-700 text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl font-semibold shadow-lg text-base sm:text-lg transition-all duration-300"
                    >
                        📅 Reserve Media Services
                    </Link>
                </motion.div>

                {/* Stats */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    className="mt-8 text-sm sm:text-base text-gray-300 tracking-wide"
                >
                    🎙️ 20+ Radio Stations | 🌍 5M+ Listeners | 🛍️ 1,000+ Products
                </motion.p>
            </div>


            {/* Controls */}
            <div className="absolute z-30 inset-y-0 left-0 flex items-center pl-2 sm:pl-4">
                <button onClick={handlePrev} className="p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-80 transition">
                    <ChevronLeft size={28} />
                </button>
            </div>
            <div className="absolute z-30 inset-y-0 right-0 flex items-center pr-2 sm:pr-4">
                <button onClick={handleNext} className="p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-80 transition">
                    <ChevronRight size={28} />
                </button>
            </div>
        </section>
    )
}
