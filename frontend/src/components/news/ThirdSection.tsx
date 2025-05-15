"use client";

import React from "react";
import Link from "next/link";
import { NewsItems } from "@/data/news";

const ThirdSection: React.FC = () => {
  // Fetching data for analysis and editor's picks
  const analysisStories = NewsItems.slice(8, 11); // 3 stories for Analysis
  const editorsPicks = NewsItems.slice(11, 17); // 6 stories for Editor's Picks

  return (
    <div className="flex flex-col md:flex-row gap-10 px-6 py-20 text-primaryText">
      {/* 📊 Analysis Section */}
      <div className="w-full md:w-1/2 space-y-8">
        <h2 className="text-3xl font-bold text-white font-serif underline decoration-4 decoration-secondary mb-4">
          Analysis
        </h2>

        {analysisStories.map((story, index) => (
          <Link href={`/news/${story.slug}`} key={index} className="block">
            <div className="group relative overflow-hidden rounded-lg shadow-lg hover:scale-[1.02] transition-transform duration-300">
              <img
                src={story.imageSrc}
                alt={story.title}
                className="w-full h-64 object-cover group-hover:opacity-80 transition-opacity duration-300"
              />
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black to-transparent">
                <h3 className="text-2xl font-bold text-white font-serif group-hover:text-secondary">
                  {story.title}
                </h3>
                <p className="text-white mt-2 line-clamp-3">{story.text}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ✨ Editor's Picks Section */}
      <div className="w-full md:w-1/2 space-y-8">
        <h2 className="text-3xl font-bold text-white font-serif underline decoration-4 decoration-secondary mb-4">
          Editor's Picks
        </h2>

        <div className="bg-secondary/10 rounded-lg p-4 divide-y divide-gray-700">
          {editorsPicks.map((story, index) => (
            <Link href={`/news/${story.slug}`} key={index} className="block">
              <div className="group flex items-center justify-between py-4 hover:bg-secondary/20 rounded transition duration-300">
                
                {/* 📌 Text Content */}
                <div className="flex-1 pr-4">
                  <div className="flex gap-2 mb-2">
                    {story.tag && (
                      <span
                        key={story._id}
                        className="bg-secondary text-primaryText text-xs px-2 py-1 rounded-full hover:bg-primary hover:text-white transition"
                      >
                        {story.tag}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white font-serif group-hover:text-secondary">
                    {story.title}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                    {story.text}
                  </p>
                </div>

                {/* 🖼️ Image Content */}
                <div className="w-28 h-20 overflow-hidden rounded-lg flex-shrink-0">
                  <img
                    src={story.imageSrc}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:opacity-80 transition-opacity duration-300"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThirdSection;
