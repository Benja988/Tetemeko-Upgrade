import { ReactNode, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl border border-gray-300 shadow-xl max-w-xl w-full p-8 relative transform transition-transform scale-100 sm:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition-colors text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        >
          &times;
        </button>

        <h2
          id="modal-title"
          className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3"
        >
          {title}
        </h2>

        <div className="text-gray-700">{children}</div>
      </div>
    </div>
  );
}
