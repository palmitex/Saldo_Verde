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
      {/* Banner */}
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

      <section className='max-w-5xl mx-auto mt-20 mb-20'>
        <div className=''>
          <p className='text-lg mb-10'>{artigo.paragrafo1}</p>
          
          <h1 className='text-2xl mb-4 font-bold'>{artigo.titulo1}</h1>
          <p className='text-lg mb-4'>{artigo.paragrafo2}</p>
          <p className='text-lg mb-4'>{artigo.paragrafo3}</p>
          <div className='flex gap-10'>
            <img className='w-120 h-auto mb-4 rounded-lg' src={artigo.img7}></img>
            <img className='w-120 h-auto mb-4 rounded-lg' src={artigo.img8}></img>
          </div>

          <h1 className='text-2xl mb-4 font-bold'>{artigo.titulo2}</h1>
          <p className='text-lg mb-4'>{artigo.paragrafo4}</p>
          <img className='w-220 h-auto mb-8' src={artigo.img6}></img>

          <h1 className='text-2xl mb-4 font-bold'>{artigo.titulo3}</h1>
          <p className='text-lg mb-4'>{artigo.paragrafo5}</p>
          <p className='text-lg mb-4'>{artigo.paragrafo6}</p>

          <h1 className='text-2xl mb-4 font-bold'>{artigo.titulo4}</h1>
          <p className='text-lg mb-4'>{artigo.paragrafo7}</p>
          <img className='w-220 h-auto mb-4' src={artigo.img2}></img>

          <h1 className='text-2xl mb-4 font-bold'>{artigo.titulo5}</h1>
          <p className='text-lg mb-4'>{artigo.paragrafo8}</p>
          <p className='text-lg mb-4'>{artigo.paragrafo9}</p>
          <img className='w-220 h-auto mb-4' src={artigo.img3}></img>

          <h1 className='text-2xl mb-5 font-bold'>{artigo.titulo6}</h1>
          <p className='text-lg mb-4'>{artigo.paragrafo10}</p>
          <img className='w-220 h-auto mb-4 rounded-lg' src={artigo.img4}></img>
          <img className='w-220 h-auto mb-4 rounded-lg' src={artigo.img5}></img>

          <h1 className='text-2xl mb-4 font-bold'>{artigo.titulo7}</h1>
          <p className='text-lg mb-4'>{artigo.paragrafo11}</p>
          <p className='text-lg mb-5'>{artigo.paragrafo12}</p>

          <h1 className='text-2xl mb-4 font-bold'>{artigo.titulo8}</h1>
          <p className='text-lg mb-4'>{artigo.paragrafo13}</p>
          <p className='text-lg mb-4'>{artigo.paragrafo14}</p>
          <p className='text-lg mb-5'>{artigo.paragrafo15}</p>
          <img className='w-200 h-auto mb-4 rounded-lg' src={artigo.img9}></img>

          <h1 className='text-2xl mb-4 font-bold'>{artigo.titulo9}</h1>
          <p className='text-lg mb-4'>{artigo.paragrafo16}</p>
          <p className='text-lg mb-4'>{artigo.paragrafo17}</p>
          <p className='text-lg mb-8'>{artigo.paragrafo18}</p>
          <img className='w-200 h-auto mb-4 rounded-lg' src={artigo.img10}></img>

          <h1 className='text-2xl mb-4 font-bold'>{artigo.titulo10}</h1>
          <p className='text-lg mb-4'>{artigo.paragrafo19}</p>

          <h1 className='text-2xl mb-4 font-bold'>{artigo.titulo11}</h1>
          <p className='text-lg mb-4'>{artigo.paragrafo20}</p>

        </div>

      </section>
    </main>
  );
}
