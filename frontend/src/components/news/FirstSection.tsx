'use client';

import React from 'react';
import Link from 'next/link';
import { NewsItems } from '@/data/news';
import MidCard from './MidCard';
import RelatedCard from './RelatedCard';

const FirstSection: React.FC = () => {
  // **Data Categorization**
  const breakingNews = NewsItems.slice(0, 1)[0]; // First item for Breaking News
  const moreStories = NewsItems.slice(1, 3);     // Next two for More Stories
  const featuredStories = NewsItems.slice(3, 5); // Next two for Featured Stories

  return (
    <div className="flex flex-col md:flex-row gap-6">

      {/* 📰 Breaking News Section (1/2 Width) */}
      <div className="w-full md:w-1/2 p-2 relative space-y-6">
        <h2 className="text-3xl font-bold text-white font-serif underline decoration-4 decoration-secondary mb-4">
          Breaking News
        </h2>

        <Link href={`/news/${breakingNews.slug}`}>
          <div className="relative mb-6 group">
            <div className="relative aspect-video overflow-hidden rounded-lg mb-3 shadow-lg">
              <img 
                src={breakingNews.imageSrc}
                alt={breakingNews.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
              />
            </div>
            <h3 className="text-2xl font-bold text-white font-serif group-hover:underline group-hover:decoration-secondary transition duration-300 ease-in-out">
              {breakingNews.title}
            </h3>
            <p className="text-gray-200 mt-3 font-sans leading-relaxed">
              {breakingNews.text}
            </p>
          </div>
        </Link>

        {/* 🔗 Related News Section */}
        <div className="mt-6">
          <h4 className="text-2xl font-bold mb-3 text-white font-serif underline decoration-4 decoration-secondary">
            Related News
          </h4>
          <div className="space-y-3">
            {breakingNews.relatedArticles.map((article, index) => (
              <React.Fragment key={index}>
                <RelatedCard 
                  link={`/news/${article.slug}`} 
                  text={article.text} 
                  imageSrc={article.imageSrc} 
                />
                {index < breakingNews.relatedArticles.length - 1 && (
                  <div className="border-t border-gray-700/50 my-2"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* 📌 More Stories Section (1/4 Width) */}
      <div className="w-full md:w-1/4 p-2 flex flex-col gap-4">
        <h2 className="text-2xl font-bold mb-4 text-white font-serif underline decoration-4 decoration-secondary">
          More Stories
        </h2>
        {moreStories.map((card, index) => (
          <React.Fragment key={index}>
            <MidCard 
              lnk={`/news/${card.slug}`}
              imageSrc={card.imageSrc}
              tag={card.tag}
              text={card.text}
            />
            {index < moreStories.length - 1 && (
              <div className="border-t border-gray-700/50 my-2"></div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* 🚀 Featured Stories Section (1/4 Width) */}
      <div className="w-full md:w-1/4 p-2 flex flex-col gap-4">
        
        {/* 🎥 Video Streaming */}
        <div className="relative aspect-video mb-4 rounded-lg overflow-hidden shadow-lg">
          <video 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 ease-in-out"
            autoPlay 
            muted 
            loop
          >
            <source src="/videos/video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <h2 className="text-2xl font-bold mb-4 text-white font-serif underline decoration-4 decoration-secondary">
          Featured Stories
        </h2>
        {featuredStories.map((card, index) => (
          <React.Fragment key={index}>
            <Link href={`/news/${card.slug}`}>
              <div className="flex gap-4 items-start hover:bg-opacity-90 transition duration-300 p-2 rounded-lg group">
                
                {/* 🖼️ Image */}
                <div className="w-1/3">
                  <img 
                    src={card.imageSrc} 
                    alt={card.title} 
                    className="w-full h-auto object-cover rounded-md group-hover:scale-105 transition-transform duration-300 ease-in-out"
                  />
                </div>

                {/* 📝 Title */}
                <div className="w-2/3">
                  <h3 className="text-lg font-semibold text-white font-serif group-hover:underline group-hover:decoration-secondary transition duration-300 ease-in-out">
                    {card.title}
                  </h3>
                  <p className="text-gray-300 mt-1 line-clamp-2 font-sans">
                    {card.text}
                  </p>
                </div>
              </div>
            </Link>
            {index < featuredStories.length - 1 && (
              <div className="border-t border-gray-700/50 my-2"></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default FirstSection;
