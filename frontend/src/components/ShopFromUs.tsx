'use client'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { FiShoppingCart, FiStar, FiArrowRight } from 'react-icons/fi'
import { RiFlashlightFill } from 'react-icons/ri'

const products = [
  {
    id: 1,
    name: 'Tetemeko Cap',
    description: 'Premium quality snapback with embroidered logo. Adjustable strap for perfect fit.',
    image: 'https://picsum.photos/seed/tetemeko-cap/800/1000',
    price: 'Ksh 1,200',
    originalPrice: 'Ksh 1,800',
    slug: 'tetemeko-cap',
    rating: 4.5,
    reviews: 28,
    tag: 'Bestseller',
    colors: ['#3b82f6', '#10b981', '#f59e0b'],
    model: '/models/cap.glb'
  },
  {
    id: 2,
    name: 'Limited Edition Hoodie',
    description: 'Comfortable fleece-lined hoodie with exclusive print. Available in multiple colors.',
    image: 'https://picsum.photos/seed/limited-hoodie/800/1000',
    price: 'Ksh 3,500',
    originalPrice: 'Ksh 4,200',
    slug: 'hoodie-limited',
    rating: 4.8,
    reviews: 42,
    tag: 'New',
    colors: ['#ec4899', '#8b5cf6', '#000000'],
    model: '/models/hoodie.glb'
  },
  {
    id: 3,
    name: 'Podcast Mic Kit',
    description: 'Professional USB microphone with accessories. Perfect for content creators.',
    image: 'https://picsum.photos/seed/podcast-mic/800/1000',
    price: 'Ksh 7,000',
    originalPrice: 'Ksh 8,500',
    slug: 'podcast-mic-kit',
    rating: 4.7,
    reviews: 35,
    tag: 'Bundle',
    colors: ['#64748b', '#1e293b', '#f1f5f9'],
    model: '/models/mic.glb'
  },
  {
    id: 4,
    name: 'Studio Headphones',
    description: 'Noise-cancelling headphones for crystal clear audio. 40mm drivers for rich sound.',
    image: 'https://picsum.photos/seed/studio-headphones/800/1000',
    price: 'Ksh 4,900',
    originalPrice: 'Ksh 6,200',
    slug: 'studio-headphones',
    rating: 4.9,
    reviews: 56,
    tag: 'Premium',
    colors: ['#f43f5e', '#0ea5e9', '#eab308'],
    model: '/models/headphones.glb'
  }
]

export default function ShopFromUs() {
  const [activeProduct, setActiveProduct] = useState(0)
  const [rotation, setRotation] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const constraintsRef = useRef(null)
  const rotateY = useMotionValue(0)
  const opacity = useTransform(rotateY, [-180, 0, 180], [0, 1, 0])

  // Auto-rotate when not interacting
  useEffect(() => {
    if (isDragging) return
    
    const unsubscribe = rotateY.on("change", (value) => {
      setRotation(value)
    })

    const controls = animate(rotateY, 360, {
      duration: 20,
      repeat: Infinity,
      ease: "linear"
    })

    return () => {
      controls.stop()
      unsubscribe()
    }
  }, [isDragging, rotateY])

  return (
    <section className="relative w-full py-20 md:py-32 overflow-hidden bg-neutral-950 text-white">
      {/* Floating grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-wider text-blue-400 bg-blue-900/30 rounded-full mb-6 uppercase border border-blue-900/50"
          >
            <RiFlashlightFill className="text-blue-300" />
            HOT COLLECTION
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Tetemeko</span> Merch
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed"
          >
            Premium gear for creators and fans. Designed for <span className="text-blue-300">quality</span>, built for <span className="text-purple-300">expression</span>.
          </motion.p>
        </div>

        {/* 3D Product Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - 3D Viewer */}
          <motion.div 
            ref={constraintsRef}
            className="relative h-96 w-full rounded-3xl bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-white/10 overflow-hidden"
            onPointerDown={() => setIsDragging(true)}
            onPointerUp={() => setIsDragging(false)}
          >
            {/* 3D Model Container - Would integrate with Three.js in a real implementation */}
            <motion.div
              drag
              dragConstraints={constraintsRef}
              dragElastic={0.1}
              style={{ rotateY }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="relative w-full h-full">
                <Image
                  src={products[activeProduct].image}
                  alt={products[activeProduct].name}
                  fill
                  className="object-contain"
                />
                <motion.div 
                  style={{ opacity }}
                  className="absolute inset-0 bg-[url('/product-texture.png')] opacity-20 mix-blend-overlay"
                />
              </div>
            </motion.div>

            {/* Product Controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {products.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveProduct(i)}
                  className={`w-3 h-3 rounded-full transition-all ${i === activeProduct ? 'bg-white w-6' : 'bg-white/30'}`}
                />
              ))}
            </div>

            {/* Interactive Hint */}
            <motion.div
              animate={{ 
                x: [0, 10, 0],
                opacity: isDragging ? 0 : [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity 
              }}
              className="absolute bottom-6 right-6 bg-black/50 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1"
            >
              ← Drag to rotate →
            </motion.div>
          </motion.div>

          {/* Right - Product Info */}
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg mb-3">
                  {products[activeProduct].tag}
                </span>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {products[activeProduct].name}
                </h3>
                <div className="flex items-center gap-1 text-yellow-400 mb-4">
                  <FiStar className="fill-current" />
                  <span className="font-medium">{products[activeProduct].rating}</span>
                  <span className="text-neutral-500 text-sm ml-1">({products[activeProduct].reviews} reviews)</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-white">{products[activeProduct].price}</span>
                {products[activeProduct].originalPrice && (
                  <span className="block text-sm text-neutral-500 line-through">{products[activeProduct].originalPrice}</span>
                )}
              </div>
            </div>

            <p className="text-neutral-400">{products[activeProduct].description}</p>

            {/* Color Selector */}
            <div className="space-y-2">
              <span className="text-sm text-neutral-400">Color options:</span>
              <div className="flex gap-3">
                {products[activeProduct].colors.map((color, i) => (
                  <button
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-transparent hover:border-white transition-all"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Link href={`/marketplace/products/${products[activeProduct].slug}`} className="flex-1">
                <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-sm font-medium rounded-lg text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
                  <FiShoppingCart size={18} /> Add to Cart
                </button>
              </Link>
              
              <Link 
                href={`/marketplace/products/${products[activeProduct].slug}`} 
                className="flex items-center justify-center p-4 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-400 hover:text-white transition-all duration-300"
              >
                <FiArrowRight size={20} />
              </Link>
            </div>

            {/* Product Navigation */}
            <div className="flex justify-between pt-6 border-t border-neutral-800">
              <button 
                onClick={() => setActiveProduct((activeProduct - 1 + products.length) % products.length)}
                className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
              >
                <FiArrowRight className="rotate-180" /> Previous
              </button>
              <button 
                onClick={() => setActiveProduct((activeProduct + 1) % products.length)}
                className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
              >
                Next <FiArrowRight />
              </button>
            </div>
          </div>
        </div>

        {/* All Products Grid */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              onClick={() => setActiveProduct(index)}
              className={`bg-neutral-900 rounded-xl overflow-hidden border ${index === activeProduct ? 'border-blue-500' : 'border-neutral-800'} cursor-pointer transition-all hover:border-blue-400`}
            >
              <div className="relative aspect-square">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {index === activeProduct && (
                  <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                    <div className="bg-blue-600 text-white p-2 rounded-full">
                      <FiArrowRight size={16} />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h4 className="font-bold text-white line-clamp-1">{product.name}</h4>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-bold">{product.price}</span>
                  <div className="flex items-center gap-1 text-yellow-400 text-sm">
                    <FiStar className="fill-current" />
                    <span>{product.rating}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <Link href="/marketplace">
            <button className="inline-flex items-center px-8 py-4 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-blue-500/50 text-sm font-medium rounded-full text-white transition-all duration-500 hover:shadow-lg hover:shadow-blue-500/10 group">
              Explore Full Collection
              <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}