'use client';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log do erro para análise futura
    console.error('Erro na aplicação:', error);
  }, [error]);

  // Verificar se é um erro 404
  const is404 = error?.digest?.includes('NEXT_NOT_FOUND') || 
               error?.message?.includes('not found') || 
               error?.statusCode === 404;

  if (is404) {
    // Se for erro 404, redireciona para a página not-found
    window.location.href = '/not-found';
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-60 flex items-center justify-center p-5">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="h-2 w-full bg-gradient-to-r from-red-500 to-orange-400 relative">
          <div className="absolute inset-0 bg-white opacity-30 shine-effect"></div>
        </div>
        
        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center mb-8">
            <div className="bg-red-50 p-5 rounded-full mb-6 md:mb-0 md:mr-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">Ops! Ocorreu um erro</h1>
              <div className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-400">
                <p className="text-2xl font-semibold">Erro na aplicação</p>
              </div>
            </div>
          </div>
          
          <p className="text-gray-600 text-lg mb-8 text-center md:text-left">
            Desculpe pelo transtorno, encontramos um problema inesperado. Nossa equipe já foi notificada.
          </p>
          
          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-xl border border-red-100">
              <h3 className="font-medium text-red-800 mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                O que você pode fazer?
              </h3>
              <ul className="text-red-700 ml-8 list-disc space-y-1">
                <li>Recarregar a página e tentar novamente</li>
                <li>Verificar sua conexão com a internet</li>
                <li>Voltar para a página inicial</li>
              </ul>
            </div>
            
            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
              <button 
                onClick={reset}
                className="flex-1 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl shadow-md hover:shadow-lg hover:shadow-red-200 transition-all duration-300 flex items-center justify-center transform hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Tentar novamente
              </button>
              
              <Link href="/" className="flex-1">
                <button className="w-full py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center transform hover:scale-105">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Página inicial
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 