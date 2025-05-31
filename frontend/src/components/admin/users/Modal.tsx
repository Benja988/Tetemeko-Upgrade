'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Focus modal on open
      setTimeout(() => {
        modalRef.current?.focus();
      }, 0);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close modal on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby={title ? 'modal-title' : undefined}
      tabIndex={-1}
    >
      <div
        className="bg-white rounded-2xl border border-gray-200 shadow-xl max-w-3xl w-full p-8 sm:p-10
                   transform transition-transform duration-300 ease-out scale-100
                   focus:outline-none focus:ring-4 focus:ring-blue-400"
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
        tabIndex={0} // make div focusable for accessibility
      >
        {title && (
          <header className="flex items-center justify-between mb-8">
            <h2
              id="modal-title"
              className="text-3xl font-semibold text-gray-900"
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="text-gray-400 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
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
