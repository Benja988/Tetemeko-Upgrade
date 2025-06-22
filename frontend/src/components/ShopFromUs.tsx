'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const products = [
  {
    id: 1,
    name: 'Tetemeko Cap',
    image: '/shop/cap.jpg',
    price: 'Ksh 1,200',
    slug: 'tetemeko-cap',
  },
  {
    id: 2,
    name: 'Limited Edition Hoodie',
    image: '/shop/hoodie.jpg',
    price: 'Ksh 3,500',
    slug: 'hoodie-limited',
  },
  {
    id: 3,
    name: 'Podcast Mic Kit',
    image: '/shop/mic.jpg',
    price: 'Ksh 7,000',
    slug: 'podcast-mic-kit',
  },
  {
    id: 4,
    name: 'Studio Headphones',
    image: '/shop/headphones.jpg',
    price: 'Ksh 4,900',
    slug: 'studio-headphones',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: 'easeOut',
    },
  }),
};

export default function ShopFromUs() {
  return (
    <section className="relative w-full py-24 bg-gradient-to-br from-[#07131F] via-[#0b1c2b] to-[#0e2338] text-white overflow-hidden">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8 lg:px-16">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Shop From Us</h2>
          <div className="w-20 h-1 mx-auto mt-2 bg-blue-500 rounded-full" />
          <p className="text-blue-200 mt-3 max-w-lg mx-auto text-sm sm:text-base">
            Discover premium merchandise, podcast gear, and exclusive Tetemeko products.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              className="bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition hover:-translate-y-1 duration-300 group"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
              </div>

              <div className="p-4">
                <h3 className="text-base font-semibold mb-2 group-hover:text-blue-400 transition">
                  {product.name}
                </h3>
                <p className="text-blue-300 text-sm mb-4">{product.price}</p>
                <Link href={`/marketplace/products/${product.slug}`}>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-sm rounded-md font-medium transition w-full">
                    View Product
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link href="/marketplace">
            <button className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 transition text-white font-semibold shadow-lg">
              Visit Full Marketplace →
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
