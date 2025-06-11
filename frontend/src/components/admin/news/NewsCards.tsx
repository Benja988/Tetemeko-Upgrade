import React, { useMemo } from 'react';
import { NewsArticle } from '@/interfaces/News';

interface NewsCardsProps {
  articles: NewsArticle[];
  search: string;
  filter: string;
  onEdit: (article: NewsArticle) => void;
}

export default function NewsCards({ articles, search, filter, onEdit }: NewsCardsProps) {
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const searchLower = search.toLowerCase();

      const matchesSearch =
        article.title.toLowerCase().includes(searchLower) ||
        article.text.toLowerCase().includes(searchLower);

      const matchesFilter = filter
        ? article.category.toLowerCase() === filter.toLowerCase()
        : true;

      return matchesSearch && matchesFilter;
    });
  }, [articles, search, filter]);

  if (filteredArticles.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-8">
        No news articles found matching your criteria.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {filteredArticles.map((article) => (
        <article
          key={article._id}
          className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between"
        >
          {article.imageSrc && (
            <img
              src={article.imageSrc}
              alt={article.title}
              className="rounded-md mb-4 object-cover h-40 w-full"
            />
          )}

          <div className="flex-grow">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h2>
            <p className="text-gray-700 text-sm line-clamp-3">{article.text}</p>
          </div>

          <footer className="mt-4 flex items-center justify-between text-xs text-gray-500">
            <time dateTime={article.createdAt}>
              {new Date(article.createdAt).toLocaleDateString()}
            </time>

            <button
              onClick={() => onEdit(article)}
              className="text-blue-600 hover:text-blue-800 font-medium focus:outline-none"
              aria-label={`Edit article: ${article.title}`}
              type="button"
            >
              Edit
            </button>
          </footer>
        </article>
      ))}
    </div>
  );
}
