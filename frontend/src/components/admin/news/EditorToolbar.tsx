'use client';

import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Code,
  Image as ImageIcon,
  Table as TableIcon,
  Undo,
  Redo
} from 'lucide-react';

type Props = {
  editor: Editor;
  handleImageUpload: () => void;
  uploading: boolean;
  onCollapse?: () => void;
};

const baseBtn =
  'p-2 rounded hover:bg-gray-200 transition text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500';

const getActiveStyle = (active: boolean) =>
  active ? 'bg-blue-100 text-blue-700 font-semibold' : '';

export default function EditorToolbar({ editor, handleImageUpload, uploading, onCollapse }: Props) {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-1 items-center p-2 bg-white border-b border-gray-300 sticky top-0 z-20">
      {onCollapse && (
        <button
          onClick={onCollapse}
          className="ml-auto p-2 rounded hover:bg-gray-200 transition text-gray-500"
          aria-label="Collapse toolbar"
        >
          ✕
        </button>
      )}

      {/* Text Formatting */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`${baseBtn} ${getActiveStyle(editor.isActive('bold'))}`}
        aria-label="Bold"
      >
        <Bold size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`${baseBtn} ${getActiveStyle(editor.isActive('italic'))}`}
        aria-label="Italic"
      >
        <Italic size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`${baseBtn} ${getActiveStyle(editor.isActive('underline'))}`}
        aria-label="Underline"
      >
        <Underline size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`${baseBtn} ${getActiveStyle(editor.isActive('strike'))}`}
        aria-label="Strikethrough"
      >
        <Strikethrough size={18} />
      </button>

      {/* Headings */}
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`${baseBtn} ${getActiveStyle(editor.isActive('heading', { level: 1 }))}`}
        aria-label="Heading 1"
      >
        <Heading1 size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`${baseBtn} ${getActiveStyle(editor.isActive('heading', { level: 2 }))}`}
        aria-label="Heading 2"
      >
        <Heading2 size={18} />
      </button>

      {/* Lists */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`${baseBtn} ${getActiveStyle(editor.isActive('bulletList'))}`}
        aria-label="Bullet List"
      >
        <List size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`${baseBtn} ${getActiveStyle(editor.isActive('orderedList'))}`}
        aria-label="Numbered List"
      >
        <ListOrdered size={18} />
      </button>

      {/* Quote & Code */}
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`${baseBtn} ${getActiveStyle(editor.isActive('blockquote'))}`}
        aria-label="Blockquote"
      >
        <Quote size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`${baseBtn} ${getActiveStyle(editor.isActive('codeBlock'))}`}
        aria-label="Code Block"
      >
        <Code size={18} />
      </button>

      {/* Table */}
      <button
        onClick={() =>
          editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
        }
        className={`${baseBtn}`}
        aria-label="Insert Table"
      >
        <TableIcon size={18} />
      </button>

      {/* Image Upload */}
      <button
        onClick={handleImageUpload}
        disabled={uploading}
        className={`${baseBtn} ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label="Insert Image"
        title={uploading ? 'Uploading...' : 'Insert Image'}
      >
        <ImageIcon size={18} />
      </button>

      {/* Undo / Redo */}
      <button
        onClick={() => editor.chain().focus().undo().run()}
        className={`${baseBtn}`}
        aria-label="Undo"
      >
        <Undo size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().redo().run()}
        className={`${baseBtn}`}
        aria-label="Redo"
      >
        <Redo size={18} />
      </button>
    </div>
  );
}
