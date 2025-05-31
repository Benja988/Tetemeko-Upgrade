// components/ConfirmDeleteModal.tsx
import { useState } from 'react';
import { deleteUser } from '@/services/users';
import Modal from './Modal';
import { toast } from 'sonner';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onDeleted?: () => void; // Optional callback after successful deletion
  message?: string;
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  userId,
  onDeleted,
  message,
}: ConfirmDeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      const success = await deleteUser(userId);
      if (success) {
        toast.success('User deleted successfully');
        onDeleted?.();
        onClose();
      } else {
        toast.error('Failed to delete user');
      }
    } catch (error) {
      toast.error('An error occurred while deleting');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Delete">
      <p className="mb-4">
        {message || 'Are you sure you want to delete this user?'}
      </p>
      <div className="flex justify-end space-x-2">
        <button
          onClick={onClose}
          disabled={isDeleting}
          className="px-4 py-2 rounded border hover:bg-gray-100 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          disabled={isDeleting}
          className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </Modal>
  );
}
