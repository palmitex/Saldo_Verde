'use client';

import artigos from '../../data/blog.js';
import Link from 'next/link';

export default function Blog() {
    return (
        <main>
            {/* Seção de Destaque */}
            <section className="bg-[#014038] text-white px-6 py-12 md:py-20 md:px-24">
                <div className="flex flex-col md:flex-row items-center justify-between gap-10 max-w-7xl mx-auto px-1">
                    <div className="w-full md:w-1/2 max-w-7xl mx-auto px-1">
                        <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight font-size-20">
                            Como Funciona o Pix por Aproximação?
                        </h1>
                        <p className="text-base md:text-lg text-white/80 mb-6">
                            Entenda o que é Pix por aproximação, suas características e como utilizar no cotidiano.
                        </p>
                    </div>

                    <div className="w-full md:w-1/2 relative">
                        <div className=" w-200 h-100 relative z-10 w-full h-64 md:h-80 rounded-xl overflow-hidden shadow-lg ">
                            <img src="/ImagemTeste.png" alt="Pix por Aproximação" className='w-200 h-100 object-cover' />
                        </div>

                        <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-yellow-400 rounded-full z-0 opacity-70 hidden md:block" />
                        <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-yellow-400 rounded-full z-0 opacity-70 hidden md:block" />
                    </div>
                </div>
            </section>

            <section className="py-10 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto px-1">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold">Últimos artigos</h2>
                    <a href="#" className="text-sm text-yellow-600 hover:underline font-medium"> Ver Todos →</a>
                </div>

                <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto px-1">
                    {artigos.map((artigo) => {
                        return (

                            <Link href={`/blog/${artigo.id}`} key={artigo.id} className="w-88 bg-white rounded-xl rounded-b-lg overflow-hidden hover: transition flex flex-col group" >

                                <div className="relative w-full h-48">
                                    <img src={artigo.img} alt={artigo.titulo} className='w-full h-48 rounded-b-lg transform transition-transform hover:scale-105 object-cover' />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 rounded-full px-2 py-1 w-fit mt-3">
                                        {artigo.categoria}
                                    </span>
                                    <h3 className="text-2xl font-semibold text-gray-800">{artigo.titulo}</h3>
                                    <p className="text-base text-gray-600 mb-3">{artigo.descricao}</p>
                                </div>
                            </Link>
                        )

                    })}
                </div>
            </section>
        </main >
    );
}
