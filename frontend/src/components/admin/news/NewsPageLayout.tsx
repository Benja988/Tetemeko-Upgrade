'use client';

import { useState } from 'react';
import { NewsItems } from '@/data/news';
import { NewsArticle } from '@/interfaces/News';
import NewsTable from './NewsTable';
import NewsActions from './NewsActions';
import NewsSearchBar from './NewsSearchBar';
import NewsFilterBar from './NewsFilterBar';
import NewsTabs from './NewsTabs';
import AddNewsModal from './AddNewsModal';
import EditNewsModal from './EditNewsModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { ExportNewsModal } from './ExportNewsModal';

interface NewsPageLayoutProps {
    heading: string;
    defaultFilter?: string;
}

export default function NewsPageLayout({
    heading,
    defaultFilter = '',
}: NewsPageLayoutProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterOption, setFilterOption] = useState('');
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isExportModalOpen, setExportModalOpen] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

    const handleSearch = (query: string) => setSearchQuery(query);
    const handleFilter = (filter: string) => setFilterOption(filter);
    const combinedFilter = filterOption || defaultFilter;

    // Use a safe setter to prevent undefined
    const openEditModalWithArticle = (articleOrSlug: NewsArticle | string) => {
        if (typeof articleOrSlug === 'string') {
            const article = NewsItems.find((a) => a.slug === articleOrSlug) || null;
            setSelectedArticle(article);
        } else {
            setSelectedArticle(articleOrSlug);
        }
        setEditModalOpen(true);
    };

    return (
        <section className="min-h-screen bg-[var(--color-light)] p-6">
            <header className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h1 className="text-3xl font-bold text-[var(--color-primary)]">
                        {heading}
                    </h1>
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
                <NewsActions
                    onAddNews={() => setAddModalOpen(true)}
                    onEditNews={(articleId) => {
                        // find the article by ID from NewsItems (or from your articles state)
                        const article = NewsItems.find(a => a._id === articleId) || null;
                        setSelectedArticle(article);
                        setEditModalOpen(true);
                    }}
                    onDeleteSelected={() => setDeleteModalOpen(true)}
                    onExport={() => setExportModalOpen(true)}
                />


                <NewsTable
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
                onAdd={(newArticle: NewsArticle) =>
                    console.log('Added article', newArticle)
                }
            />

            <EditNewsModal
                isOpen={isEditModalOpen}
                article={selectedArticle}
                onClose={() => {
                    setSelectedArticle(null);
                    setEditModalOpen(false);
                }}
                onEdit={(updatedArticle: NewsArticle) =>
                    console.log('Edited article', updatedArticle)
                }
            />

            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={() => console.log('Deleted selected articles')}
                message="Are you sure you want to delete selected news articles?"
            />

            <ExportNewsModal
                isOpen={isExportModalOpen}
                onClose={() => setExportModalOpen(false)}
                onExport={() => console.log('Exported news list')}
            />
        </section>
    );
}
