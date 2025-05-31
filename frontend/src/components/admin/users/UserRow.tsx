'use client';

import { useState } from 'react';
import dayjs from 'dayjs';
import { IUser } from '@/types/user';
import UserActions from '@/components/admin/users/UserActions';
import { EditUserModal } from './EditUserModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { PromoteUserModal } from './PromoteUserModal';
import { ResetPasswordModal } from './ResetPasswordModal';
import { ToggleActiveStatusModal } from './ToggleActiveStatusModal';
import { ViewUserModal } from './ViewUserModal';

type UserAction =
  | 'edit'
  | 'delete'
  | 'promote'
  | 'resetPassword'
  | 'toggleActive'
  | 'view';

export default function UserRow({ user }: { user: IUser }) {
  const isLocked = user.lockUntil ? dayjs(user.lockUntil).isAfter(dayjs()) : false;

  const [openModal, setOpenModal] = useState<UserAction | null>(null);

  const handleUserAction = (action: UserAction) => {
    setOpenModal(action);
  };

  const closeModal = () => {
    setOpenModal(null);
  };

  const renderStatusBadge = (status: boolean, type: 'active' | 'verified') => {
    const baseClasses = 'inline-block px-2 py-1 rounded-full text-xs font-medium';
    const badgeColor =
      type === 'active'
        ? status
          ? 'bg-green-100 text-green-700'
          : 'bg-red-100 text-red-700'
        : status
        ? 'bg-blue-100 text-blue-700'
        : 'bg-yellow-100 text-yellow-700';

    const label =
      type === 'active'
        ? status
          ? 'Active'
          : 'Inactive'
        : status
        ? 'Verified'
        : 'Unverified';

    return <span className={`${baseClasses} ${badgeColor}`}>{label}</span>;
  };

  return (
    <>
      <tr className="border-b hover:bg-gray-50 transition-colors duration-150">

        <td className="p-3 whitespace-nowrap">
    <img
      src={user.profilePictureUrl || '/avatar.jpg'} // fallback image
      alt={`${user.name}'s profile`}
      className="h-8 w-8 rounded-full object-cover"
      loading="lazy"
    />
  </td>
        <td className="p-3 whitespace-nowrap">{user.name}</td>
        <td className="p-3 whitespace-nowrap">{user.email}</td>
        <td className="p-3 whitespace-nowrap capitalize">{user.role}</td>
        <td className="p-3 whitespace-nowrap">{renderStatusBadge(user.isActive, 'active')}</td>
        <td className="p-3 whitespace-nowrap">{renderStatusBadge(user.isVerified, 'verified')}</td>
        
        {/* Locked column */}
        <td className="p-3 whitespace-nowrap">
          {isLocked ? (
            <span
              className="text-red-600 text-xs"
              title={`Locked until ${dayjs(user.lockUntil).format('MMMM D, YYYY h:mm A')}`}
            >
              Locked until {dayjs(user.lockUntil).format('MMM D, YYYY h:mm A')}
            </span>
          ) : (
            <span className="text-green-600 text-xs">Not Locked</span>
          )}
        </td>

        {/* Created At */}
        <td className="p-3 whitespace-nowrap">
          {user.createdAt ? dayjs(user.createdAt).format('MMM D, YYYY') : 'N/A'}
        </td>

        {/* Last Login
        <td className="p-3 whitespace-nowrap">
          {user.lastLogin ? dayjs(user.lastLogin).format('MMM D, YYYY h:mm A') : 'Never'}
        </td> */}

        {/* Actions */}
        <td className="p-3 whitespace-nowrap flex space-x-2 items-center">
          <UserActions user={user} onUserAction={handleUserAction} />
        </td>
      </tr>

      {/* Modals */}
      <EditUserModal
        isOpen={openModal === 'edit'}
        onClose={closeModal}
        user={user}
        onSave={(updatedUser) => {
          console.log('Updated user:', updatedUser);
          closeModal();
        }}
      />

      <ConfirmDeleteModal
        isOpen={openModal === 'delete'}
        onClose={closeModal}
        onConfirm={() => {
          console.log('Deleted user:', user);
          closeModal();
        }}
        message={`Are you sure you want to delete ${user.name}?`}
      />

      <PromoteUserModal
        isOpen={openModal === 'promote'}
        onClose={closeModal}
        user={user}
        onPromote={() => {
          console.log('Promoted user:', user);
          closeModal();
        }}
      />

      <ResetPasswordModal
        isOpen={openModal === 'resetPassword'}
        onClose={closeModal}
        user={user}
        onReset={() => {
          console.log('Password reset for:', user);
          closeModal();
        }}
      />

      <ToggleActiveStatusModal
        isOpen={openModal === 'toggleActive'}
        onClose={closeModal}
        user={user}
        onToggle={() => {
          console.log('Toggled active status:', user);
          closeModal();
        }}
      />

      <ViewUserModal
        isOpen={openModal === 'view'}
        onClose={closeModal}
        user={user}
      />
    </>
  );
}
