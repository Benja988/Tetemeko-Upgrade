'use client';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  authorIds: string[];
  authorNames: string[];
  onDeleted: () => void;
  message?: string;
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  authorIds,
  authorNames,
  onDeleted,
  message,
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-md shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-red-600 mb-4">Confirm Delete</h2>
        <p className="text-sm mb-4">{message}</p>
        <ul className="text-xs text-gray-600 mb-4 max-h-24 overflow-y-auto">
          {authorNames.map((name) => (
            <li key={name}>• {name}</li>
          ))}
        </ul>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onDeleted}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
