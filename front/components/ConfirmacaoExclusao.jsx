'use client';

import { useState } from 'react';
import CustomAlert from './CustomAlert';

export default function ConfirmacaoExclusao({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Excluir Conta',
  message = 'Esta ação não pode ser desfeita e todos os seus dados serão removidos permanentemente.'
}) {
  const [confirmacaoTexto, setConfirmacaoTexto] = useState('');
  
  const handleConfirm = () => {
    if (confirmacaoTexto === 'Deletar conta') {
      onConfirm();
    }
  };
  
  return (
    <CustomAlert
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title={title}
      message={
        <div className="space-y-4">
          <p>{message}</p>
          <div className="mt-4">
            <label htmlFor="confirmacao" className="block text-sm font-medium text-gray-700 mb-1">
              Para confirmar, digite "Deletar conta":
            </label>
            <input
              type="text"
              id="confirmacao"
              value={confirmacaoTexto}
              onChange={(e) => setConfirmacaoTexto(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-sm"
              placeholder="Deletar conta"
            />
          </div>
        </div>
      }
      type="warning"
      confirmDisabled={confirmacaoTexto !== 'Deletar conta'}
      showConfirmButton={true}
      confirmText="Sim, excluir conta"
      cancelText="Não, manter conta"
    />
  );
}