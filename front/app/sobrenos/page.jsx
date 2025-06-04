"use client";
import { useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import sobres from '../../data/sobre.js';
import './sobrenos.css';

export default function Sobrenos() {
    const sectionRefs = useRef([]);
    const { user } = useAuth();

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-animation');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        sectionRefs.current.forEach(section => {
            if (section) observer.observe(section);
        });

        return () => {
            sectionRefs.current.forEach(section => {
                if (section) observer.unobserve(section);
            });
        };
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden sobre-section">
            {/* Decorações de fundo */}
            <div className="bg-decoration w-96 h-96 bg-green-100 top-0 right-0"></div>
            <div className="bg-decoration w-64 h-64 bg-emerald-100 bottom-40 left-10"></div>
            <div className="bg-decoration w-80 h-80 bg-teal-50 top-1/2 left-1/3"></div>
            
            {/* Cabeçalho da página */}
            <div className="max-w-4xl mx-auto text-center mb-16 relative z-10">
                <h1 className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#3A7D44] to-[#55c065] mb-6">
                    Conheça o Saldo Verde
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-[#3A7D44] to-[#55c065] mx-auto rounded-full mb-6"></div>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Sua plataforma de finanças pessoais criada especialmente para transformar sua relação com o dinheiro.
                </p>
            </div>
            
            {/* Seções sobre a empresa */}
            <div className="max-w-6xl mx-auto">
                {sobres.map((sobre, index) => (
                    <div
                        key={sobre.id}
                        ref={el => sectionRefs.current[index] = el}
                        className={`opacity-0 flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center mb-32 relative sobre-card`}
                    >
                        {/* Numeração decorativa */}
                        <div className="absolute -left-4 -top-6 text-8xl font-bold text-gray-100 select-none hidden lg:block z-0">
                            {sobre.indice}
                        </div>
                        
                        {/* Imagem */}
                        <div className="w-full md:w-1/2 flex justify-center mb-8 md:mb-0">
                            <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
                                <img 
                                    src={sobre.img} 
                                    alt={sobre.titulo} 
                                    className="sobre-image float-animation z-10 w-full h-full object-contain"
                                />
                                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-100 rounded-full blur-md opacity-80 transform scale-90 z-0"></div>
                            </div>
                        </div>
                        
                        {/* Texto */}
                        <div className="w-full md:w-1/2 md:px-8 z-10">
                            <div className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-md rounded-2xl p-8 border border-gray-100 shadow-xl">
                                <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-[#3A7D44]">
                                    {sobre.titulo}
                                </h2>
                                <div className="w-16 h-1 bg-gradient-to-r from-[#3A7D44] to-[#55c065] rounded-full mb-6"></div>
                                <p className="text-gray-700 text-lg leading-relaxed">{sobre.texto}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Call to action - exibido apenas para usuários não logados */}
            {!user && (
                <div className="max-w-4xl mx-auto mt-12 mb-8">
                    <div className="bg-gradient-to-r from-[#3A7D44] to-[#55c065] rounded-2xl p-8 sm:p-12 text-white shadow-xl transform transition-all duration-300 hover:shadow-2xl">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-bold mb-3">Pronto para começar?</h2>
                                <p className="text-green-50 text-lg">Junte-se a milhares de estudantes que já estão transformando suas finanças com o Saldo Verde.</p>
                            </div>
                            <a href="/registro" className="px-8 py-4 bg-white text-[#3A7D44] rounded-xl font-bold shadow-md hover:shadow-lg transition-all duration-300 whitespace-nowrap flex items-center gap-2 hover:bg-gray-50 transform hover:-translate-y-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Criar Conta Grátis
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
