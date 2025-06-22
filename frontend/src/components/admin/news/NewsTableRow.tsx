'use client';

import { News } from '@/interfaces/News';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Circle,
  Trash2,
  Flame,
  Eye,
  Edit3,
} from 'lucide-react';
import Image from 'next/image';
import moment from 'moment';

interface Props {
  news: News;
  onDelete: (id: string) => void;
  onToggleBreaking: (id: string) => void;
  onPreview: (news: News) => void;
  onEdit: (news: News) => void;
}

export default function NewsTableRow({
  news,
  onDelete,
  onToggleBreaking,
  onPreview,
  onEdit,
}: Props) {
  const author =
    typeof news.author === 'object' && news.author !== null
      ? (news.author as any)?.name || '—'
      : typeof news.author === 'string'
      ? news.author
      : '—';

  return (
    <tr className="border-t hover:bg-gray-50 transition-all duration-200">
      <td className="p-3">
        {news.thumbnail ? (
          <Image
            src={news.thumbnail}
            alt={`Thumbnail for ${news.title}`}
            width={60}
            height={40}
            className="rounded-md object-cover border"
          />
        ) : news.videoUrl ? (
          <video
            src={news.videoUrl}
            muted
            className="w-[60px] h-[40px] object-cover rounded border"
            title="Video preview"
          />
        ) : (
          <div className="w-14 h-10 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-400">
            No Image
          </div>
        )}
      </td>

      <td className="p-3 font-medium text-gray-900">
        <div className="truncate max-w-[200px]" title={news.title}>
          {news.title}
        </div>
        <p className="text-xs text-gray-500">
          {moment(news.createdAt).fromNow()} · {news.readingTime ?? 2} min read
        </p>
      </td>

      <td className="p-3 text-gray-700">
        {typeof news.category === 'object' && news.category
          ? (news.category as any)?.name
          : typeof news.category === 'string'
          ? news.category
          : '—'}
      </td>

      <td className="p-3 text-center text-sm text-gray-700">{author}</td>

      <td className="p-3 text-center">
        {news.isPublished ? (
          <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
        ) : (
          <XCircle className="h-5 w-5 text-gray-400 mx-auto" />
        )}
      </td>

      <td className="p-3 text-center">
        {news.isBreaking ? (
          <AlertTriangle className="h-5 w-5 text-red-500 mx-auto" />
        ) : (
          <Circle className="h-5 w-5 text-gray-300 mx-auto" />
        )}
      </td>

      <td className="p-3 text-center text-sm text-gray-600">{news.viewsCount}</td>

      <td className="p-3 text-center">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onToggleBreaking(news._id)}
            className="p-1 rounded hover:bg-yellow-100 transition"
            title="Toggle Breaking"
          >
            <Flame className="w-4 h-4 text-yellow-600" />
          </button>
          <button
            onClick={() => onPreview(news)}
            className="p-1 rounded hover:bg-blue-100 transition"
            title="Preview"
          >
            <Eye className="w-4 h-4 text-blue-600" />
          </button>
          <button
            onClick={() => onEdit(news)}
            className="p-1 rounded hover:bg-green-100 transition"
            title="Edit"
          >
            <Edit3 className="w-4 h-4 text-green-600" />
          </button>
          <button
            onClick={() => onDelete(news._id)}
            className="p-1 rounded hover:bg-red-100 transition"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </td>
    </tr>
  );
}
