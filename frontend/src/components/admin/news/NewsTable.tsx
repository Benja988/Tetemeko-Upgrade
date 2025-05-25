'use client';

import { NewsArticle } from "@/interfaces/News";
import { useMemo } from "react";

interface NewsTableProps {
  articles: NewsArticle[];
  search: string;
  filter: string;
  onEdit: (article: NewsArticle) => void;
}

export default function NewsTable({
  articles,
  search,
  filter,
  onEdit,
}: NewsTableProps) {
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch = article.title.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter ? article.category === filter : true;
      return matchesSearch && matchesFilter;
    });
  }, [articles, search, filter]);

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-gray-100 text-gray-600 uppercase tracking-wider">
          <tr>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Tag</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <tr key={article._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{article.title}</td>
                <td className="px-4 py-3">{article.category}</td>
                <td className="px-4 py-3">{article.tag}</td>
                <td className="px-4 py-3">{new Date(article.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onEdit(article)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                No news articles found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
