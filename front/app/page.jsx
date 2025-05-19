'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

export default function Home() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth?.user) {
      router.push('/dashboard');
    }
  }, [auth?.user, router]);

  return (
    <div className="container mx-auto p-4">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">Bem-vindo ao FinanciAS</h1>
        <p className="text-xl mb-8">Sua plataforma para gerenciar finanças pessoais</p>
        
        {!auth?.user && (
          <div className="flex justify-center space-x-4">
            <Link href="/login" className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg">
              Entrar
            </Link>
            <Link href="/registro" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg">
              Criar Conta
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
