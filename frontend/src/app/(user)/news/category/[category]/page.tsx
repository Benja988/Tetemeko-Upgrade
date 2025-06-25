// @/app/(user)/news/category/[category]/page.tsx

import { getNewsByCategory } from '@/services/news/newsService';
import { slugify } from '@/utils/slugify';
import { News } from '@/interfaces/News';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import NewsFooter from '@/components/news/NewsFooter';

interface Props {
  params: {
    category: string;
  };
}

export async function generateMetadata(
  props: { params: Promise<{ category: string }> }
) {
  const { category } = await props.params;

  return {
    title: `News - ${category}`,
    description: `Browse the latest news under ${category} category`,
  };
}


export default async function CategoryPage({ params }: Props) {
  const { category } = await params;

  const result = await getNewsByCategory(category);
  const newsList: News[] = result?.news ?? [];

  if (!result || newsList.length === 0) return notFound();
  return (
    <>
      <Navbar />
      <main className="bg-primary text-primaryText py-12 px-6 sm:px-10 lg:px-20">
        <h1 className="text-4xl font-bold mb-8 font-serif underline decoration-secondary decoration-4">
          {category} News
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsList.map((news) => (
            <Link href={`/news/article/${slugify(news.title)}-${news._id}`} key={news._id}>
              <div className="bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
                <img
                  src={news.thumbnail || news.featuredImage || '/placeholder.jpg'}
                  alt={news.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-white font-serif line-clamp-2">
                    {news.title}
                  </h2>
                  <p className="text-sm text-gray-300 mt-2 line-clamp-3">
                    {news.summary || news.content?.slice(0, 100) + '...'}
                  </p>
                </div>
              </div>
            </Link>
          ))}

        </div>
      </main>
      <NewsFooter />
    </>
  );
}
