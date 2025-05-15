'use client';

import React from 'react';
import Link from 'next/link';
import { NewsItems } from '@/data/news';

const FifthSection: React.FC = () => {
  // Fetching data for "Technology" and "Business"
  const technologyStories = NewsItems.slice(20, 24); // 4 stories for Technology
  const businessStories = NewsItems.slice(24, 28);   // 4 stories for Business

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 px-4 py-16 bg-primary text-primaryText">
      
      {/* 🔌 Technology Section */}
      <div>
        <h2 className="text-3xl font-bold text-white font-serif underline decoration-4 decoration-secondary mb-6">
          Technology
        </h2>

        <div className="space-y-6">
          {technologyStories.map((story, index) => (
            <Link href={`/news/${story.slug}`} key={index}>
              <div className="group relative flex items-start overflow-hidden rounded-lg shadow-lg bg-secondary p-4">
                
                {/* Thumbnail Image */}
                <img
                  src={story.imageSrc}
                  alt={story.title}
                  className="w-20 h-20 object-cover rounded-md mr-4"
                />

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white font-serif group-hover:text-blue-600 underline decoration-transparent group-hover:decoration-primary decoration-2">
                    {story.title}
                  </h3>
                  <p className="text-white mt-2 line-clamp-3">
                    {story.text}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 💼 Business Section */}
      <div>
        <h2 className="text-3xl font-bold text-white font-serif underline decoration-4 decoration-secondary mb-6">
          Business
        </h2>

        <div className="space-y-6">
          {businessStories.map((story, index) => (
            <Link href={`/news/${story.slug}`} key={index}>
              <div className="group relative flex items-start overflow-hidden rounded-lg shadow-lg bg-secondary p-4">
                
                {/* Thumbnail Image */}
                <img
                  src={story.imageSrc}
                  alt={story.title}
                  className="w-20 h-20 object-cover rounded-md mr-4"
                />

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white font-serif group-hover:text-blue-600 underline decoration-transparent group-hover:decoration-primary decoration-2">
                    {story.title}
                  </h3>
                  <p className="text-white mt-2 line-clamp-3">
                    {story.text}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FifthSection;
