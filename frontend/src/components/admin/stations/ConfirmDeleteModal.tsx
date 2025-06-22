// components/modals/ConfirmDeleteModal.tsx
import Modal from "./Modal";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  count: number;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  count,
}: ConfirmDeleteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Deletion">
      <p className="mb-6 text-sm text-gray-700">
        Are you sure you want to delete{" "}
        <strong className="text-red-600">{count}</strong> station
        {count > 1 && "s"}? This action cannot be undone.
      </p>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={async () => {
            await onConfirm();
            onClose();
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Confirm
        </button>
      </div>
    </Modal>
  );
}
