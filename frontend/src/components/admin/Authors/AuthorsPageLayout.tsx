'use client';

import { useEffect, useState } from 'react';
import { Author } from '@/types/author';

import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { ExportAuthorsModal } from './ExportAuthorsModal';
import { deleteAuthor, getAuthors, searchAuthors, updateAuthor, verifyAuthor } from '@/services/authors';
import AuthorTabs from './AuthorTabs';
import AuthorSearchBar from './AuthorSearchBar';
import AuthorFilterBar from './AuthorFilterBar';
import AuthorActions from './AuthorActions';
import AuthorTable from './AuthorTable';

interface AuthorsPageLayoutProps {
    heading: string;
    defaultFilter?: string;
}

export default function AuthorsPageLayout({
    heading,
    defaultFilter = '',
}: AuthorsPageLayoutProps) {
    const [rawAuthors, setRawAuthors] = useState<Author[]>([]);
    const [authors, setAuthors] = useState<Author[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterOption, setFilterOption] = useState(defaultFilter);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedAuthorIds, setSelectedAuthorIds] = useState<string[]>([]);
    const [selectedAuthorNames, setSelectedAuthorNames] = useState<string[]>([]);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isExportModalOpen, setExportModalOpen] = useState(false);
    const [uiFilter, setUiFilter] = useState('');

    // Filter authors based on UI filter
    const applyUiFilter = (authors: Author[], filter: string): Author[] => {
        switch (filter) {
            case 'unverified':
                return authors.filter((a) => !a.isVerified);
            default:
                return authors;
        }
    };

    const fetchAuthors = async () => {
        try {
            setIsLoading(true);
            const response: Author[] = await getAuthors();
            setRawAuthors(response);
            setAuthors(applyUiFilter(response, uiFilter));
            setSelectedAuthorIds([]);
        } catch (error) {
            console.error('Error fetching authors:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAuthors();
    }, [filterOption]);

    useEffect(() => {
        setAuthors(applyUiFilter(rawAuthors, uiFilter));
    }, [uiFilter, rawAuthors]);

    useEffect(() => {
        const names = selectedAuthorIds.map((id) => {
            const author = rawAuthors.find((a) => a._id === id);
            return author ? author.name : id;
        });
        setSelectedAuthorNames(names);
    }, [selectedAuthorIds, rawAuthors]);

    const handleSearch = async (query: string) => {
        setSearchQuery(query);

        if (!query.trim()) {
            fetchAuthors();
            return;
        }

        try {
            setIsLoading(true);
            const result = await searchAuthors(query);
            setAuthors(applyUiFilter(result, uiFilter));
            setSelectedAuthorIds([]);
        } catch (error) {
            console.error('Search error:', error);
            setAuthors([]);
            setSelectedAuthorIds([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            if (selectedAuthorIds.length === 0) return;

            for (const id of selectedAuthorIds) {
                await deleteAuthor(id);
            }

            await fetchAuthors();
        } catch (error) {
            console.error('Failed to delete authors:', error);
        } finally {
            setDeleteModalOpen(false);
            setSelectedAuthorIds([]);
        }
    };

    // New handlers for create, update, and verify actions
    const handleCreate = () => {
        // TODO: Replace with actual create logic or navigation
        alert('Create action triggered - open create author form here.');
    };

    const handleUpdateSelected = async () => {
    if (selectedAuthorIds.length === 0) {
        alert('No authors selected to update.');
        return;
    }

    try {
        setIsLoading(true);

        // You can customize this data object based on what you want to update
        const updateData: Partial<Author> = {
            isVerified: true, // Example update
        };

        for (const id of selectedAuthorIds) {
            await updateAuthor(id, updateData);
        }

        alert(`Updated ${selectedAuthorIds.length} author(s).`);
        await fetchAuthors();
    } catch (error) {
        console.error('Failed to update authors:', error);
    } finally {
        setIsLoading(false);
        setSelectedAuthorIds([]);
    }
};


    const handleVerifySelected = async () => {
    if (selectedAuthorIds.length === 0) {
        alert('No authors selected to verify.');
        return;
    }

    try {
        setIsLoading(true);

        for (const id of selectedAuthorIds) {
            await verifyAuthor(id);
        }

        alert(`Verified ${selectedAuthorIds.length} author(s).`);
        await fetchAuthors();
    } catch (error) {
        console.error('Failed to verify authors:', error);
    } finally {
        setIsLoading(false);
        setSelectedAuthorIds([]);
    }
};


    const toggleSelectAll = () => {
        if (selectedAuthorIds.length === authors.length) {
            setSelectedAuthorIds([]);
        } else {
            setSelectedAuthorIds(authors.map((a) => a._id));
        }
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
                    <AuthorTabs activeFilter={uiFilter} setFilter={setUiFilter} />
                </div>
            </header>

            <div className="flex flex-wrap gap-2 mb-4">
                <AuthorSearchBar onSearch={handleSearch} />
                <AuthorFilterBar onFilter={setFilterOption} />
            </div>

            <main>
                <AuthorActions
                    onCreate={handleCreate}
                    onExport={() => setExportModalOpen(true)}
                    onUpdateSelected={handleUpdateSelected}
                    onVerifySelected={handleVerifySelected}
                    onDeleteSelected={() => setDeleteModalOpen(true)}
                    disableUpdate={selectedAuthorIds.length === 0}
                    disableVerify={selectedAuthorIds.length === 0}
                    disableDelete={selectedAuthorIds.length === 0}
                />

                <AuthorTable
                    authors={authors}
                    search={searchQuery}
                    filter={filterOption}
                    onSelectAuthors={setSelectedAuthorIds}
                    selectedAuthorIds={selectedAuthorIds}
                    onToggleSelectAll={toggleSelectAll}
                    // isLoading={isLoading}
                />
            </main>

            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                authorIds={selectedAuthorIds}
                authorNames={selectedAuthorNames}
                onDeleted={handleDeleteConfirm}
                message={`Are you sure you want to delete ${selectedAuthorIds.length} selected author(s)?`}
            />

            <ExportAuthorsModal
                isOpen={isExportModalOpen}
                onClose={() => setExportModalOpen(false)}
                authors={authors}
            />
        </section>
    );
}
