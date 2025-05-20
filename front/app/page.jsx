'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const auth = useAuth();
  const [metas, setMetas] = useState([]);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, [auth?.user]);

 

  return (
    <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
    {/* Hero Section */}
    <section className="bg-gradient-to-b from-gray-200 to-gray-300 py-16 px-4 md:px-8 lg:px-16 mb-16">
      <div className="container mx-auto flex flex-row md:flex-row items-center max-h-200px">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-6">
            Controle financeiro simplificado para sua vida
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Organize suas finanças, estabeleça metas e acompanhe seu progresso com facilidade
          </p>
          
          {!auth?.user && (
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/registro" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center">
                Comece Grátis
              </Link>
              <Link href="/login" className="bg-white text-green-600 border-2 border-green-600 hover:bg-green-500 hover:text-white hover:border-green-500 font-semibold py-3 px-6 rounded-lg transition-colors text-center">
                Já tenho uma conta
              </Link>
            </div>
          )}
        </div>
        <div className="md:w-1/2 flex justify-center">
          <div className="relative w-full max-w-lg h-80 md:h-96">
            <Image 
              src="/hero-finance.png" 
              alt="Controle financeiro" 
              layout="fill"
              objectFit="contain"
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>

    {/* Benefícios */}
    <section className="py-16 px-4 md:px-8 lg:px-16">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
          Por que escolher o SaldoVerde?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-gradient-to-b from-gray-200 to-gray-300 p-8 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-3 duration-300">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Visão clara das suas finanças</h3>
            <p className="text-gray-600">Acompanhe entradas e saídas com gráficos intuitivos e relatórios detalhados</p>
          </div>
          <div className="bg-gradient-to-b from-gray-200 to-gray-300 p-8 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-3 duration-300 border border-gray-300">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Defina e alcance metas</h3>
            <p className="text-gray-600">Estabeleça objetivos financeiros e acompanhe seu progresso em tempo real</p>
          </div>
          <div className="bg-gradient-to-b from-gray-200 to-gray-300 p-8 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-3 duration-300 border border-gray-300">
            <div className="text-5xl mb-4">📱</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Acesse de qualquer lugar</h3>
            <p className="text-gray-600">Gerencie suas finanças pelo computador ou dispositivo móvel</p>
          </div>
          <div className="bg-gradient-to-b from-gray-200 to-gray-300 p-8 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-3 duration-300 border border-gray-300">
            <div className="text-5xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Segurança em primeiro lugar</h3>
            <p className="text-gray-600">Seus dados financeiros protegidos com as mais avançadas tecnologias</p>
          </div>
        </div>
      </div>
    </section>

    {/* Como funciona */}
    <section className="py-16 px-4 md:px-8 lg:px-16 bg-gray-50 border-t border-b border-gray-300">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
          Como funciona
        </h2>
        <div className="flex flex-wrap justify-center gap-8">
          <div className="w-full sm:w-64 flex flex-col items-center">
            <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-6">
              1
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Cadastre-se gratuitamente</h3>
            <p className="text-gray-600">Crie sua conta em menos de 2 minutos</p>
          </div>
          <div className="w-full sm:w-64 flex flex-col items-center">
            <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-6">
              2
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Registre suas transações</h3>
            <p className="text-gray-600">Adicione suas receitas e despesas de forma simples</p>
          </div>
          <div className="w-full sm:w-64 flex flex-col items-center">
            <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-6">
              3
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Defina suas metas</h3>
            <p className="text-gray-600">Estabeleça objetivos financeiros realistas</p>
          </div>
          <div className="w-full sm:w-64 flex flex-col items-center">
            <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-6">
              4
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Acompanhe seu progresso</h3>
            <p className="text-gray-600">Visualize relatórios e alcance a liberdade financeira</p>
          </div>
        </div>
      </div>
    </section>

    {/* Depoimentos */}
    <section className="py-16 px-4 md:px-8 lg:px-16">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
          O que nossos usuários dizem
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-300 p-6 rounded-xl shadow-md">
            <p className="text-gray-700 italic mb-6">
              "Finalmente consegui organizar minhas finanças e economizar para realizar meus sonhos!"
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                <Image src="https://randomuser.me/api/portraits/women/44.jpg" alt="Ana Silva" width={48} height={48} />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-gray-800">Ana Silva</h4>
                <p className="text-sm text-gray-600">Usuária desde 2022</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-300 p-6 rounded-xl shadow-md">
            <p className="text-gray-700 italic mb-6">
              "A melhor plataforma para controle financeiro que já usei. Simples e completa ao mesmo tempo."
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                <Image src="https://randomuser.me/api/portraits/men/32.jpg" alt="Carlos Mendes" width={48} height={48} />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-gray-800">Carlos Mendes</h4>
                <p className="text-sm text-gray-600">Usuário desde 2021</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-300 p-6 rounded-xl shadow-md">
            <p className="text-gray-700 italic mb-6">
              "Graças ao FinanciAS consegui sair das dívidas e começar a investir. Recomendo a todos!"
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                <Image src="https://randomuser.me/api/portraits/women/68.jpg" alt="Juliana Costa" width={48} height={48} />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-gray-800">Juliana Costa</h4>
                <p className="text-sm text-gray-600">Usuária desde 2023</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* CTA Final */}
    <section className="py-16 px-4 md:px-8 lg:px-16 bg-gradient-to-br from-green-600 to-green-800 rounded-t-[50px] mt-16">
      <div className="container mx-auto text-center max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Pronto para transformar sua vida financeira?
        </h2>
        <p className="text-xl text-green-100 mb-8">
          Junte-se a milhares de pessoas que já estão no controle de suas finanças
        </p>
        {!auth?.user && (
          <Link href="/registro" className="inline-block bg-white text-green-700 hover:bg-gray-300 hover:text-green-500 font-semibold py-4 px-8 rounded-lg text-xl transition-colors">
            Começar agora
          </Link>
        )}
      </div>
    </section>
  </div>
  );
}
