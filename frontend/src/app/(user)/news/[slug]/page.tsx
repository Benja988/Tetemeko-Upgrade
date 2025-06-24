import { getNewsById } from '@/services/news/newsService';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props) {
  const { slug } = params;
  return {
    title: slug.split('-').join(' '),
    description: `Read full story: ${slug}`,
  };
}

export default async function NewsSlugPage({ params }: Props) {
  const { slug } = params;
  const article = await getNewsById(slug);

  if (!article) return notFound();

  return (
    <div className="px-8 py-16">
      <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
      {/* <p className="text-gray-600 mb-2">By {article.author?.name}</p> */}
      <img src={article.thumbnail || '/placeholder.jpg'} alt={article.title} className="w-full h-auto rounded-md mb-6" />
      <div className="prose prose-lg text-white" dangerouslySetInnerHTML={{ __html: article.content }} />
    </div>
  );
}
