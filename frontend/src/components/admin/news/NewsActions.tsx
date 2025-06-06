'use client';

import { NewsArticle } from "@/interfaces/News";
import { PlusCircle, Edit, Trash2, Download } from "lucide-react";

interface NewsActionsProps {
  onAddNews: () => void;
  onEditNews: (articleOrSlug?: NewsArticle | string) => void;
  onDeleteSelected: () => void;
  onExport: () => void;
}

export default function NewsActions({
  onAddNews,
  onEditNews,
  onDeleteSelected,
  onExport,
}: NewsActionsProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <button
        onClick={onAddNews}
        className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Add News
      </button>

      <button
        onClick={() => onEditNews()}
        className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow"
      >
        <Edit className="mr-2 h-4 w-4" />
        Edit
      </button>

      <button
        onClick={onDeleteSelected}
        className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </button>

      <button
        onClick={onExport}
        className="flex items-center bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow"
      >
        <Download className="mr-2 h-4 w-4" />
        Export
      </button>
    </div>
  );
}
