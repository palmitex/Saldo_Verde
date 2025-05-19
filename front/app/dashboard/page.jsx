'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function Dashboard() {
  const [metas, setMetas] = useState([]);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      buscarMetas();
      // Outras funções para buscar dados do dashboard
    }
  }, [user]);

  const buscarMetas = async () => {
    try {
      const { user } = useAuth();
      
      if (!user) {
        console.error('Usuário não autenticado');
        router.push('/login');
        return;
      }
      
      const response = await fetch(`http://localhost:3001/metas/usuario/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setMetas(data);
      } else {
        console.error('Erro ao buscar metas');
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
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
                  <p>R$ {meta.valor_alvo}</p>
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