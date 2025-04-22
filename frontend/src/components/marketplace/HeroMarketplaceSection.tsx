'use client';

import Link from 'next/link';
import products from '@/constants/dummyProducts'; // Correct import

import Image from 'next/image';

const HeroMarketplaceSection = () => {
  return (
    <section className="relative w-full bg-gray-950 text-white">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-70"
        style={{
          backgroundImage: 'url(/bg/bg3.jpg)', // Custom background image
        }}
      ></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-24 sm:py-32 text-center">
        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6 text-shadow-lg">
          Unleash Your Potential with Tetemeko Marketplace
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl mb-8 text-shadow-lg max-w-3xl mx-auto">
          Dive into our exclusive collection of high-quality products—from professional audio gear to unique merchandise. Your premium shopping experience starts here.
        </p>

        {/* Featured Products (One Row) */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Featured Products</h2>
          <div className="flex space-x-6 justify-center overflow-x-auto">
            {products.slice(0, 4).map((product) => (
              <div key={product.id} className="relative group w-64">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover rounded-lg shadow-lg group-hover:scale-105 transition-all duration-300"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-all duration-300 rounded-lg"></div>
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-xl">${product.price}</p>
                  <p className="text-sm">{product.description}</p>
                  <Link href={`/marketplace/${product.slug}`}>
                    <button className="mt-4 bg-teal-600 text-white px-6 py-2 text-sm rounded-lg hover:bg-teal-700 transition duration-300">
                      View Product
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action Button */}
        <Link href="/marketplace" passHref>
          <button className="bg-teal-600 text-white px-10 py-4 text-lg rounded-xl shadow-xl hover:bg-teal-700 transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500">
            Start Shopping Now
          </button>
        </Link>
      </div>
    </section>
  );
};

export default HeroMarketplaceSection;
