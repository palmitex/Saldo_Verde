'use client';

import { useState } from 'react';
import artigos from '../../data/blog.js';
import Link from 'next/link';
import {
  Filter,
  DollarSign,
  Briefcase,
  Rocket,
  ShoppingCart,
  Calendar,
  Cpu
} from 'lucide-react';

const filters = [
  { nome: 'Todos', icone: Filter },
  { nome: 'Finanças', icone: DollarSign },
  { nome: 'Salário', icone: Briefcase },
  { nome: 'Empreendedorismo', icone: Rocket },
  { nome: 'Vendas', icone: ShoppingCart },
  { nome: 'Planejamento', icone: Calendar },
  { nome: 'Tecnologia', icone: Cpu }
];

export default function Blog() {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Todos');

  const artigosFiltrados = artigos
    .filter(artigo =>
      categoriaSelecionada === 'Todos' || artigo.categoria?.includes(categoriaSelecionada)
    )
    .slice(0, 5);

  const artigoDestaque = artigosFiltrados.find(a => a.featured);
  const artigosSecundarios = artigosFiltrados.filter(a => !a.featured);

  return (
    <main>
      {/* Seção de Destaque */}
      <section className="bg-[#014038] text-white px-6 py-12 md:py-20 md:px-24">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 max-w-7xl mx-auto">
          <div className="w-full md:w-1/2">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              Seja Muito Bem-vindo Ao Nosso Blog!!
            </h1>
            <p className="text-base md:text-lg text-white/80 mb-6">
              Esse blog foi feito especialmente para adolescentes curiosos, que querem entender melhor o mundo real — sem enrolação e com uma linguagem jovem e direta. Aqui, você vai descobrir assuntos que quase ninguém te ensina na escola: como funciona o Imposto de Renda, o que é o CPF, como cuidar do dinheiro, se preparar para o primeiro emprego, entender seus direitos e deveres e muito mais.
            </p>
          </div>

          <div className="w-full md:w-1/2 relative">
            <div className="relative z-10 w-full h-64 md:h-80 rounded-xl overflow-hidden shadow-lg">
              <img src="/ImagemTeste.png" alt="Pix por Aproximação" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-yellow-400 rounded-full z-0 opacity-70 hidden md:block" />
            <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-yellow-400 rounded-full z-0 opacity-70 hidden md:block" />
          </div>
        </div>
      </section>

      {/* Seção de artigos filtrados */}
      <section className='py-10 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto'>
        <h2 className="text-3xl font-bold mb-6">Veja nossos artigos mais lidos</h2>

        <div className="flex gap-6 mb-8 flex-wrap">
          {filters.map(({ nome, icone: Icon }) => (
            <button
              key={nome}
              onClick={() => setCategoriaSelecionada(nome)}
              className={`flex items-center gap-2 pb-2 border-b-2 transition-all ${
                categoriaSelecionada === nome
                  ? 'text-black border-yellow-500'
                  : 'text-gray-600 border-transparent hover:text-black hover:border-yellow-500'
              }`}
            >
              <Icon size={16}  />
              {nome}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {artigoDestaque && (
            <Link href={`/blog/${artigoDestaque.id}`} className="rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition">
              <img src={artigoDestaque.img} alt={artigoDestaque.titulo} className="w-full h-64 object-cover transition-transform group-hover:scale-107" />
              <div className="p-4">
                <div className="flex items-center gap-2 text-sm text-blue-600 mb-1">
                  <span className="text-xs font-semibold text-gray-500 bg-gray-100 rounded-full px-2 py-1 w-fit">
                    {artigoDestaque.categoria}
                  </span>
                </div>
                <h3 className="text-xl font-semibold">{artigoDestaque.titulo}</h3>
                <p className="text-gray-600 mt-1">{artigoDestaque.descricao}</p>
              </div>
            </Link>
          )}

          {/* Lista de artigos (máx 4 restantes) */}
          <div className="flex flex-col gap-4">
            {artigosSecundarios.map((artigo) => (
              <Link href={`/blog/${artigo.id}`} key={artigo.id} className="flex gap-4 shadow-sm hover:shadow-lg transition">
                <div className="w-24 h-24 flex-shrink-0 rounded-md overflow-hidden">
                  <img src={artigo.img} alt={artigo.titulo} className="w-full h-full object-cover " />
                </div>
                <div className="flex flex-col justify-between">
                  <div className="flex gap-2 text-sm mb-1">
                    {(artigo.categoria?.split(', ') || []).map(cat => (
                      <span key={cat} className="text-xs font-semibold text-gray-500 bg-gray-100 rounded-full px-2 py-1 w-fit">{cat}</span>
                    ))}
                  </div>
                  <h2 className="font-semibold text-gray-900 mb-7">{artigo.titulo}</h2>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Últimos artigos */}
      <section className="py-10 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Últimos artigos</h2>
          <Link href="/blog/Articles" className="text-green-600 hover:text-yellow-300 transition-colors duration-300">Ver Todos →</Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {artigos.filter((artigo) => artigo.pagina === 'Página 1').map((artigo) => (
            <Link href={`/blog/${artigo.id}`} key={artigo.id} className="bg-white rounded-xl overflow-hidden flex flex-col group shadow-md hover:shadow-lg transition">
              <div className="relative w-full h-48">
                <img src={artigo.img} alt={artigo.titulo} className="w-full h-48 object-cover transform transition-transform group-hover:scale-107" />
              </div>
              <div className="flex flex-col gap-2 p-4">
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 rounded-full px-2 py-1 w-fit">
                  {artigo.categoria}
                </span>
                <h3 className="text-2xl font-semibold text-gray-800">{artigo.titulo}</h3>
                <p className="text-medium text-gray-600">{artigo.descricao}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
