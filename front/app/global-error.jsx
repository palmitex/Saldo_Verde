'use client';
import { useEffect } from 'react';

export default function GlobalError({ error }) {
  useEffect(() => {
    // Log do erro para análise futura
    console.error('Erro global na aplicação:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-60 flex items-center justify-center p-5">
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="h-2 w-full bg-gradient-to-r from-red-500 to-orange-400 relative"></div>
            
            <div className="p-8 md:p-12">
              <div className="flex flex-col items-center mb-8">
                <div className="bg-red-50 p-5 rounded-full mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">Erro Fatal</h1>
                  <p className="text-2xl font-semibold text-red-500">Algo deu muito errado</p>
                </div>
              </div>
              
              <p className="text-gray-600 text-lg mb-8 text-center">
                Ocorreu um erro crítico na aplicação. Por favor, tente recarregar a página ou volte mais tarde.
              </p>
              
              <div className="flex justify-center">
                <button 
                  onClick={() => window.location.href = '/'}
                  className="py-3 px-8 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Voltar para a página inicial
                </button>
              </div>
            </div>
            
            <div className="p-5 bg-gray-50 border-t border-gray-100 text-center text-gray-500 text-sm">
              Caso o problema persista, entre em contato com nossa equipe de suporte
            </div>
          </div>
        </div>
      </body>
    </html>
  );
} 