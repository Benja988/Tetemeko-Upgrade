'use client';

import { useMemo } from 'react';
import UserRow from './UserRow';
import { IUser } from '@/types/user';
import { useDebounce } from '@/hooks/useDebounce';

interface UserTableProps {
  users: IUser[];
  search: string;
  filter: string;
}

export default function UserTable({ users, search, filter }: UserTableProps) {
  const debouncedSearch = useDebounce(search, 300);

  const filteredUsers = useMemo(() => {
    if (!Array.isArray(users)) return [];

    return users.filter((user) => {
      const matchesSearch =
        !debouncedSearch.trim() ||
        user.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        user.email?.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchesFilter = {
        admin: user.role === 'admin',
        manager: user.role === 'manager',
        web_user: user.role === 'web_user',
        active: user.isActive,
        inactive: !user.isActive,
        verified: user.isVerified,
        unverified: !user.isVerified,
        all: true,
        '': true,
      }[filter] ?? true;

      return matchesSearch && matchesFilter;
    });
  }, [users, debouncedSearch, filter]);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="custom-scrollbar overflow-x-auto bg-white rounded-lg shadow flex-1 max-w-full">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <th className="p-3 text-left">Profile</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Verified</th>
              <th className="p-3 text-left">Locked</th>
              <th className="p-3 text-left">Created At</th>
              {/* <th className="p-3 text-left">Last Login</th> */}
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-4 text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <UserRow key={user._id} user={user} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
