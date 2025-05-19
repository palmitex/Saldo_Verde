'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function Dashboard() {
  const [metas, setMetas] = useState([]);
  const [erro, setErro] = useState(null);
  const { user} = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      buscarMetas();
    }
  }, [user]);

  const buscarMetas = async () => {
    try {
      if (!user) {
        setErro('Sessão expirada. Por favor, faça login novamente.');
        router.push('/login');
        return;
      }
      
      const response = await fetch(`http://localhost:3001/metas/usuario/${user.id}`, {
        headers: {
          'Content-Type': 'application/json',
          'userId': user.id
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success' && Array.isArray(data.data)) {
          setMetas(data.data);
          setErro(null);
        } else {
          setErro('Não foi possível carregar suas metas. Por favor, tente novamente mais tarde.');
        }
      } else {
        const errorData = await response.json().catch(() => null);
        setErro(errorData?.message || 'Não foi possível carregar suas metas. Por favor, tente novamente mais tarde.');
      }
    } catch (error) {
      setErro('Não foi possível conectar ao servidor. Por favor, verifique sua conexão e tente novamente.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {erro && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative" role="alert">
          <span className="block sm:inline">{erro}</span>
          <button 
            onClick={() => setErro(null)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <span className="sr-only">Fechar</span>
            <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Minhas Metas</h2>
          {metas.length === 0 ? (
            <p>Você ainda não tem metas cadastradas.</p>
          ) : (
            <ul className="space-y-2">
              {metas.slice(0, 3).map((meta) => (
                <li key={meta.id} className="border-b pb-2">
                  <p className="font-medium">{meta.nome}</p>
                  <p>R$ {meta.valor_objetivo}</p>
                </li>
              ))}
              {metas.length > 3 && (
                <li>
                  <button 
                    onClick={() => router.push('/metas')}
                    className="text-blue-500 hover:underline"
                  >
                    Ver todas as metas
                  </button>
                </li>
              )}
            </ul>
          )}
        </div>
        
        {/* Outros componentes do dashboard */}
      </div>
    </div>
  );
}