'use client';

import { useState, useCallback, useMemo } from 'react';
import { NewsItems } from '@/data/news';
import { NewsArticle } from '@/interfaces/News';

import NewsActions from './NewsActions';
import NewsSearchBar from './NewsSearchBar';
import NewsFilterBar from './NewsFilterBar';
import NewsTabs from './NewsTabs';
import AddNewsModal from './AddNewsModal';
import EditNewsModal from './EditNewsModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { ExportNewsModal } from './ExportNewsModal';
import NewsCards from './NewsCards';

interface NewsPageLayoutProps {
  heading: string;
  defaultFilter?: string;
}

export default function NewsPageLayout({
  heading,
  defaultFilter = '',
}: NewsPageLayoutProps) {
  // States for UI and data
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOption, setFilterOption] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isExportModalOpen, setExportModalOpen] = useState(false);

  // Combine filter with defaultFilter; memoize to avoid unnecessary recalcs
  const combinedFilter = useMemo(() => filterOption || defaultFilter, [
    filterOption,
    defaultFilter,
  ]);

  // Handlers - useCallback to memoize and avoid recreations
  const handleSearch = useCallback((query: string) => setSearchQuery(query), []);
  const handleFilter = useCallback((filter: string) => setFilterOption(filter), []);

  // Open edit modal with an article or slug string
  const openEditModalWithArticle = useCallback(
    (articleOrSlug: NewsArticle | string) => {
      if (typeof articleOrSlug === 'string') {
        const article = NewsItems.find((a) => a.slug === articleOrSlug) || null;
        setSelectedArticle(article);
      } else {
        setSelectedArticle(articleOrSlug);
      }
      setEditModalOpen(true);
    },
    []
  );

  // Handle edit by article ID
  const handleEditById = useCallback((articleId: string) => {
    const article = NewsItems.find((a) => a._id === articleId) || null;
    setSelectedArticle(article);
    setEditModalOpen(true);
  }, []);

  // Render
  return (
    <section className="min-h-screen bg-[var(--color-light)] p-6">
      <header className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-[var(--color-primary)]">{heading}</h1>
        </div>
        <div className="mt-4">
          <NewsTabs />
        </div>
      </header>

      <div className="flex flex-wrap gap-2 mb-4">
        <NewsSearchBar onSearch={handleSearch} />
        <NewsFilterBar onFilter={handleFilter} />
      </div>

      <main>
        {/* <NewsActions
          onAddNews={() => setAddModalOpen(true)}
          onEditNews={handleEditById}
          onDeleteSelected={() => setDeleteModalOpen(true)}
          onExport={() => setExportModalOpen(true)}
        /> */}

        <NewsCards
          articles={NewsItems}
          search={searchQuery}
          filter={combinedFilter}
          onEdit={openEditModalWithArticle}
        />
      </main>

      {/* Modals */}
      <AddNewsModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={(newArticle: NewsArticle) => {
          console.log('Added article', newArticle);
          setAddModalOpen(false);
        }}
      />

      <EditNewsModal
        isOpen={isEditModalOpen}
        article={selectedArticle}
        onClose={() => {
          setSelectedArticle(null);
          setEditModalOpen(false);
        }}
        onEdit={(updatedArticle: NewsArticle) => {
          console.log('Edited article', updatedArticle);
          setEditModalOpen(false);
          setSelectedArticle(null);
        }}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => {
          console.log('Deleted selected articles');
          setDeleteModalOpen(false);
        }}
        message="Are you sure you want to delete selected news articles?"
      />

      <ExportNewsModal
        isOpen={isExportModalOpen}
        onClose={() => setExportModalOpen(false)}
        onExport={() => {
          console.log('Exported news list');
          setExportModalOpen(false);
        }}
      />
    </section>
  );
}
