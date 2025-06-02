'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NewsArticle } from '@/interfaces/News';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import '@/app/tiptap.css';

const defaultArticle: NewsArticle = {
  _id: '',
  title: '',
  imageSrc: '',
  text: '',
  tag: '',
  slug: '',
  category: '',
  videoSrc: null,
  listItems: [],
  relatedArticles: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

interface NewsArticleFormProps {
  onSubmit?: (article: NewsArticle) => void;
  initialData?: NewsArticle;
  submitText?: string;
}

export default function NewsArticleForm({
  onSubmit,
  initialData,
  submitText = 'Publish',
}: NewsArticleFormProps) {
  const [article, setArticle] = useState<NewsArticle>(initialData ?? { ...defaultArticle });
  const [showMore, setShowMore] = useState(false);
  const router = useRouter();

  const editor = useEditor({
    extensions: [StarterKit, Underline, Link],
    content: article.text || '',
    onUpdate: ({ editor }) => setArticle(prev => ({ ...prev, text: editor.getHTML() })),
  });

  const handleChange = (field: keyof NewsArticle) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setArticle(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setArticle(prev => ({ ...prev, imageSrc: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit(article);
    else console.log('Submitting article:', article);
    router.push('/admin/news');
  };

  if (!editor) return null;

  // Helper to toggle marks or set nodes
  const toggleMark = (mark: string) => {
    editor.chain().focus().toggleMark(mark).run();
  };

 // No import of NodeType neededfunction toggleNode(type: string) {
//   function toggleNode(type: string, attrs?: Record<string, any>) {
//   if (!editor || !type) return;
//   if (attrs) {
//     editor.chain().focus().toggleNode(type, attrs).run();
//   } else {
//     editor.chain().focus().toggleNode(type).run();
//   }
// }





  // Link insertion with prompt
  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href || '';
    const url = window.prompt('Enter the URL', previousUrl);

    // If empty url remove link
    if (url === null) return; // cancel pressed
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6 p-4">
      {/* Title */}
      <input
        name="title"
        placeholder="Title"
        value={article.title}
        onChange={handleChange('title')}
        className="w-full border border-gray-300 rounded px-4 py-3 text-lg font-semibold"
        required
        autoFocus
      />

      {/* Image upload & preview */}
      <div className="space-y-2">
        <label className="block font-medium">Cover Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        {article.imageSrc && (
          <img
            src={article.imageSrc}
            alt="Preview"
            className="max-h-48 rounded shadow object-contain mt-2"
          />
        )}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-2">
        {/* Bold */}
        <button
          type="button"
          onClick={() => toggleMark('bold')}
          className={`px-3 py-1 rounded border ${editor.isActive('bold') ? 'bg-blue-600 text-white' : 'bg-white'
            }`}
          aria-label="Bold"
        >
          <b>B</b>
        </button>

        {/* Italic */}
        <button
          type="button"
          onClick={() => toggleMark('italic')}
          className={`px-3 py-1 rounded border ${editor.isActive('italic') ? 'bg-blue-600 text-white' : 'bg-white'
            }`}
          aria-label="Italic"
        >
          <em>I</em>
        </button>

        {/* Underline */}
        <button
          type="button"
          onClick={() => toggleMark('underline')}
          className={`px-3 py-1 rounded border ${editor.isActive('underline') ? 'bg-blue-600 text-white' : 'bg-white'
            }`}
          aria-label="Underline"
        >
          <u>U</u>
        </button>

        {/* Strike */}
        <button
          type="button"
          onClick={() => toggleMark('strike')}
          className={`px-3 py-1 rounded border ${editor.isActive('strike') ? 'bg-blue-600 text-white' : 'bg-white'
            }`}
          aria-label="Strike Through"
        >
          <s>S</s>
        </button>

        {/* Heading 1 */}
        {/* <button
          type="button"
          onClick={() => toggleNode('heading', { level: 1 })}
          className={`px-3 py-1 rounded border ${editor.isActive('heading', { level: 1 }) ? 'bg-blue-600 text-white' : 'bg-white'
            }`}
          aria-label="Heading 1"
        >
          H1
        </button>

        <button
          type="button"
          onClick={() => toggleNode('heading', { level: 2 })}
          className={`px-3 py-1 rounded border ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-600 text-white' : 'bg-white'
            }`}
          aria-label="Heading 2"
        >
          H2
        </button>


        {/* Bullet list 
        <button
          type="button"
          onClick={() => toggleNode('bulletList')}
          className={`px-3 py-1 rounded border ${editor.isActive('bulletList') ? 'bg-blue-600 text-white' : 'bg-white'
            }`}
          aria-label="Bullet List"
        >
          • List
        </button>

        {/* Ordered list 
        <button
          type="button"
          onClick={() => toggleNode('orderedList')}
          className={`px-3 py-1 rounded border ${editor.isActive('orderedList') ? 'bg-blue-600 text-white' : 'bg-white'
            }`}
          aria-label="Ordered List"
        >
          1. List
        </button> */}

        {/* Link */}
        <button
          type="button"
          onClick={setLink}
          className={`px-3 py-1 rounded border ${editor.isActive('link') ? 'bg-blue-600 text-white' : 'bg-white'
            }`}
          aria-label="Link"
        >
          🔗
        </button>

        {/* Clear formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          className="px-3 py-1 rounded border bg-red-100 hover:bg-red-200"
          aria-label="Clear formatting"
        >
          ✖
        </button>
      </div>

      {/* Rich Text Editor */}
      <div>
        <EditorContent
          editor={editor}
          className="border border-gray-300 rounded p-4 bg-white min-h-[250px]"
        />
      </div>

      {/* Toggle "More options" */}
      <button
        type="button"
        onClick={() => setShowMore(!showMore)}
        className="text-blue-600 hover:underline"
      >
        {showMore ? 'Hide' : 'Show'} more options
      </button>

      {showMore && (
        <div className="space-y-4 border border-gray-200 rounded p-4 bg-gray-50">
          <input
            name="tag"
            placeholder="Tag"
            value={article.tag}
            onChange={handleChange('tag')}
            className="w-full border border-gray-300 rounded px-4 py-2"
          />

          <input
            name="category"
            placeholder="Category"
            value={article.category}
            onChange={handleChange('category')}
            className="w-full border border-gray-300 rounded px-4 py-2"
          />

          <input
            name="videoSrc"
            placeholder="Video URL (YouTube, Vimeo, etc.)"
            value={article.videoSrc || ''}
            onChange={handleChange('videoSrc')}
            className="w-full border border-gray-300 rounded px-4 py-2"
          />

          {/* Video preview */}
          {article.videoSrc && (
            <div className="aspect-video mt-2 rounded overflow-hidden border">
              <iframe
                src={article.videoSrc}
                title="Video preview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          )}
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-gray-300 hover:bg-gray-400 px-5 py-2 rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
        >
          {submitText}
        </button>
      </div>
    </form>
  );
}
