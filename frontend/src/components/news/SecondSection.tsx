'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getRecentNews } from '@/services/news/newsService';
import { getCategories } from '@/services/categories/categoryService';
import { News } from '@/interfaces/News';
import { Category } from '@/interfaces/Category';
import { slugify } from '@/utils/slugify';

const SecondSection: React.FC = () => {
  const [trendingStories, setTrendingStories] = useState<News[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchTrendingAndCategories = async () => {
      const news = await getRecentNews(8);
      const categoryList = await getCategories('news');

      if (news) {
        const shuffled = news.sort(() => 0.5 - Math.random());
        setTrendingStories(shuffled.slice(0, 4));
      }

      if (categoryList) {
        setCategories(categoryList);
      }
    };

    fetchTrendingAndCategories();
  }, []);

  const getImage = (news: News) =>
    news.thumbnail || news.featuredImage || '/placeholder.jpg';

  const sponsoredContent = {
    title: 'Sponsored Content',
    text: 'Check out our latest promotions and deals from trusted brands.',
    link: '/sponsored',
    imageSrc: 'https://picsum.photos/600/400?random=5',
  };

  return (
    <div className="flex flex-col gap-16 px-4 py-16 text-primaryText">
      {/* 🚀 Trending Stories */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-white font-serif underline decoration-4 decoration-secondary">
          Trending Stories
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingStories.map((story) => (
            <Link
              key={story._id}
              href={`/news/article/${slugify(story.title)}-${story._id}`}
            >
              <div className="group flex flex-col h-full bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative w-full aspect-[4/3] overflow-hidden">
                  <img
                    src={getImage(story)}
                    alt={story.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:opacity-80 transition-opacity duration-300"
                  />
                </div>
                <div className="flex flex-col justify-between flex-1 p-4">
                  <h3 className="text-xl font-bold text-white font-serif line-clamp-2">
                    {story.title}
                  </h3>
                  <p className="text-white text-sm mt-2 line-clamp-3">
                    {story.summary || story.content?.slice(0, 100) + '...'}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 📚 Categories Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-white font-serif underline decoration-4 decoration-secondary">
          Categories
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/news/category/${category.slug}`}
            >
              <div className="group relative flex items-center justify-center h-32 sm:h-36 bg-secondary rounded-lg shadow-lg hover:bg-primary transition-all duration-300 overflow-hidden">
                <h3 className="z-10 text-xl font-semibold text-white font-serif group-hover:text-primaryText transition-colors">
                  {category.name}
                </h3>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent group-hover:opacity-70 transition-opacity duration-300" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 💼 Sponsored Section */}
      <section className="flex flex-col items-center justify-center w-full bg-gray-900 p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-white font-serif mb-3">
          {sponsoredContent.title}
        </h2>
        <p className="text-white mb-4 font-sans text-sm max-w-md">
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
          className="mt-6 w-full max-w-lg h-48 object-cover rounded-lg"
        />
      </section>
    </div>
  );
};

export default SecondSection;
