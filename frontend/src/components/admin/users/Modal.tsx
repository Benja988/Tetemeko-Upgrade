'use client';

import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white rounded-xl border border-gray-200 shadow-2xl max-w-2xl w-full p-8
                   transform transition-transform duration-300 ease-out
                   scale-100 sm:p-10"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        {title && (
          <header className="flex items-center justify-between mb-6">
            <h2
              id="modal-title"
              className="text-2xl font-semibold text-gray-900"
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="text-gray-400 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </header>
        )}

        <div>{children}</div>
      </div>
    </div>,
    document.body
  );
}
