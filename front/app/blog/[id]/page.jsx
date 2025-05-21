// app/blog/[id]/page.jsx
'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import artigos from '../../../data/blog';

export default function ArtigoPage(promiseParams) {
  const { id } = use(promiseParams.params); // <- corrigido aqui

  const artigo = artigos.find((item) => item.id.toString() === id);

  if (!artigo) return notFound();

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-4">{artigo.titulo}</h1>
      <span className="text-sm text-gray-500">{artigo.categoria}</span>
      <img src={artigo.img} alt={artigo.titulo} className="my-6 rounded-lg w-full h-64 object-cover"/>
      <p className="text-lg text-gray-700">{artigo.descricao}</p>
    </main>
  );
}
