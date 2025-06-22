'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import CodeBlock from '@tiptap/extension-code-block';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import Placeholder from '@tiptap/extension-placeholder';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TextAlign from '@tiptap/extension-text-align';
import CharacterCount from '@tiptap/extension-character-count';

import { useEffect, useRef, useState } from 'react';
import EditorToolbar from './EditorToolbar';
import { getCategories } from '@/services/categories/categoryService';
import { Category } from '@/interfaces/Category';
import { createNews, updateNewsById } from '@/services/news/newsService';
import { toBase64 } from '@/utils/toBase64';
import { News } from '@/interfaces/News';

interface NewsArticleFormProps {
  onSuccess?: () => void;
  existingNews?: News;
}
export default function NewsArticleForm({ onSuccess, existingNews }: NewsArticleFormProps) {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);
  const [featuredImage, setFeaturedImage] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [uploading, setUploading] = useState(false);

  const [content, setContent] = useState('');
  const [showToolbar, setShowToolbar] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false, strike: false }),
      Underline,
      Strike,
      CodeBlock,
      Placeholder.configure({
        placeholder: 'Start writing your article here...',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Image,
      Youtube.configure({ width: 640, height: 480 }),
      CharacterCount.configure(),
    ],
    content: '',
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg max-w-full min-h-[300px] bg-white p-5 rounded-md text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500',
        spellCheck: 'true',
        role: 'textbox',
        'aria-multiline': 'true',
      },
    },
    onUpdate: ({ editor }) => setContent(editor.getHTML()),
  });

  useEffect(() => {
    let lastScrollTop = 0;
    const onScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setShowToolbar(scrollTop < lastScrollTop);
      lastScrollTop = Math.max(scrollTop, 0);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      const newsCategories = await getCategories('news');
      setCategories(newsCategories);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
  if (existingNews) {
    setTitle(existingNews.title);
    setSummary(existingNews.summary || '');
    setSeoTitle(existingNews.seoTitle || '');
    setSeoDescription(existingNews.seoDescription || '');
    setTags(existingNews.tags?.join(', ') || '');
    setCategory(typeof existingNews.category === 'string' ? existingNews.category : existingNews.category?._id || '');
    setIsPublished(existingNews.isPublished);
    setIsFeatured(existingNews.isFeatured);
    setIsBreaking(existingNews.isBreaking);
    setThumbnail(existingNews.thumbnail || '');
    setFeaturedImage(existingNews.featuredImage || '');
    setContent(existingNews.content || '');
    editor?.commands.setContent(existingNews.content || '');
  }
}, [existingNews, editor]);


  const handleImageUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        setUploading(true);
        try {
          const base64 = await toBase64(file);
          editor?.chain().focus().setImage({ src: base64 }).run();
        } catch (err) {
          console.error(err);
        } finally {
          setUploading(false);
        }
      }
    };
    input.click();
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const base64 = await toBase64(file);
        setThumbnail(base64);
      } catch (err) {
        console.error(err);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const base64 = await toBase64(file);
        setFeaturedImage(base64);
      } catch (err) {
        console.error(err);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSubmit = async () => {
    if (!title || !content || content.trim() === '<p></p>') {
      // alert('Title and content are required');
      onSuccess?.();
      return;
    }

    setUploading(true);

    const payload = {
      title,
      summary,
      content,
      seoTitle,
      seoDescription,
      tags: tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      category,
      isPublished,
      isFeatured,
      isBreaking,
      thumbnail,
      featuredImage,
    };

    const result = existingNews
    ? await updateNewsById(existingNews._id, payload)
    : await createNews(payload);
    setUploading(false);

    if (result) {
      alert('News article created successfully!');
      // Reset form
      setTitle('');
      setSummary('');
      setSeoTitle('');
      setSeoDescription('');
      setTags('');
      setCategory('');
      setIsPublished(false);
      setIsFeatured(false);
      setIsBreaking(false);
      setThumbnail('');
      setFeaturedImage('');
      editor?.commands.clearContent();

      onSuccess?.();
    }
  };

  return (
    <div className="p-4 mx-auto space-y-6 bg-primary text-white rounded-md shadow-md max-w-4xl">
      <h1 className="text-3xl font-bold">Create News Article</h1>

      <input
        type="text"
        placeholder="Title *"
        className="w-full p-3 rounded text-black"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Short summary"
        className="w-full p-3 rounded text-black"
        rows={3}
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />

      <select
        className="w-full p-3 rounded text-black"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Select a category</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Tags (comma-separated)"
        className="w-full p-3 rounded text-black"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />

      <input
        type="text"
        placeholder="SEO Title"
        className="w-full p-3 rounded text-black"
        value={seoTitle}
        onChange={(e) => setSeoTitle(e.target.value)}
      />
      <textarea
        placeholder="SEO Description"
        className="w-full p-3 rounded text-black"
        rows={2}
        value={seoDescription}
        onChange={(e) => setSeoDescription(e.target.value)}
      />

      <div>
        <label className="block mb-1">Thumbnail Image</label>
        <input type="file" onChange={handleThumbnailUpload} />
        {thumbnail && <img src={thumbnail} alt="Thumbnail" className="mt-2 w-40 rounded" />}
      </div>

      <div>
        <label className="block mb-1">Featured Image</label>
        <input type="file" onChange={handleFeaturedImageUpload} />
        {featuredImage && <img src={featuredImage} alt="Featured" className="mt-2 w-40 rounded" />}
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={isPublished} onChange={() => setIsPublished(!isPublished)} />
          Publish Now
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={isFeatured} onChange={() => setIsFeatured(!isFeatured)} />
          Featured
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={isBreaking} onChange={() => setIsBreaking(!isBreaking)} />
          Breaking News
        </label>
      </div>

      <div className="relative border rounded-md bg-white text-gray-900 overflow-y-auto">
        {editor && (
          <div className="absolute top-0 left-0 w-full z-10 bg-white border-b border-gray-200">
            {showToolbar && !collapsed ? (
              <EditorToolbar
                editor={editor}
                handleImageUpload={handleImageUpload}
                uploading={uploading}
                onCollapse={() => setCollapsed(true)}
              />
            ) : (
              <button
                onClick={() => setCollapsed(false)}
                className="bg-white p-2 rounded shadow border hover:bg-gray-100 m-2"
              >
                Expand Toolbar
              </button>
            )}
          </div>
        )}

        <div className="pt-[64px]">
          <EditorContent editor={editor} />
        </div>
      </div>

      <div className="text-sm text-gray-300">
        Character Count: {editor?.storage.characterCount.characters() || 0}
      </div>

      <button
        onClick={handleSubmit}
        disabled={uploading}
        className="w-full sm:w-auto bg-white text-primary font-semibold px-6 py-3 rounded-md transition hover:bg-gray-200 disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Publish Article'}
      </button>
    </div>
  );
}
