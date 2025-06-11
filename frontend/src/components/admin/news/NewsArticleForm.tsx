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
import { uploadImageToServer } from '@/services/uploadService';

export default function NewsArticleForm() {
  const [content, setContent] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showToolbar, setShowToolbar] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        strike: false,
      }),
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
      Youtube.configure({
        width: 640,
        height: 480,
      }),
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
      handlePaste(view, event) {
        const items = Array.from(event.clipboardData?.items || []);
        const imageItem = items.find((item) => item.type.includes('image'));
        if (imageItem) {
          const file = imageItem.getAsFile();
          if (file) uploadImageToServer(file);
          return true;
        }
        return false;
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

  

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) uploadImageToServer(file);
    };
    input.click();
  };

  const handleSubmit = () => {
    if (!content || content.trim() === '<p></p>') {
      alert('Please write something before publishing.');
      return;
    }

    console.log('Submitted HTML:', content);

    // TODO: API call to submit article
  };

  return (
    <div className="p-4 mx-auto space-y-4 bg-primary rounded-md text-white shadow-lg">
      <h1 className="text-3xl font-extrabold tracking-tight">Create Article</h1>

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
                title="Expand Toolbar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
          </div>
        )}

        <div className="pt-[64px]">
          <EditorContent editor={editor} />
        </div>
      </div>

      <div className="text-sm text-gray-500">
        Character Count: {editor?.storage.characterCount.characters() || 0}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!content || uploading}
        className={`w-full sm:w-auto bg-white text-primary font-semibold px-6 py-3 rounded-md transition
          hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400 disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {uploading ? 'Uploading...' : 'Publish Article'}
      </button>
    </div>
  );
}
