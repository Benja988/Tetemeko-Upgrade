'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FiShoppingCart, FiStar, FiArrowRight } from 'react-icons/fi';
import { RiFlashlightFill } from 'react-icons/ri';

const products = [
  {
    id: 1,
    name: 'Tetemeko Cap',
    description: 'Premium quality snapback with embroidered logo',
    image: 'https://picsum.photos/seed/tetemeko-cap/800/1000',
    price: 'Ksh 1,200',
    originalPrice: 'Ksh 1,800',
    slug: 'tetemeko-cap',
    rating: 4.5,
    reviews: 28,
    tag: 'Bestseller',
    colors: ['#3b82f6', '#10b981', '#f59e0b']
  },
  {
    id: 2,
    name: 'Limited Edition Hoodie',
    description: 'Comfortable fleece-lined hoodie with exclusive print',
    image: 'https://picsum.photos/seed/limited-hoodie/800/1000',
    price: 'Ksh 3,500',
    originalPrice: 'Ksh 4,200',
    slug: 'hoodie-limited',
    rating: 4.8,
    reviews: 42,
    tag: 'New',
    colors: ['#ec4899', '#8b5cf6', '#000000']
  },
  {
    id: 3,
    name: 'Podcast Mic Kit',
    description: 'Professional USB microphone with accessories',
    image: 'https://picsum.photos/seed/podcast-mic/800/1000',
    price: 'Ksh 7,000',
    originalPrice: 'Ksh 8,500',
    slug: 'podcast-mic-kit',
    rating: 4.7,
    reviews: 35,
    tag: 'Bundle',
    colors: ['#64748b', '#1e293b', '#f1f5f9']
  },
  {
    id: 4,
    name: 'Studio Headphones',
    description: 'Noise-cancelling headphones for crystal clear audio',
    image: 'https://picsum.photos/seed/studio-headphones/800/1000',
    price: 'Ksh 4,900',
    originalPrice: 'Ksh 6,200',
    slug: 'studio-headphones',
    rating: 4.9,
    reviews: 56,
    tag: 'Premium',
    colors: ['#f43f5e', '#0ea5e9', '#eab308']
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.34, 1.56, 0.64, 1],
    },
  }),
  hover: {
    y: -10,
    transition: { 
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

export default function ShopFromUs() {
  return (
    <section className="relative w-full py-20 md:py-32 overflow-hidden bg-neutral-950 text-white">
      {/* Dynamic grid background */}
      <div className="absolute inset-0 -z-10 overflow-hidden opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)]"></div>
      </div>

      {/* Floating light effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

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

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              custom={index}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true, margin: "-100px" }}
              variants={cardVariants}
              className="group relative bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 hover:border-blue-500/50 transition-all duration-500"
            >
              {/* Floating tag */}
              {product.tag && (
                <div className="absolute top-4 left-4 z-10 px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
                  {product.tag}
                </div>
              )}

              {/* 3D Card Effect */}
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-neutral-950/80 z-10" />
                <div className="aspect-square w-full relative">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>
              </div>

              {/* Product Details */}
              <div className="p-5 relative z-10">
                {/* Color options */}
                <div className="flex gap-2 mb-3">
                  {product.colors.map((color, i) => (
                    <div 
                      key={i}
                      className="w-4 h-4 rounded-full border border-neutral-700"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors duration-300">
                  {product.name}
                </h3>
                
                <p className="text-neutral-400 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>

                {/* Rating and Price */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-1">
                    <div className="flex items-center gap-1 text-yellow-400">
                      <FiStar className="fill-current" />
                      <span className="text-sm font-medium">{product.rating}</span>
                    </div>
                    <span className="text-neutral-500 text-xs">({product.reviews})</span>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-lg font-bold text-white">{product.price}</span>
                    {product.originalPrice && (
                      <span className="block text-xs text-neutral-500 line-through">{product.originalPrice}</span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Link href={`/marketplace/products/${product.slug}`} className="flex-1">
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-sm font-medium rounded-lg text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 group-hover:-translate-y-0.5">
                      <FiShoppingCart size={16} /> Add to Cart
                    </button>
                  </Link>
                  
                  <Link 
                    href={`/marketplace/products/${product.slug}`} 
                    className="flex items-center justify-center p-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-400 hover:text-white transition-all duration-300 group-hover:-translate-y-0.5"
                  >
                    <FiArrowRight size={18} />
                  </Link>
                </div>
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 -z-10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10 rounded-2xl"></div>
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
  );
}