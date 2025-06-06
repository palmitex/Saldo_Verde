'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import artigos from '../../../../data/blog.js';

export default function Articles() {

    return (
        <main>
            {/* Seção de Destaque */}
            <section className="bg-[#014038] text-white px-6 py-12 md:py-20 md:px-24">
                <div className="flex gap-8 max-w-7xl mx-auto px-1">
                    <div className='mt-3'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                        </svg>
                    </div>
                    <div>
                        <h1 className='text-4xl mb-3 font-bold'>Todos os Artigos</h1>
                        <p className='text-[#ececf2] font-bold'>27 artigos</p>
                    </div>
                </div>
            </section>

            <section className="py-10 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto px-1 mt-10">
                <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto px-1">
                    {artigos.filter((artigo) => artigo.pagina === 'Página 2').map((artigo,) => {
                        return (

                            // Essa aqui seria algo como a pagina 2 trazendo as informacoes do array com o item pagina igual a Página 2
                            <Link href={`/blog/${artigo.id}`} key={artigo.id} className="bg-white rounded-xl overflow-hidden flex flex-col group shadow-md hover:shadow-lg transition">
                                <div className="relative w-full h-48">
                                    <img src={artigo.img} alt={artigo.titulo} className="w-full h-48 object-cover transform transition-transform group-hover:scale-107" />
                                </div>
                                <div className="flex flex-col gap-2 p-4">
                                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 rounded-full px-2 py-1 w-fit">
                                        {artigo.categoria}
                                    </span>
                                    <h3 className="text-2xl font-semibold text-gray-800">{artigo.titulo}</h3>
                                    <p className="text-md text-gray-600">{artigo.descricao}</p>
                                </div>
                            </Link>
                        )
                    })}
                </div>
                {/* Botoes para ir para proxima pagina ou voltar para o a pagina anterior */}
                <div className='flex justify-center mt-15 mb-15 gap-8'>
                    <Link href='/blog/Articles' className="flex items-center gap-2 bg-yellow-400 text-green-900 font-semibold px-6 py-2 rounded-lg hover:bg-yellow-300 transition h-13">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                        </svg>

                    </Link>
                    <Link href='/blog/Articles/Pagina3' className="flex items-center gap-2 bg-yellow-400 text-green-900 font-semibold px-6 py-2 rounded-lg hover:bg-yellow-300 transition h-13">
                        Página 3
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </section>




        </main>
    );
}