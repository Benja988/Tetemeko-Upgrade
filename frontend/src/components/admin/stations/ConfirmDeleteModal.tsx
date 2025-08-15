'use client';

import { useState } from 'react';
import Modal from './Modal';
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  count: number;
  itemName?: string;
  warningMessage?: string;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  count,
  itemName = 'station',
  warningMessage = 'This action cannot be undone.',
}: ConfirmDeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Deletion failed:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Confirm Deletion"
      size="sm"
      closeOnOutsideClick={!isDeleting}
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex-shrink-0">
            <Trash2 className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-gray-700">
            Are you sure you want to delete{' '}
            <strong className="text-red-600">{count} {itemName}{count > 1 ? 's' : ''}</strong>?
            {warningMessage && (
              <>
                <br />
                <span className="text-yellow-600">{warningMessage}</span>
              </>
            )}
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[100px]"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}