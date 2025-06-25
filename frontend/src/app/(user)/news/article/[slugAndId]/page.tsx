import { getNewsById } from '@/services/news/newsService';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import NewsFooter from '@/components/news/NewsFooter';

interface Props {
  params: Promise<{
    slugAndId: string;
  }>;
}

// ✅ Fix for Next.js 15: Await `params` before using it
export async function generateMetadata({ params }: Props) {
  const { slugAndId } = await params;
  const id = slugAndId?.split('-').pop();

  if (!id) return { title: 'News Not Found' };

  const news = await getNewsById(id);

  if (!news) return { title: 'News Not Found' };

  return {
    title: news.title,
    description: news.summary || news.content?.slice(0, 150),
    openGraph: {
      title: news.title,
      description: news.summary || '',
      images: [news.thumbnail || news.featuredImage || '/placeholder.jpg'],
    },
  };
}

// ✅ Fix for Next.js 15: Await `params` here too
export default async function ArticlePage({ params }: Props) {
  const { slugAndId } = await params;
  const id = slugAndId?.split('-').pop();

  if (!id) return notFound();

  const news = await getNewsById(id);

  if (!news) return notFound();

  return (
    <>
      <Navbar />
      <main className="bg-primary text-primaryText py-12 px-6 sm:px-10 lg:px-20">
        <article className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold font-serif mb-4">{news.title}</h1>

          {news.createdAt && (
            <p className="text-sm text-gray-400 mb-6">
              {new Date(news.createdAt).toDateString()}
            </p>
          )}

          <img
            src={news.thumbnail || news.featuredImage || '/placeholder.jpg'}
            alt={news.title}
            className="w-full h-96 object-cover rounded-lg mb-8"
          />

          <div className="prose prose-invert max-w-none">
            {news.content ? (
              <div dangerouslySetInnerHTML={{ __html: news.content }} />
            ) : (
              <p>{news.summary}</p>
            )}
          </div>
        </article>
      </main>
      <NewsFooter />
    </>
  );
}
