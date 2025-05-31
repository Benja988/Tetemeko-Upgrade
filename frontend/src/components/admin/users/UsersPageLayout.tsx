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
} from '@/services/users';

import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { InviteUserModal } from './InviteUserModal';
import { ExportUsersModal } from './ExportUsersModal';
import AddUserModal from './AddUserModal';

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
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);
  const [isExportModalOpen, setExportModalOpen] = useState(false);
  const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);

  const combinedFilter = filterOption || defaultFilter;

  // Fetch users from API
  const fetchUsers = async () => {
  try {
    setIsLoading(true);
    const role = combinedFilter as UserRole;
    const data = await getUsers(1, 50, role);
    console.log('Raw data from getUsers:', data);

    const fetchedUsers = data.users;  // <-- key fix here
    setUsers(fetchedUsers ?? []);
    console.log('Fetched users:', fetchedUsers);

  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    setIsLoading(false);
  }
};


  // Fetch users on mount & when filter changes
  useEffect(() => {
    fetchUsers();
  }, [combinedFilter]);

  // Handle search input
  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      fetchUsers();
      return;
    }

    try {
      setIsLoading(true);
      const results: IUser[] = await searchUsers(query);
      setUsers(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilter = (filter: string) => setFilterOption(filter);

  return (
    <section className="min-h-screen bg-[var(--color-light)] p-6">
      {/* Header */}
      <header className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-[var(--color-primary)]">{heading}</h1>
        </div>
        <div className="mt-4">
          <UsersTabs />
        </div>
      </header>

      {/* Search & Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        <UserSearchBar onSearch={handleSearch} />
        <UserFilterBar onFilter={handleFilter} />
      </div>

      {/* Actions & Table */}
      <main>
        <UserActions
          onAddUser={() => setAddUserModalOpen(true)}
          onInviteUser={() => setInviteModalOpen(true)}
          onExport={() => setExportModalOpen(true)}
          onDeleteSelected={() => setDeleteModalOpen(true)}
        />

        <UserTable
          users={users ?? []}
          search={searchQuery}
          filter={combinedFilter}
        />
      </main>

      {/* Modals */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => {
          console.log('Confirmed delete selected users');
        }}
        message="Are you sure you want to delete selected users?"
      />

      <InviteUserModal
        isOpen={isInviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        onInvite={(emails: string[]) => {
          console.log('Invited users:', emails);
        }}
      />

      <ExportUsersModal
        isOpen={isExportModalOpen}
        onClose={() => setExportModalOpen(false)}
        onExport={() => {
          console.log('Exported user list');
        }}
      />

      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setAddUserModalOpen(false)}
        onAdd={(newUser: IUser) => {
          console.log('Added new user', newUser);
          fetchUsers(); // Refresh user list
        }}
      />
    </section>
  );
}
