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

interface UserRowProps {
  user: IUser;
  isSelected: boolean;
  onCheckboxChange: (userId: string, checked: boolean) => void;
  rowClassName?: string;
}

export default function UserRow({
  user,
  isSelected,
  onCheckboxChange,
  rowClassName = '',
}: UserRowProps) {
  const [openModal, setOpenModal] = useState<UserAction | null>(null);

  const isLocked =
    user.lockUntil && dayjs(user.lockUntil).isAfter(dayjs());

  const handleUserAction = (action: UserAction) => {
    setOpenModal(action);
  };

  const closeModal = () => setOpenModal(null);

  const renderBadge = (status: boolean, type: 'active' | 'verified') => {
    const classes =
      'inline-block px-2 py-1 rounded-full text-xs font-medium';
    const config = {
      active: status
        ? 'bg-green-100 text-green-700'
        : 'bg-red-100 text-red-700',
      verified: status
        ? 'bg-blue-100 text-blue-700'
        : 'bg-yellow-100 text-yellow-700',
    };
    const label = {
      active: status ? 'Active' : 'Inactive',
      verified: status ? 'Verified' : 'Unverified',
    };

    return <span className={`${classes} ${config[type]}`}>{label[type]}</span>;
  };

  return (
    <>
      <tr className={`${rowClassName} border-b hover:bg-gray-50 transition-colors`}>
        <td className="p-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onCheckboxChange(user._id, e.target.checked)}
          />
        </td>
        <td className="p-3">
          <img
            src={user.profilePictureUrl || '/avatar.jpg'}
            alt={`${user.name}'s profile`}
            className="h-8 w-8 rounded-full object-cover"
            loading="lazy"
          />
        </td>
        <td className="p-3">{user.name}</td>
        <td className="p-3">{user.email}</td>
        <td className="p-3 capitalize">{user.role}</td>
        <td className="p-3">{renderBadge(user.isActive, 'active')}</td>
        <td className="p-3">{renderBadge(user.isVerified, 'verified')}</td>
        <td className="p-3">
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
        <td className="p-3">
          {user.createdAt
            ? dayjs(user.createdAt).format('MMM D, YYYY')
            : 'N/A'}
        </td>
        <td className="p-3 flex space-x-2">
          <UserActions user={user} onUserAction={handleUserAction} />
        </td>
      </tr>

      <EditUserModal
        isOpen={openModal === 'edit'}
        onClose={closeModal}
        user={user}
        onSave={(updatedUser) => {
          console.log('User updated:', updatedUser);
          closeModal();
        }}
      />

      <ConfirmDeleteModal
        isOpen={openModal === 'delete'}
        onClose={closeModal}
        userId={user._id}
        onDeleted={() => {
          console.log('User deleted:', user);
          closeModal();
        }}
        message={`Are you sure you want to delete ${user.name}?`}
      />

      <PromoteUserModal
        isOpen={openModal === 'promote'}
        onClose={closeModal}
        user={user}
        onPromote={() => {
          console.log('User promoted:', user);
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
          console.log('User active status toggled:', user);
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
