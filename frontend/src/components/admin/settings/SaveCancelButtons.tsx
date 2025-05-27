'use client';

interface SaveCancelButtonsProps {
  onSave: () => void;
  onCancel: () => void;
}

export default function SaveCancelButtons({ onSave, onCancel }: SaveCancelButtonsProps) {
  return (
    <div className="flex justify-end gap-3 mt-8">
      <button
        onClick={onCancel}
        className="px-5 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md"
      >
        Cancel
      </button>
      <button
        onClick={onSave}
        className="px-5 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
      >
        Save Changes
      </button>
    </div>
  );
}
