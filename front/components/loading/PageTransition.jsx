"use client";
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Loading from './Loading';

export default function PageTransition({ children }) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [prevPathname, setPrevPathname] = useState('');


  const financeRoutes = [
    '/financias',
    '/transacoes',
    '/metas',
    '/analise',
    '/categorias'
  ];

  // Verifica se o caminho atual está relacionado a finanças
  const isFinanceRoute = () => {
    return financeRoutes.some(route => pathname.startsWith(route));
  };

  useEffect(() => {
    // Se o caminho mudou e não é uma rota de finanças, mostrar o loading
    if (prevPathname !== pathname && prevPathname !== '' && !isFinanceRoute()) {
      setIsLoading(true);
      
      // Simular um tempo de carregamento (pode ser ajustado)
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1500); // 1.5 segundos de loading
      
      return () => clearTimeout(timer);
    }
    
    // Atualizar o pathname anterior
    setPrevPathname(pathname);
  }, [pathname, prevPathname]);

  return (
    <>
      {isLoading && <Loading />}
      <div style={{ visibility: isLoading ? 'hidden' : 'visible' }}>
        {children}
      </div>
    </>
  );
}