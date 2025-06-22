import { getNewsByCategory } from '@/services/news/newsService';
import { getCategories } from '@/services/categories/categoryService';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { slugify } from '@/utils/slugify';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
  const { slug } = params;
  const categories = await getCategories('news');
  const category = categories.find((cat) => cat.slug === slug);

  return {
    title: category ? `${category.name} News` : 'Category Not Found',
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = params;

  const categories = await getCategories('news');
  const category = categories.find((cat) => cat.slug === slug);

  if (!category) return notFound();

  const categoryNews = await getNewsByCategory(slug);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-4xl font-bold text-white font-serif underline decoration-secondary decoration-4">
        {category.name} News
      </h1>

      {categoryNews?.news?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryNews.news.map((article) => (
            <Link href={`/news/${slugify(article.title)}`} key={article._id}>
              <div className="rounded-lg overflow-hidden shadow-lg group">
                <img
                  src={article.thumbnail || article.featuredImage}
                  alt={article.title}
                  className="w-full h-48 object-cover group-hover:opacity-80 transition"
                />
                <div className="bg-white p-4 text-black">
                  <h2 className="text-xl font-semibold group-hover:underline">
                    {article.title}
                  </h2>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {article.summary || article.content?.slice(0, 100)}...
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-white text-lg font-sans mt-8">
          No news articles found in this category.
        </p>
      )}
    </div>
  );
}
