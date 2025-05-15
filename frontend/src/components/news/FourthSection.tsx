'use client';

import React from 'react';
import Link from 'next/link';
import { NewsItems } from '@/data/news';

const FourthSection: React.FC = () => {
  // Fetching data for "Opinions" and "Lifestyle"
  const opinionStories = NewsItems.slice(14, 17); // 3 stories for Opinions
  const lifestyleStories = NewsItems.slice(17, 20); // 3 stories for Lifestyle

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 px-4 py-16 text-primaryText">
      
      {/* 💬 Opinion Section */}
      <div>
        <h2 className="text-3xl font-bold text-white font-serif underline decoration-4 decoration-secondary mb-6">
          Opinions
        </h2>

        <div className="space-y-8">
          {/* Main Feature Card */}
          <Link href={`/news/${opinionStories[0].slug}`}>
            <div className="relative group rounded-lg shadow-lg overflow-hidden">
              <img
                src={opinionStories[0].imageSrc}
                alt={opinionStories[0].title}
                className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                <h3 className="text-2xl font-bold text-white font-serif">
                  {opinionStories[0].title}
                </h3>
                <p className="text-white mt-2 line-clamp-2">{opinionStories[0].text}</p>
              </div>
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-xl font-semibold">📖 Read More</p>
              </div>
            </div>
          </Link>

          {/* Supporting Articles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {opinionStories.slice(1).map((story, index) => (
              <Link href={`/news/${story.slug}`} key={index}>
                <div className="group relative overflow-hidden rounded-lg shadow-lg">
                  <img
                    src={story.imageSrc}
                    alt={story.title}
                    className="w-full h-44 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
                    <h3 className="text-lg font-bold text-white font-serif">
                      {story.title}
                    </h3>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-lg font-semibold">📖 Read More</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 🌟 Lifestyle Section */}
      <div>
        <h2 className="text-3xl font-bold text-white font-serif underline decoration-4 decoration-secondary mb-6">
          Lifestyle
        </h2>

        <div className="space-y-8">
          {/* Main Feature Card */}
          <Link href={`/news/${lifestyleStories[0].slug}`}>
            <div className="relative group rounded-lg shadow-lg overflow-hidden">
              <img
                src={lifestyleStories[0].imageSrc}
                alt={lifestyleStories[0].title}
                className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                <h3 className="text-2xl font-bold text-white font-serif">
                  {lifestyleStories[0].title}
                </h3>
                <p className="text-white mt-2 line-clamp-2">{lifestyleStories[0].text}</p>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-xl font-semibold">📖 Read More</p>
              </div>
            </div>
          </Link>

          {/* Supporting Articles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {lifestyleStories.slice(1).map((story, index) => (
              <Link href={`/news/${story.slug}`} key={index}>
                <div className="group relative overflow-hidden rounded-lg shadow-lg">
                  <img
                    src={story.imageSrc}
                    alt={story.title}
                    className="w-full h-44 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
                    <h3 className="text-lg font-bold text-white font-serif">
                      {story.title}
                    </h3>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-lg font-semibold">📖 Read More</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FourthSection;
