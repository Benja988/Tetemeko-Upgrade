"use client";

import React from "react";
import Link from "next/link";
import { NewsItems } from "@/data/news";
import { categoriesRow1, categoriesRow2 } from "@/data/categories"; // Import categories

const SecondSection: React.FC = () => {
  // **Data Categorization**
  const trendingStories = NewsItems.slice(5, 8); // Next three for Trending Stories

  // Flatten categories into a single list
  const categories = [
    ...categoriesRow1.map((cat) => cat.title),
    ...categoriesRow2.map((cat) => cat.title),
  ];

  const sponsoredContent = {
    title: "Sponsored Content",
    text: "Check out our latest promotions and deals from trusted brands.",
    link: "/sponsored",
    imageSrc: "https://picsum.photos/600/400?random=5",
  };

  return (
    <div className="flex flex-col gap-8 px-4 py-16 text-primaryText">
      {/* 📰 Trending Stories Section */}
      <div className="w-full space-y-6">
        <h2 className="text-3xl font-bold text-white font-serif underline decoration-4 decoration-secondary">
          Trending Stories
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingStories.map((story, index) => (
            <Link href={`/news/${story.slug}`} key={index}>
              <div className="group relative overflow-hidden rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
                <img
                  src={story.imageSrc}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:opacity-80 transition-opacity duration-300"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-gradient-to-t from-black to-transparent p-4">
                  <h3 className="text-xl font-bold text-white font-serif">
                    {story.title}
                  </h3>
                  <p className="text-white mt-2 line-clamp-3">{story.text}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 📚 Categories Section */}
      <div className="w-full">
        <h2 className="text-3xl font-bold text-white font-serif underline decoration-4 decoration-secondary mb-6">
          Categories
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category, index) => (
            <Link
              href={`/category/${category.toLowerCase().replace(/ /g, "-")}`}
              key={index}
            >
              <div className="group relative overflow-hidden rounded-lg shadow-lg hover:scale-105 transition-all duration-300 bg-secondary text-center py-6 px-4 flex flex-col justify-center items-center hover:bg-primary">
                <h3 className="text-2xl font-semibold text-white font-serif group-hover:text-primaryText">
                  {category}
                </h3>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 💡 Sponsored Section */}
      <div className="w-full p-4 rounded-lg shadow-lg flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-white font-serif mb-3">
          {sponsoredContent.title}
        </h2>
        <p className="text-white mb-4 font-sans text-sm">
          {sponsoredContent.text}
        </p>
        <Link href={sponsoredContent.link}>
          <div className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primaryDark transition-colors duration-300">
            Learn More
          </div>
        </Link>
        <img
          src={sponsoredContent.imageSrc}
          alt="Sponsored Content"
          className="mt-4 w-full h-48 object-cover rounded-lg"
        />
      </div>
    </div>
  );
};

export default SecondSection;
