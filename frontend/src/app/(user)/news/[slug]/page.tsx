// pages/news/[slug]/page.tsx
'use client';

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import NewsFooter from '@/components/news/NewsFooter';
import NewsPageBreadcrumbs from '@/components/news/NewsPageBreadcrumbs';
import { NewsItems } from '@/data/news';  // <-- Import the news data

import { NewsArticle } from '@/interfaces/News';

const isNewsArticle = (item: any): item is NewsArticle => {
  return (
    item &&
    typeof item.slug === 'string' &&
    typeof item.title === 'string' &&
    typeof item.category === 'string'
  );
};

const NewsPage = ({ params }: { params: { slug: string } }) => {
  const { slug } = params;

  // Find the news item by slug from imported NewsItems
  const newsItem = NewsItems.find((item) => item.slug === slug);
  const news: NewsArticle | undefined = isNewsArticle(newsItem) ? newsItem : undefined;

  if (!news) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        <p>News not found.</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{news.title} - RithmicTunes</title>
        <meta name="description" content={news.text.substring(0, 150)} />
        <meta property="og:title" content={news.title} />
        <meta property="og:description" content={news.text.substring(0, 150)} />
        <meta property="og:image" content={news.imageSrc} />
      </Head>

      <main className="p-8 bg-primary text-primaryText min-h-screen">
        <div className="max-w-4xl mx-auto">
          <NewsPageBreadcrumbs
            paths={[
              { label: 'Home', href: '/' },
              { label: 'News', href: '/news' },
              { label: news.category, href: `/news/category/${news.category}` },
              { label: news.title, href: '#' },
            ]}
          />

          <h1 className="text-4xl font-bold text-white mb-4">{news.title}</h1>
          <p className="text-sm text-gray-400 mb-8">
            Published on {new Date(news.createdAt).toLocaleDateString()}
          </p>

          <Image
            src={news.imageSrc}
            alt={news.title}
            width={600}
            height={400}
            className="rounded-lg mb-8"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/placeholder.png';
            }}
            priority
          />

          <p className="text-lg text-white leading-7 mb-6">{news.text}</p>

          {news.listItems?.length && (
            <ul className="list-disc list-inside mb-6 space-y-2">
              {news.listItems.map((item, idx) => (
                <li key={idx} className="text-white">{item}</li>
              ))}
            </ul>
          )}

          {news.relatedArticles?.length && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-white mb-4">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {news.relatedArticles.map((article, idx) => (
                  <Link
                    href={`/news/category/${news.category}/${article.slug}`}
                    key={idx}
                    className="group"
                  >
                    <div className="relative rounded-lg overflow-hidden shadow-md">
                      <img
                        src={article.imageSrc}
                        alt={article.text}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/placeholder.png';
                        }}
                      />
                      <div className="absolute bottom-0 bg-black/60 w-full p-4">
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-400">
                          {article.text}
                        </h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
        <NewsFooter />
      </main>
    </>
  );
};

export default NewsPage;
