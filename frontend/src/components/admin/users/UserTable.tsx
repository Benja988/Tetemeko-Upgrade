'use client';

import { useMemo, useState, useEffect } from 'react';
import UserRow from './UserRow';
import { IUser } from '@/types/user';
import { useDebounce } from '@/hooks/useDebounce';

interface UserTableProps {
  users: IUser[];
  search: string;
  filter: string;
  onSelectUsers: (ids: string[]) => void;
}

export default function UserTable({ users, search, filter, onSelectUsers }: UserTableProps) {
  const debouncedSearch = useDebounce(search, 300);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

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

  useEffect(() => {
    onSelectUsers(selectedUserIds);
  }, [selectedUserIds, onSelectUsers]);

  const handleCheckboxChange = (userId: string, checked: boolean) => {
    setSelectedUserIds((prev) =>
      checked ? [...prev, userId] : prev.filter((id) => id !== userId)
    );
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="bg-white shadow-md rounded-xl overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 bg-gray-50 z-10">
            <tr className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <th className="p-3 text-left">Select</th>
              <th className="p-3 text-left whitespace-nowrap">Profile</th>
              <th className="p-3 text-left whitespace-nowrap">Name</th>
              <th className="p-3 text-left whitespace-nowrap">Email</th>
              <th className="p-3 text-left whitespace-nowrap">Role</th>
              <th className="p-3 text-left whitespace-nowrap">Status</th>
              <th className="p-3 text-left whitespace-nowrap">Verified</th>
              <th className="p-3 text-left whitespace-nowrap">Locked</th>
              <th className="p-3 text-left whitespace-nowrap">Created At</th>
              <th className="p-3 text-left whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-6 text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user, index) => (
                <UserRow
  key={user._id}
  user={user}
  isSelected={selectedUserIds.includes(user._id)}
  onCheckboxChange={handleCheckboxChange}
  rowClassName={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
/>

              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Optional helper below the table on small screens */}
      <div className="mt-2 text-sm text-gray-400 text-center lg:hidden">
        Swipe horizontally to view more →
      </div>
    </div>
  );
}
