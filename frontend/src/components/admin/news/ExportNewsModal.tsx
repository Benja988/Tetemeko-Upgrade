'use client';

interface ExportNewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
}

export function ExportNewsModal({ isOpen, onClose, onExport }: ExportNewsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold text-center">Export News</h2>
        <p className="text-center">Choose your preferred export option.</p>

        <div className="flex justify-center gap-6">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onExport();
              onClose();
            }}
            className="px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
}
