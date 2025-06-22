'use client';

import { News } from '@/interfaces/News';
import NewsTableRow from './NewsTableRow';
import { Fragment } from 'react';
import { useModal } from '@/hooks/useModal';
import PreviewModal from './PreviewModal';
import EditNewsModal from './EditNewsModal';

interface Props {
  newsList: News[];
  onDelete: (id: string) => void;
  onToggleBreaking: (id: string) => void;
  refetch: () => void;
}

export default function NewsTable({ newsList, onDelete, onToggleBreaking, refetch }: Props) {
  const groupedByCategory = newsList.reduce((acc, news) => {
    const category =
      typeof news.category === 'object' && news.category
        ? news.category.name
        : typeof news.category === 'string'
        ? news.category
        : 'Uncategorized';
    if (!acc[category]) acc[category] = [];
    acc[category].push(news);
    return acc;
  }, {} as Record<string, News[]>);

  const {
    open: previewOpen,
    data: previewData,
    openModal: openPreview,
    closeModal: closePreview,
  } = useModal<News>();

  const {
    open: editOpen,
    data: editData,
    openModal: openEdit,
    closeModal: closeEdit,
  } = useModal<News>();

  return (
    <>
      <div className="overflow-x-auto bg-white rounded-xl shadow border">
        <table className="w-full table-auto border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-left uppercase tracking-wide">
              <th className="p-3">Thumbnail</th>
              <th className="p-3">Title</th>
              <th className="p-3">Category</th>
              <th className="p-3 text-center">Author</th>
              <th className="p-3 text-center">Published</th>
              <th className="p-3 text-center">Breaking</th>
              <th className="p-3 text-center">Views</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedByCategory).map(([category, items]) => (
              <Fragment key={category}>
                <tr className="bg-blue-50">
                  <td colSpan={8} className="px-4 py-2 font-semibold text-blue-800 uppercase">
                    {category}
                  </td>
                </tr>
                {items.map((news) => (
                  <NewsTableRow
                    key={news._id}
                    news={news}
                    onDelete={onDelete}
                    onToggleBreaking={onToggleBreaking}
                    onPreview={openPreview}
                    onEdit={openEdit}
                  />
                ))}
              </Fragment>
            ))}
            {newsList.length === 0 && (
              <tr>
                <td colSpan={8} className="p-5 text-center text-gray-400 italic">
                  No news articles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PreviewModal news={previewData} isOpen={previewOpen} onClose={closePreview} />
      <EditNewsModal
        news={editData}
        isOpen={editOpen}
        onClose={closeEdit}
        onSuccess={() => {
          refetch();
          closeEdit();
        }}
      />
    </>
  );
}
