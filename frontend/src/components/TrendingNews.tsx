'use client'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { FiCalendar, FiClock, FiArrowRight } from 'react-icons/fi'

const news = [
  {
    id: 1,
    title: 'East Africa Music Awards 2025: Full Highlights',
    excerpt: 'The most memorable moments from this year\'s biggest music event in the region with exclusive backstage interviews and performance breakdowns.',
    image: 'https://picsum.photos/seed/music-awards/800/600',
    slug: 'east-africa-music-awards',
    date: 'May 15, 2025',
    readTime: '4 min read',
    category: 'Entertainment',
    featured: true
  },
  {
    id: 2,
    title: '5G Expansion Plans in Kenya: What to Expect',
    excerpt: 'Detailed analysis of how the new infrastructure will transform digital connectivity nationwide with expert commentary.',
    image: 'https://picsum.photos/seed/5g-kenya/800/600',
    slug: '5g-expansion-kenya',
    date: 'May 12, 2025',
    readTime: '6 min read',
    category: 'Technology',
    featured: false
  },
  {
    id: 3,
    title: 'New Podcast Series: "Voices of the Market" Launching Soon',
    excerpt: 'Documenting the untold stories from East Africa\'s vibrant marketplaces with a focus on women entrepreneurs.',
    image: 'https://picsum.photos/seed/podcast-launch/800/600',
    slug: 'voices-of-the-market-launch',
    date: 'May 10, 2025',
    readTime: '3 min read',
    category: 'Media',
    featured: false
  },
  {
    id: 4,
    title: 'Meet the Winners of Our Youth Innovation Grant',
    excerpt: 'Profiles of the 10 young entrepreneurs awarded funding for their groundbreaking ideas across various sectors.',
    image: 'https://picsum.photos/seed/innovation-grant/800/600',
    slug: 'youth-innovation-winners',
    date: 'May 8, 2025',
    readTime: '5 min read',
    category: 'Business',
    featured: false
  },
  {
    id: 5,
    title: 'Sustainable Farming Initiatives Taking Root in Western Kenya',
    excerpt: 'How local communities are adopting climate-smart agriculture techniques with impressive results.',
    image: 'https://picsum.photos/seed/farming-kenya/800/600',
    slug: 'sustainable-farming-kenya',
    date: 'May 5, 2025',
    readTime: '7 min read',
    category: 'Environment',
    featured: true
  }
]

export default function TrendingNews() {
  const [activeCategory, setActiveCategory] = useState('All')
  const categories = ['All', ...new Set(news.map(item => item.category))]
  const filteredNews = activeCategory === 'All' 
    ? news 
    : news.filter(item => item.category === activeCategory)

  return (
    <section className="relative w-full py-20 bg-[#0A0F16] text-white overflow-hidden">
      {/* Newspaper texture background */}
      <div className="absolute inset-0 bg-[url('/newspaper-texture.png')] opacity-10 mix-blend-overlay" />
      
      {/* Animated ink splatters */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 0.03, scale: 1 }}
            transition={{ duration: 1, delay: i * 0.3 }}
            className="absolute bg-blue-800 rounded-full filter blur-xl"
            style={{
              width: `${200 + Math.random() * 300}px`,
              height: `${200 + Math.random() * 300}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider text-blue-400 bg-blue-900/30 rounded-full mb-4 uppercase border border-blue-900/50">
            Breaking Stories
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
            Trending News
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Stay updated with the latest happenings across East Africa
          </p>
        </div>

        {/* Newspaper Fold Effect */}
        <div className="relative bg-[#121923] border border-gray-800 rounded-lg overflow-hidden shadow-2xl">
          {/* Newspaper Header */}
          <div className="border-b border-gray-800 p-4 bg-[#0D121C] flex justify-between items-center">
            <div className="text-sm text-gray-400">DAILY EDITION • {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div className="text-xs bg-red-600 text-white px-2 py-1 rounded">LIVE UPDATES</div>
          </div>

          {/* Category Tabs */}
          <div className="flex overflow-x-auto hide-scrollbar border-b border-gray-800">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeCategory === category ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-white'}`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Newspaper Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            {/* Featured Left Column */}
            <div className="lg:col-span-2 border-r border-gray-800">
              {filteredNews.filter(item => item.featured).map(item => (
                <div key={item.id} className="border-b border-gray-800">
                  <div className="p-6">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-900/30 text-blue-400 rounded mb-4">
                      {item.category}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                      {item.title}
                    </h3>
                    <div className="relative h-64 md:h-96 w-full mb-6 rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                    <p className="text-gray-300 mb-6 text-lg">{item.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-gray-400 text-sm">
                        <div className="flex items-center gap-1">
                          <FiCalendar size={14} />
                          <span>{item.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiClock size={14} />
                          <span>{item.readTime}</span>
                        </div>
                      </div>
                      <Link href={`/news/${item.slug}`} className="inline-flex items-center gap-1 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
                        Read full story <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column - News List */}
            <div className="lg:col-span-1">
              <div className="p-4 border-b border-gray-800 bg-[#0D121C]">
                <h4 className="font-bold text-white">Latest Updates</h4>
              </div>
              {filteredNews.filter(item => !item.featured).map((item, index) => (
                <div 
                  key={item.id} 
                  className={`border-b border-gray-800 ${index % 2 === 0 ? 'bg-[#121923]' : 'bg-[#0D121C]'}`}
                >
                  <Link href={`/news/${item.slug}`} className="group block p-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 relative w-20 h-20 rounded-md overflow-hidden border border-gray-800">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform"
                        />
                      </div>
                      <div>
                        <span className="inline-block px-2 py-0.5 text-xs font-medium bg-gray-800 text-gray-300 rounded mb-2">
                          {item.category}
                        </span>
                        <h4 className="text-sm font-bold text-white mb-1 line-clamp-2 group-hover:text-blue-400 transition-colors">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 text-gray-400 text-xs">
                          <span>{item.date}</span>
                          <span>•</span>
                          <span>{item.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Newspaper Footer */}
          <div className="p-4 bg-[#0D121C] text-center text-xs text-gray-500 border-t border-gray-800">
            Continue reading on page 2 →
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <Link href="/news">
            <button className="inline-flex items-center px-6 py-3 border border-gray-700 hover:border-blue-500 text-sm font-medium rounded-full text-white bg-gray-800/50 hover:bg-gray-700/50 transition-all group">
              View All News Articles
              <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}