// components/modals/ConfirmDeleteModal.tsx
import Modal from "./Modal";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  count: number;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  count,
}: ConfirmDeleteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Delete">
      <p className="mb-4">
        Are you sure you want to delete <strong>{count}</strong> station(s)?
      </p>
      <div className="flex justify-end space-x-4">
        <button
          onClick={onClose}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Confirm
        </button>
      </div>
    </Modal>
  );
}
