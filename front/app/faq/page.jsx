"use client";
import { useState } from 'react';
import faqs from '../../data/faq.js';
import './faq.css';

export default function Faq() {
    const [expandedFaq, setExpandedFaq] = useState(null);

    const toggleFaq = (id) => {
        setExpandedFaq(expandedFaq === id ? null : id);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            {/* Background */}
            <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-green-50 to-emerald-50 -z-10 opacity-70"></div>
            <div className="absolute top-40 right-10 w-32 h-32 rounded-full bg-green-100 blur-3xl -z-10 opacity-40"></div>
            <div className="absolute bottom-20 left-10 w-40 h-40 rounded-full bg-emerald-100 blur-3xl -z-10 opacity-40"></div>
            
            <main className="max-w-5xl mx-auto mt-8 mb-20 relative z-10">
                {/* Header */}
                <div className="text-center mb-16 relative">
                    <h1 className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#3A7D44] to-[#55c065] mb-4 animate-fade-in-down">
                        Perguntas Frequentes
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-[#3A7D44] to-[#55c065] mx-auto rounded-full"></div>
                    <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
                        Encontre respostas para as dúvidas mais comuns sobre finanças pessoais e como usar nossa plataforma.
                    </p>
                </div>

                {/* FAQ */}
                <section className="rounded-3xl bg-white shadow-xl border border-gray-100 overflow-hidden">
                    <div className="divide-y divide-gray-100">
                        {faqs.map((faq, index) => (
                            <div 
                                key={faq.id}
                                className={`transition-all duration-300 ${index === 0 ? 'rounded-t-3xl' : ''} ${index === faqs.length - 1 ? 'rounded-b-3xl' : ''}`}
                            >
                                <button
                                    onClick={() => toggleFaq(faq.id)}
                                    className={`w-full px-8 py-6 sm:px-10 sm:py-8 flex justify-between items-center text-left transition-all duration-300 ${expandedFaq === faq.id ? 'bg-gradient-to-r from-green-50 to-emerald-50' : 'hover:bg-gray-50'}`}
                                >
                                    <h3 className={`text-xl sm:text-2xl font-semibold transition-all duration-300 ${expandedFaq === faq.id ? 'text-[#3A7D44]' : 'text-gray-800'}`}>
                                        {faq.titulo}
                                    </h3>
                                    <div className={`transition-transform duration-300 ml-4 flex-shrink-0 ${expandedFaq === faq.id ? 'rotate-180' : ''}`}>
                                        <svg className="w-6 h-6 text-[#55c065]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </div>
                                </button>
                                
                                <div 
                                    className={`overflow-hidden transition-all duration-300 px-8 sm:px-10 bg-white ${expandedFaq === faq.id ? 'max-h-96 pb-8' : 'max-h-0'}`}
                                >
                                    <p className="text-gray-600 text-lg leading-relaxed">
                                        {faq.texto}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Seção de ajuda */}
                <div className="mt-16 bg-gradient-to-r from-[#3A7D44] to-[#55c065] rounded-2xl p-8 sm:p-10 text-white shadow-lg transform transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Ainda tem dúvidas?</h2>
                            <p className="text-green-50">Nossa equipe está pronta para ajudar você com qualquer pergunta.</p>
                        </div>
                        <button className="px-6 py-3 bg-white text-[#3A7D44] rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 whitespace-nowrap flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                           <a href="/contato">Contatar suporte</a>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
