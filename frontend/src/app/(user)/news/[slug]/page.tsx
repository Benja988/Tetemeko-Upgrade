import { posts } from '@/constants/post';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    slug: string;
  };
}

const NewsDetailPage = ({ params }: PageProps) => {
  const post = posts.find((p) => p.slug === params.slug);

  if (!post) return notFound();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-600 text-sm mb-6">
        By {post.author.name} • {new Date(post.publishedAt).toLocaleDateString()}
      </p>
      <img
        src={post.imageUrl}
        alt={post.title}
        className="rounded-lg w-full h-80 object-cover mb-8"
      />
      <article className="prose max-w-none">
        {post.content.split('\n').map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </article>
    </div>
  );
};

export default NewsDetailPage;
