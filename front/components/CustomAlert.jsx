'use client';

import { useEffect } from 'react';

export default function CustomAlert({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  type = 'info',
  showConfirmButton = true,
  confirmText = 'Sim',
  confirmDisabled = false,
  cancelText = 'Não'
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getIconByType = () => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default: // info
        return (
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getColorsByType = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-500',
          button: 'bg-green-600 hover:bg-green-700',
          text: 'text-green-800'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-500',
          button: 'bg-yellow-600 hover:bg-yellow-700',
          text: 'text-yellow-800'
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-500',
          button: 'bg-red-600 hover:bg-red-700',
          text: 'text-red-800'
        };
      default: // info
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-500',
          button: 'bg-blue-600 hover:bg-blue-700',
          text: 'text-blue-800'
        };
    }
  };

  const colors = getColorsByType();

  return (
    <>
      <div className="fixed inset-0 bg-black/70 z-40" onClick={onClose}></div>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center">
        <div className="flex min-h-full items-center justify-center p-4 text-center w-full">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full max-w-lg mx-auto">
            <div className={`${colors.bg} px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-t-4 ${colors.border}`}>
              <div className="sm:flex sm:items-start">
                <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${colors.bg} sm:mx-0 sm:h-10 sm:w-10`}>
                  {getIconByType()}
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    {title}
                  </h3>
                  <div className="mt-2">
                    {typeof message === 'string' ? (
                      <p className="text-sm text-gray-500">{message}</p>
                    ) : (
                      message
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              {showConfirmButton && (
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={confirmDisabled}
                  className={`inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm ${colors.button} focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${confirmDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {confirmText}
                </button>
              )}
              {cancelText && (
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {cancelText}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}