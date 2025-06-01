'use client';

import { useEffect, useState } from 'react';
import { Author } from '@/types/author';

import {
  deleteAuthor,
  getAuthors,
  searchAuthors,
  updateAuthor,
  verifyAuthor,
} from '@/services/authors';

import AuthorTabs from './AuthorTabs';
import AuthorSearchBar from './AuthorSearchBar';
import AuthorFilterBar from './AuthorFilterBar';
import AuthorActions from './AuthorActions';
import AuthorTable from './AuthorTable';
import { CreateAuthorModal } from './CreateAuthorModal';
import UpdateAuthorModal from './UpdateAuthorModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { ExportAuthorsModal } from './ExportAuthorsModal';

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
  const [uiFilter, setUiFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAuthorIds, setSelectedAuthorIds] = useState<string[]>([]);
  const [selectedAuthorNames, setSelectedAuthorNames] = useState<string[]>([]);
  const [authorToUpdate, setAuthorToUpdate] = useState<Author | null>(null);

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isExportModalOpen, setExportModalOpen] = useState(false);

  const applyFilter = (authors: Author[], filter: string) => {
    if (filter === 'unverified') return authors.filter((a) => !a.isVerified);
    if (filter === 'verified') return authors.filter((a) => a.isVerified);
    return authors;
  };

  const fetchAuthors = async () => {
    try {
      setIsLoading(true);
      const fetched = await getAuthors();
      setRawAuthors(fetched);
      setAuthors(applyFilter(fetched, uiFilter));
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
    setAuthors(applyFilter(rawAuthors, uiFilter));
  }, [uiFilter, rawAuthors]);

  useEffect(() => {
    const names = selectedAuthorIds.map((id) => {
      const found = rawAuthors.find((a) => a._id === id);
      return found?.name ?? id;
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
      const results = await searchAuthors(query);
      setAuthors(applyFilter(results, uiFilter));
      setSelectedAuthorIds([]);
    } catch (error) {
      console.error('Search failed:', error);
      setAuthors([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAuthors = async () => {
    try {
      for (const id of selectedAuthorIds) {
        await deleteAuthor(id);
      }
      await fetchAuthors();
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setDeleteModalOpen(false);
      setSelectedAuthorIds([]);
    }
  };

  const handleVerify = async () => {
    if (selectedAuthorIds.length !== 1) return;
    try {
      setIsLoading(true);
      await verifyAuthor(selectedAuthorIds[0]);
      await fetchAuthors();
    } catch (error) {
      console.error('Verification failed:', error);
    } finally {
      setIsLoading(false);
      setSelectedAuthorIds([]);
    }
  };

  const handleOpenUpdateModal = () => {
    if (selectedAuthorIds.length !== 1) return;
    const selected = rawAuthors.find((a) => a._id === selectedAuthorIds[0]);
    if (selected) {
      setAuthorToUpdate(selected);
      setUpdateModalOpen(true);
    }
  };

  const handleUpdateSubmit = async (data: Partial<Author>) => {
    if (!authorToUpdate) return;
    try {
      setIsLoading(true);
      await updateAuthor(authorToUpdate._id, data);
      await fetchAuthors();
      setUpdateModalOpen(false);
      setAuthorToUpdate(null);
      setSelectedAuthorIds([]);
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setIsLoading(false);
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
    <section className="min-h-screen bg-[var(--color-light)] px-4 py-6">
      <header className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-primary)]">
            {heading}
          </h1>
        </div>
        <div className="w-full overflow-x-auto">
          <AuthorTabs activeFilter={uiFilter} setFilter={setUiFilter} />
        </div>
      </header>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <AuthorSearchBar onSearch={handleSearch} />
        <AuthorFilterBar onFilter={setFilterOption} />
      </div>

      <div className="mb-4">
        <AuthorActions
          onCreate={() => setCreateModalOpen(true)}
          onExport={() => setExportModalOpen(true)}
          onUpdateSelected={handleOpenUpdateModal}
          onVerifySelected={handleVerify}
          onDeleteSelected={() => setDeleteModalOpen(true)}
          disableUpdate={selectedAuthorIds.length !== 1}
          disableVerify={selectedAuthorIds.length !== 1}
          disableDelete={selectedAuthorIds.length === 0}
        />
      </div>

      <div className="w-full overflow-x-auto">
        <AuthorTable
          authors={authors}
          search={searchQuery}
          filter={filterOption}
          selectedAuthorIds={selectedAuthorIds}
          onSelectAuthors={setSelectedAuthorIds}
          onToggleSelectAll={toggleSelectAll}
        />
      </div>

      <CreateAuthorModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={fetchAuthors}
      />

      <UpdateAuthorModal
        isOpen={isUpdateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        author={authorToUpdate}
        onUpdate={handleUpdateSubmit}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        authorIds={selectedAuthorIds}
        authorNames={selectedAuthorNames}
        onDeleted={handleDeleteAuthors}
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
