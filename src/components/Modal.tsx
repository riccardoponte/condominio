import React, { ReactNode } from 'react';
import { XMarkIcon } from './Icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    React.createElement('div', { className: "fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4" },
      React.createElement('div', { className: "bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all" },
        React.createElement('div', { className: "flex items-center justify-between mb-4" },
          React.createElement('h3', { className: "text-xl font-semibold text-condo-dark-text" }, title),
          React.createElement('button', {
            onClick: onClose,
            className: "text-slate-500 hover:text-slate-700 transition-colors",
            'aria-label': "Chiudi modale"
          }, React.createElement(XMarkIcon, { className: "w-6 h-6" }))
        ),
        React.createElement('div', null, children)
      )
    )
  );
};
