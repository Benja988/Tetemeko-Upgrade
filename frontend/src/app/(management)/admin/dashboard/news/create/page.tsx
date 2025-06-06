import NewsArticleForm from "@/components/admin/news/NewsArticleForm";

export default function CreateNewsPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create News Article</h1>
      <NewsArticleForm />
    </div>
  );
}
