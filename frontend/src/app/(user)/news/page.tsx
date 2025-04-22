'use client';

import { FC, useState } from 'react';
import HeroSection from '@/components/news/HeroSection';
import SearchBar from '@/components/news/SearchBar';
import TagsFilter from '@/components/news/TagsFilter';
import NewsletterSignup from '@/components/news/NewsletterSignup';
import CategoriesSidebar from '@/components/news/CategoriesSidebar';
import Breadcrumbs from '@/components/news/Breadcrumbs';
import StickyShareButtons from '@/components/news/StickyShareButtons';
import NewsSection from '@/components/news/NewsSection'; // Merged news grid

const NewsAndBlogsPage: FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // You can later filter NewsSection using this query
    console.log('Searching for:', query);
  };

  return (
    <main className="relative py-16 bg-gray-100 px-4 sm:px-8 lg:px-16">
      <StickyShareButtons />

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Breadcrumbs */}
        <Breadcrumbs />

        {/* Hero Section */}
        <HeroSection />

        {/* Search + Tags + Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-12">
            <SearchBar onSearch={handleSearch} />
            <TagsFilter />

            {/* Unified News Section */}
            <NewsSection />
          </div>

          {/* Sidebar for large screens */}
          <aside className="space-y-6 hidden lg:block">
            <CategoriesSidebar />
            <NewsletterSignup />
          </aside>
        </div>

        {/* Newsletter for mobile */}
        <div className="lg:hidden">
          <NewsletterSignup />
        </div>
      </div>
    </main>
  );
};

export default NewsAndBlogsPage;
