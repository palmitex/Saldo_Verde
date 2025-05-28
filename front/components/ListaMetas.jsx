'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function ListaMetas() {
  const [metas, setMetas] = useState([]);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      buscarMetas();
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
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/metas/usuario/${user.id}`);
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
    <div>
      <h2 className="text-xl font-semibold mb-4">Minhas Metas</h2>
      {metas.length === 0 ? (
        <p>Você ainda não tem metas cadastradas.</p>
      ) : (
        <ul className="space-y-2">
          {metas.map((meta) => (
            <li key={meta.id} className="border p-3 rounded">
              <h3 className="font-medium">{meta.nome}</h3>
              <p>R$ {meta.valor_alvo}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}