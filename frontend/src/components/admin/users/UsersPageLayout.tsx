'use client';

import { useEffect, useState } from 'react';
import UserFilterBar from '@/components/admin/users/UserFilterBar';
import UserSearchBar from '@/components/admin/users/UserSearchBar';
import UsersTabs from '@/components/admin/users/UsersTabs';
import UserTable from '@/components/admin/users/UserTable';
import UserActions from '@/components/admin/users/UserActions';
import { IUser, UserRole } from '@/types/user';
import {
  getUsers,
  searchUsers,
  deleteUser,
} from '@/services/users';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { ExportUsersModal } from './ExportUsersModal';

interface UsersPageLayoutProps {
  heading: string;
  defaultFilter?: string;
}

export default function UsersPageLayout({
  heading,
  defaultFilter = '',
}: UsersPageLayoutProps) {
  const [users, setUsers] = useState<IUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOption, setFilterOption] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isExportModalOpen, setExportModalOpen] = useState(false);

  const combinedFilter = filterOption || defaultFilter;

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const role = combinedFilter as UserRole;
      const response = await getUsers(1, 50, role);
      setUsers(response?.users ?? []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [combinedFilter]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      fetchUsers();
      return;
    }

    try {
      setIsLoading(true);
      const results = await searchUsers(query);
      setUsers(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      // await deleteUser(selectedUserIds);
      await fetchUsers();
      setSelectedUserIds([]);
    } catch (error) {
      console.error('Failed to delete users:', error);
    } finally {
      setDeleteModalOpen(false);
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
          <UsersTabs />
        </div>
      </header>

      <div className="flex flex-wrap gap-2 mb-4">
        <UserSearchBar onSearch={handleSearch} />
        <UserFilterBar onFilter={setFilterOption} />
      </div>

      <main>
        <UserActions
          onExport={() => setExportModalOpen(true)}
          onDeleteSelected={() => setDeleteModalOpen(true)}
        />

        <UserTable
          users={users}
          search={searchQuery}
          filter={combinedFilter}
          onSelectUsers={setSelectedUserIds}
        />
      </main>

      <ConfirmDeleteModal
  isOpen={isDeleteModalOpen}
  onClose={() => setDeleteModalOpen(false)}
  userId={selectedUserIds[0] || ''} // you must provide a userId, just use first or empty
  onDeleted={() => {
    handleDeleteConfirm();
  }}
  message={`Are you sure you want to delete ${selectedUserIds.length} selected user(s)?`}
/>


      <ExportUsersModal
        isOpen={isExportModalOpen}
        onClose={() => setExportModalOpen(false)}
        onExport={() => {
          console.log('Export triggered');
        }}
      />
    </section>
  );
}
