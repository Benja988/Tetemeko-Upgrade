'use client';

import { FC, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { posts } from '@/constants/post';
import { Calendar, User, Tag } from 'lucide-react';

const NewsSection: FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...new Set(posts.map((post) => post.category))];

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const filteredPosts =
    selectedCategory === 'All'
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  const latestPosts = filteredPosts.slice(0, 3);
  const popularPosts = [...filteredPosts].sort(() => Math.random() - 0.5).slice(0, 3);

  const renderCard = (
    post: typeof posts[number],
    variant: 'basic' | 'detailed' = 'detailed'
  ) => (
    <div
      key={post.id}
      className={`bg-white rounded-xl shadow-md border border-gray-200 group overflow-hidden transform transition duration-300 hover:scale-[1.02] hover:shadow-xl ${
        variant === 'detailed' ? 'flex flex-col justify-between' : ''
      }`}
    >
      <Link href={`/news/${post.slug}`} className="block h-full">
        {variant === 'detailed' && (
          <div className="relative h-52 w-full">
            <Image
              src={post.imageUrl}
              alt={post.title}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-500 ease-in-out group-hover:scale-105"
            />
          </div>
        )}

        <div className="p-6 flex flex-col justify-between h-full space-y-3">
          <h3
            className={`${
              variant === 'detailed' ? 'text-xl' : 'text-lg'
            } font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors duration-300 line-clamp-2`}
          >
            {post.title}
          </h3>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <User size={14} />
              <span>{post.author.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
            </div>
          </div>

          {variant === 'detailed' && (
            <>
              <p className="text-gray-600 text-sm line-clamp-3">{post.excerpt}</p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs font-medium text-indigo-800 bg-indigo-100 px-2 py-1 rounded-full flex items-center gap-1"
                  >
                    <Tag size={12} />
                    {tag}
                  </span>
                ))}
              </div>
              <div className="text-sm font-medium text-indigo-600 hover:underline">Read more →</div>
            </>
          )}

          {variant === 'basic' && (
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{post.excerpt}</p>
          )}
        </div>
      </Link>
    </div>
  );

  return (
    <div className="space-y-20">
      {/* Category Filter */}
      <div className="flex justify-end mb-6">
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-indigo-400 transition"
        >
          {categories.map((category, index) => (
            <option key={index} value={category} className="text-gray-800">
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Latest News */}
      <section>
        <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
          🆕 Latest News
        </h3>
        {latestPosts.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {latestPosts.map((post) => renderCard(post))}
          </div>
        ) : (
          <p className="text-gray-500">No posts found for this category.</p>
        )}
      </section>

      {/* Popular Posts */}
      <section>
        <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
          🔥 Popular Posts
        </h3>
        {popularPosts.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {popularPosts.map((post) => renderCard(post, 'basic'))}
          </div>
        ) : (
          <p className="text-gray-500">No popular posts in this category.</p>
        )}
      </section>

      {/* All Articles */}
      <section>
        <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
          📚 All Articles
        </h3>
        {filteredPosts.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredPosts.map((post) => renderCard(post))}
          </div>
        ) : (
          <p className="text-gray-500">No articles found in this category.</p>
        )}
      </section>
    </div>
  );
};

export default NewsSection;
