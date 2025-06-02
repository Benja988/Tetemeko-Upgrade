import React from 'react';
import { X } from 'lucide-react'; // or use Heroicons / custom SVG

interface ModalProps extends React.PropsWithChildren<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
}> {}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-800 dark:hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Modal Title */}
        <h2 className="text-2xl font-bold mb-4">{title}</h2>

        {/* Modal Content */}
        <div className="space-y-4">
          {children}
        </div>

        {/* Optional Footer or Button Group */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 rounded-md transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
