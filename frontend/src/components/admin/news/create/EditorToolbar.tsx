'use client';

import { Editor, ChainedCommands } from '@tiptap/react';
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
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Eraser
} from 'lucide-react';
import { useState } from 'react';

type Props = {
  editor: Editor;
  handleImageUpload: () => void;
  uploading: boolean;
  onCollapse?: () => void;
};

const baseBtn =
  'p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed';

const getActiveStyle = (active: boolean) =>
  active ? 'bg-blue-100 text-blue-700 font-semibold' : '';

export default function EditorToolbar({ editor, handleImageUpload, uploading, onCollapse }: Props) {
  const [textColor, setTextColor] = useState('#000000');

  if (!editor) return null;

  interface ColorCommands {
  setColor: (color: string) => ChainedCommands;
}

type EditorWithColor = Editor & {
  chain: () => ChainedCommands & ColorCommands;
};
  

const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const color = e.target.value;
  setTextColor(color);

  const chain = (editor as EditorWithColor).chain();
  chain.focus().setColor(color).run();
};


  return (
    <div className="flex flex-wrap gap-2 items-center p-3 bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm rounded-t-lg">
      {onCollapse && (
        <button
          onClick={onCollapse}
          className="ml-auto p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
          title="Collapse toolbar (Esc)"
          aria-label="Collapse toolbar"
        >
          ✕
        </button>
      )}

      {/* Text Formatting */}
      <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${baseBtn} ${getActiveStyle(editor.isActive('bold'))}`}
          title="Bold (Ctrl+B)"
          aria-label="Bold"
        >
          <Bold size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`${baseBtn} ${getActiveStyle(editor.isActive('italic'))}`}
          title="Italic (Ctrl+I)"
          aria-label="Italic"
        >
          <Italic size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`${baseBtn} ${getActiveStyle(editor.isActive('underline'))}`}
          title="Underline (Ctrl+U)"
          aria-label="Underline"
        >
          <Underline size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`${baseBtn} ${getActiveStyle(editor.isActive('strike'))}`}
          title="Strikethrough (Ctrl+Shift+X)"
          aria-label="Strikethrough"
        >
          <Strikethrough size={18} />
        </button>
      </div>

      {/* Headings */}
      <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg">
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`${baseBtn} ${getActiveStyle(editor.isActive('heading', { level: 1 }))}`}
          title="Heading 1 (Ctrl+Alt+1)"
          aria-label="Heading 1"
        >
          <Heading1 size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`${baseBtn} ${getActiveStyle(editor.isActive('heading', { level: 2 }))}`}
          title="Heading 2 (Ctrl+Alt+2)"
          aria-label="Heading 2"
        >
          <Heading2 size={18} />
        </button>
      </div>

      {/* Alignment */}
      <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg">
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`${baseBtn} ${getActiveStyle(editor.isActive({ textAlign: 'left' }))}`}
          title="Align Left (Ctrl+Shift+L)"
          aria-label="Align Left"
        >
          <AlignLeft size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`${baseBtn} ${getActiveStyle(editor.isActive({ textAlign: 'center' }))}`}
          title="Align Center (Ctrl+Shift+E)"
          aria-label="Align Center"
        >
          <AlignCenter size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`${baseBtn} ${getActiveStyle(editor.isActive({ textAlign: 'right' }))}`}
          title="Align Right (Ctrl+Shift+R)"
          aria-label="Align Right"
        >
          <AlignRight size={18} />
        </button>
      </div>

      {/* Lists */}
      <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`${baseBtn} ${getActiveStyle(editor.isActive('bulletList'))}`}
          title="Bullet List (Ctrl+Shift+8)"
          aria-label="Bullet List"
        >
          <List size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`${baseBtn} ${getActiveStyle(editor.isActive('orderedList'))}`}
          title="Numbered List (Ctrl+Shift+7)"
          aria-label="Numbered List"
        >
          <ListOrdered size={18} />
        </button>
      </div>

      {/* Quote & Code */}
      <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg">
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`${baseBtn} ${getActiveStyle(editor.isActive('blockquote'))}`}
          title="Blockquote (Ctrl+Shift+B)"
          aria-label="Blockquote"
        >
          <Quote size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`${baseBtn} ${getActiveStyle(editor.isActive('codeBlock'))}`}
          title="Code Block (Ctrl+Shift+C)"
          aria-label="Code Block"
        >
          <Code size={18} />
        </button>
      </div>

      {/* Table & Image */}
      <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg">
        <button
          onClick={() =>
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          }
          className={`${baseBtn}`}
          title="Insert Table"
          aria-label="Insert Table"
        >
          <TableIcon size={18} />
        </button>

        <button
          onClick={handleImageUpload}
          disabled={uploading}
          className={`${baseBtn} ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={uploading ? 'Uploading...' : 'Insert Image (Ctrl+Shift+I)'}
          aria-label="Insert Image"
        >
          <ImageIcon size={18} />
        </button>
      </div>

      {/* Text Color */}
      <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg">
        <input
          type="color"
          value={textColor}
          onChange={handleColorChange}
          className="w-8 h-8 rounded-lg cursor-pointer"
          title="Text Color"
          aria-label="Text Color"
        />
      </div>

      {/* Clear Formatting */}
      <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg">
        <button
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          className={`${baseBtn}`}
          title="Clear Formatting (Ctrl+Shift+0)"
          aria-label="Clear Formatting"
        >
          <Eraser size={18} />
        </button>
      </div>

      {/* Undo / Redo */}
      <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg">
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className={`${baseBtn}`}
          title="Undo (Ctrl+Z)"
          aria-label="Undo"
        >
          <Undo size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className={`${baseBtn}`}
          title="Redo (Ctrl+Y)"
          aria-label="Redo"
        >
          <Redo size={18} />
        </button>
      </div>
    </div>
  );
}