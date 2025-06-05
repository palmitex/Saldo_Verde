'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const [animateIn, setAnimateIn] = useState(false);
  
  useEffect(() => {
    setAnimateIn(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-60 flex items-center justify-center p-5">
      <div className={`max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-700 transform ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="h-2 w-full bg-gradient-to-r from-green-600 to-green-400 relative">
          <div className="absolute inset-0 bg-white opacity-30 shine-effect"></div>
        </div>
        
        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center mb-8">
            <div className="bg-green-50 p-5 rounded-full mb-6 md:mb-0 md:mr-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">Página não encontrada</h1>
              <div className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400">
                <p className="text-2xl font-semibold">Erro 404</p>
              </div>
            </div>
          </div>
          
          <p className="text-gray-600 text-lg mb-8 text-center md:text-left">
            Desculpe, a página que você está procurando não existe ou foi movida.
          </p>
          
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
              <h3 className="font-medium text-green-800 mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                O que pode ter acontecido?
              </h3>
              <ul className="text-green-700 ml-8 list-disc space-y-1">
                <li>O link que você clicou pode estar quebrado</li>
                <li>A página pode ter sido removida ou renomeada</li>
                <li>Você pode ter digitado o endereço incorretamente</li>
              </ul>
            </div>
            
            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
              <Link href="/" className="flex-1">
                <button className="w-full py-3 bg-gradient-to-r from-green-700 to-green-500 text-white rounded-xl shadow-md hover:shadow-lg hover:shadow-green-200 transition-all duration-300 flex items-center justify-center transform hover:scale-105">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Voltar para a página inicial
                </button>
              </Link>
              
              <button 
                onClick={() => window.history.back()}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center transform hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                </svg>
                Voltar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 