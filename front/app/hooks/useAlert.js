'use client';

import { useState, useCallback } from 'react';

export default function useAlert() {
  const [alert, setAlert] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: () => {},
    showConfirmButton: true,
    confirmText: 'Sim',
    cancelText: 'Não'
  });

  const showAlert = useCallback(({
    title,
    message,
    type = 'info',
    onConfirm = () => {},
    showConfirmButton = true,
    confirmText = 'Sim',
    cancelText = 'Não'
  }) => {
    setAlert({
      isOpen: true,
      title,
      message,
      type,
      onConfirm,
      showConfirmButton,
      confirmText,
      cancelText
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlert(prev => ({
      ...prev,
      isOpen: false
    }));
  }, []);

  const confirm = useCallback((title, message, onConfirm) => {
    showAlert({
      title,
      message,
      type: 'warning',
      onConfirm,
      showConfirmButton: true
    });
  }, [showAlert]);

  const success = useCallback((title, message) => {
    showAlert({
      title,
      message,
      type: 'success',
      showConfirmButton: false,
      confirmText: 'OK'
    });
  }, [showAlert]);

  const error = useCallback((title, message) => {
    showAlert({
      title,
      message,
      type: 'error',
      showConfirmButton: false,
      confirmText: 'OK'
    });
  }, [showAlert]);

  const info = useCallback((title, message) => {
    showAlert({
      title,
      message,
      type: 'info',
      showConfirmButton: false,
      confirmText: 'OK'
    });
  }, [showAlert]);

  return {
    alert,
    showAlert,
    hideAlert,
    confirm,
    success,
    error,
    info
  };
} 