import React, { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import Button from '@/components/Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" 
        data-testid="modal-overlay" 
        onClick={onClose} 
      />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-lg shadow-xl z-50 w-full max-w-md animate-slideIn">
        <div className="flex justify-between items-center border-b border-slate-200/50 dark:border-slate-700/50 p-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
          <Button 
            type="button" 
            className="p-1 rounded-full hover:bg-slate-100/70 dark:hover:bg-slate-700/50 transition-colors" 
            onClick={onClose}
            aria-label="Close"
          >
            <XMarkIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          </Button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </>
  );
}; 