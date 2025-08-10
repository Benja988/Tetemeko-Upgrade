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
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import CharacterCount from '@tiptap/extension-character-count';
import { useEffect, useRef, useState, useCallback } from 'react';
import EditorToolbar from './EditorToolbar';
import { getCategories } from '@/services/categories/categoryService';
import { Category } from '@/interfaces/Category';
import { createNews, updateNewsById } from '@/services/news/newsService';
import { toBase64 } from '@/utils/toBase64';
import { News } from '@/interfaces/News';
import { Loader2 } from 'lucide-react';

interface NewsArticleFormProps {
  onSuccess?: () => void;
  existingNews?: News;
}

export default function NewsArticleForm({ onSuccess, existingNews }: NewsArticleFormProps) {
  const [title, setTitle] = useState(existingNews?.title || '');
  const [summary, setSummary] = useState(existingNews?.summary || '');
  const [seoTitle, setSeoTitle] = useState(existingNews?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(existingNews?.seoDescription || '');
  const [tags, setTags] = useState(existingNews?.tags?.join(', ') || '');
  const [category, setCategory] = useState(
    typeof existingNews?.category === 'string' ? existingNews.category : existingNews?.category?._id || ''
  );
  const [isPublished, setIsPublished] = useState(existingNews?.isPublished || false);
  const [isFeatured, setIsFeatured] = useState(existingNews?.isFeatured || false);
  const [isBreaking, setIsBreaking] = useState(existingNews?.isBreaking || false);
  const [featuredImage, setFeaturedImage] = useState(existingNews?.featuredImage || '');
  const [thumbnail, setThumbnail] = useState(existingNews?.thumbnail || '');
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [content, setContent] = useState(existingNews?.content || '');
  const [showToolbar, setShowToolbar] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
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
      TextStyle,
      Color,
      Table.configure({
        resizable: true,
        allowTableNodeSelection: true,
      }),
      TableRow,
      TableHeader,
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 p-2',
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Youtube.configure({ width: 640, height: 480 }),
      CharacterCount.configure(),
    ],
    content: existingNews?.content || '',
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose-lg max-w-full min-h-[400px] bg-white p-6 rounded-lg text-gray-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500',
        spellCheck: 'true',
        role: 'textbox',
        'aria-multiline': 'true',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setContent(html);
      handleAutoSave();
    },
  });

  // Auto-save functionality
  const handleAutoSave = useCallback(() => {
    const now = new Date().toLocaleTimeString();
    setLastSaved(now);
    // Optionally, save to localStorage or make an API call to save draft
    localStorage.setItem('newsDraft', JSON.stringify({ title, content, summary, category }));
  }, [title, content, summary, category]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const newsCategories = await getCategories('news');
        setCategories(newsCategories);
      } catch (err) {
        setErrors((prev) => ({ ...prev, categories: 'Failed to load categories' }));
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    let lastScrollTop = 0;
    const onScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setShowToolbar(scrollTop < lastScrollTop || scrollTop < 100);
      lastScrollTop = Math.max(scrollTop, 0);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        handleSubmit();
      }
      if (e.key === 'Escape') {
        setCollapsed(!collapsed);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [collapsed, title, content]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!content.trim() || content.trim() === '<p></p>') newErrors.content = 'Content is required';
    if (!category) newErrors.category = 'Category is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
          editor?.chain().focus().setImage({ src: base64, alt: 'Uploaded image' }).run();
        } catch (err) {
          setErrors((prev) => ({ ...prev, image: 'Failed to upload image' }));
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
        setErrors((prev) => ({ ...prev, thumbnail: 'Failed to upload thumbnail' }));
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
        setErrors((prev) => ({ ...prev, featuredImage: 'Failed to upload featured image' }));
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setUploading(true);
    const payload = {
      title,
      summary,
      content,
      seoTitle,
      seoDescription,
      tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      category,
      isPublished,
      isFeatured,
      isBreaking,
      thumbnail,
      featuredImage,
    };

    try {
      const result = existingNews
        ? await updateNewsById(existingNews._id, payload)
        : await createNews(payload);
      if (result) {
        alert('News article saved successfully!');
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
        setContent('');
        editor?.commands.clearContent();
        localStorage.removeItem('newsDraft');
        onSuccess?.();
      }
    } catch (err) {
      setErrors((prev) => ({ ...prev, submit: 'Failed to save article' }));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 mx-auto space-y-6 bg-gray-50 rounded-xl shadow-lg max-w-5xl">
      <h1 className="text-3xl font-bold text-gray-800">Create News Article</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <input
            type="text"
            placeholder="Title *"
            className={`w-full p-3 rounded-lg border ${errors.title ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
        </div>

        <div className="space-y-1">
          <select
            className={`w-full p-3 rounded-lg border ${errors.category ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900`}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select a category *</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
        </div>

        <div className="space-y-1">
          <textarea
            placeholder="Short summary"
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            rows={3}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <input
            type="text"
            placeholder="Tags (comma-separated)"
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <input
            type="text"
            placeholder="SEO Title"
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <textarea
            placeholder="SEO Description"
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            rows={2}
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Thumbnail Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailUpload}
            className="w-full p-3 rounded-lg border border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {thumbnail && (
            <img src={thumbnail} alt="Thumbnail preview" className="mt-2 w-40 rounded-lg shadow-sm" />
          )}
          {errors.thumbnail && <p className="text-red-500 text-sm">{errors.thumbnail}</p>}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Featured Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFeaturedImageUpload}
            className="w-full p-3 rounded-lg border border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {featuredImage && (
            <img src={featuredImage} alt="Featured preview" className="mt-2 w-40 rounded-lg shadow-sm" />
          )}
          {errors.featuredImage && <p className="text-red-500 text-sm">{errors.featuredImage}</p>}
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-gray-700">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={() => setIsPublished(!isPublished)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          Publish Now
        </label>
        <label className="flex items-center gap-2 text-gray-700">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={() => setIsFeatured(!isFeatured)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          Featured
        </label>
        <label className="flex items-center gap-2 text-gray-700">
          <input
            type="checkbox"
            checked={isBreaking}
            onChange={() => setIsBreaking(!isBreaking)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          Breaking News
        </label>
      </div>

      <div className="relative border rounded-lg bg-white shadow-sm overflow-y-auto">
        {editor && (
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
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
                className="bg-white p-2 rounded-lg shadow-sm border hover:bg-gray-100 m-2 text-gray-700"
              >
                Expand Toolbar
              </button>
            )}
          </div>
        )}
        <div className="pt-[64px]">
          <EditorContent editor={editor} />
        </div>
        {errors.content && <p className="text-red-500 text-sm p-2">{errors.content}</p>}
      </div>

      <div className="flex justify-between items-center text-sm text-gray-600">
        <div>
          Character Count: {editor?.storage.characterCount.characters() || 0}
        </div>
        {lastSaved && (
          <div className="text-green-600">Last saved: {lastSaved}</div>
        )}
      </div>

      {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}

      <button
        onClick={handleSubmit}
        disabled={uploading}
        className="w-full sm:w-auto bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
      >
        {uploading ? (
          <>
            <Loader2 className="animate-spin mr-2" size={18} />
            Saving...
          </>
        ) : (
          'Publish Article (Ctrl+S)'
        )}
      </button>
    </div>
  );
}