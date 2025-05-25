interface ExportUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
}

export const ExportUsersModal: React.FC<ExportUsersModalProps> = ({ isOpen, onClose, onExport }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-md w-full max-w-sm">
        <div className="px-4 py-3 border-b font-semibold text-lg">Export Users</div>
        <div className="p-4 text-sm text-gray-700">
          Are you sure you want to export the current list of users?
        </div>
        <div className="flex justify-end p-4 border-t gap-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 hover:underline">Cancel</button>
          <button onClick={() => { onExport(); onClose(); }} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Export
          </button>
        </div>
      </div>
    </div>
  );
};
