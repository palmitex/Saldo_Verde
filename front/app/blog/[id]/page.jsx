'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import artigos from '../../../data/blog';

export default function ArtigoPage(promiseParams) {
  const { id } = use(promiseParams.params);
  const artigo = artigos.find((item) => item.id.toString() === id);

  if (!artigo) return notFound();

  return (
    <main>
      <section className="bg-[#014038] text-white px-6 py-12 md:py-20 md:px-24">
        <div className="max-w-5xl mx-auto">
          {/* Categorias */}
          <div className="flex gap-2 mb-4">
            <span className="bg-black/60 text-white text-xs font-semibold px-7 py-2 rounded-full">
              {artigo.categoria}
            </span>
          </div>

          {/* Título */}
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            {artigo.titulo}
          </h1>

          {/* Descrição */}
          <p className="text-white/80 text-lg mb-6 max-w-3xl">
            {artigo.descricao}
          </p>

          {/* Data e Tempo de Leitura */}
          <div className="flex items-center text-sm text-white/70 gap-6">
            <div className="flex items-center gap-2">
              {/* Ícone de calendário */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10m-2 5H8m-4 6h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v13a2 2 0 002 2z" />
              </svg>
              <span>{artigo.data}</span>
            </div>

            <div className='flex items-center gap-2'>
            <hr className="block my-2 mx-auto overflow-hidden border-inset border border-gray-400 h-3" />
            </div>

            <div className="flex items-center gap-2">
              {/* Ícone de relógio */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{artigo.tempoLeitura}</span>
            </div>
          </div>

          <img src={artigo.img} alt={artigo.titulo} className='my-6 rounded-lg w-full h-140 object-cover max-w-7xl mx-auto'></img>
        </div>
      </section>
    </main>
  );
}
