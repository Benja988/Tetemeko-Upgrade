'use client';

import { useEffect, ReactNode, useCallback, useRef } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  closeOnOutsideClick?: boolean;
  showCloseButton?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOutsideClick = true,
  showCloseButton = true,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);

  // Lock body scroll and remember last focused element
  useEffect(() => {
    if (isOpen) {
      lastFocusedElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = '';
        lastFocusedElement.current?.focus();
      };
    }
  }, [isOpen]);

  // Handle ESC key to close modal
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  // Focus trap
  const handleTabKey = useCallback((e: KeyboardEvent) => {
    if (!modalRef.current || e.key !== 'Tab') return;

    const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    } else if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    }
  }, []);

  // Set up event listeners
  useEffect(() => {
    if (!isOpen) return;

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keydown', handleTabKey);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen, handleKeyDown, handleTabKey]);

  // Focus first element when modal opens
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={closeOnOutsideClick ? onClose : undefined}
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />

      {/* Modal container */}
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className={`relative bg-white w-full rounded-xl shadow-xl transform transition-all ${sizeClasses[size]}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2
            id="modal-title"
            className="text-xl font-semibold text-gray-900"
          >
            {title}
          </h2>

          {showCloseButton && (
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="text-gray-400 hover:text-gray-700 rounded-full p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 text-gray-700 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}