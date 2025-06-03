"use client";
import { useState, useEffect } from 'react';
import termos from '../../data/termos.js';
import './termos.css';

export default function Termos() {
    const [activeSection, setActiveSection] = useState(1);

    const handleNavClick = (id) => {
        setActiveSection(id);
    };

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.6
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(Number(entry.target.id));
                }
            });
        }, observerOptions);

        document.querySelectorAll('article[id]').forEach(section => {
            observer.observe(section);
        });

        return () => {
            document.querySelectorAll('article[id]').forEach(section => {
                observer.unobserve(section);
            });
        };
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            {/* Decorações de fundo */}
            <div className="absolute w-96 h-96 bg-green-50 top-0 right-0 rounded-full opacity-30 -z-10"></div>
            <div className="absolute w-80 h-80 bg-emerald-50 bottom-40 left-10 rounded-full opacity-30 -z-10"></div>

            {/* Cabeçalho */}
            <div className="max-w-4xl mx-auto text-center mb-16 relative z-10">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#3A7D44] to-[#55c065] mb-4">
                    Termos e Política de Privacidade
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-[#3A7D44] to-[#55c065] mx-auto rounded-full mb-6"></div>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    Para garantir total transparência, detalhamos abaixo como seus dados são coletados, utilizados e protegidos em nossa plataforma.
                </p>
            </div>

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative">
                    {/* Navegação lateral */}
                    <aside className="lg:w-80 lg:sticky lg:top-33 lg:self-start lg:h-fit lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto z-10 bg-white rounded-2xl shadow-lg border border-gray-100">
                        <div className="p-6 bg-gradient-to-r rounded-t-2xl from-[#3A7D44] to-[#55c065] text-white">
                            <h2 className="text-xl font-bold">Navegação Rápida</h2>
                            <p className="text-green-50 text-sm mt-1">Clique para navegar pelos tópicos</p>
                        </div>
                        <nav className="p-4">
                            <ul className="space-y-1">
                                {termos.map((termo) => (
                                    <li key={termo.id}>
                                        <a
                                            href={`#${termo.id}`}
                                            onClick={() => handleNavClick(termo.id)}
                                            className={`block p-3 rounded-xl transition-all duration-300 border-l-4 ${activeSection === termo.id
                                                    ? 'bg-green-50 text-[#3A7D44] border-[#3A7D44] font-semibold'
                                                    : 'text-gray-700 border-transparent hover:bg-green-50 hover:text-[#3A7D44] hover:border-[#3A7D44]'
                                                }`}
                                        >
                                            <span className="text-[#3A7D44] font-medium mr-2">{termo.id}.</span>
                                            {termo.titulo}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </aside>

                    {/* Conteúdo dos termos */}
                    <section className="flex-1 space-y-8">
                        {termos.map((termo) => (
                            <article
                                key={termo.id}
                                id={termo.id}
                                className="bg-white/80 backdrop-blur-md rounded-2xl p-8 border border-gray-100 shadow-lg scroll-mt-24 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                            >
                                <header className="mb-6">
                                    <div className="flex items-center mb-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#3A7D44] to-[#55c065] flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
                                            {termo.id}
                                        </div>
                                        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">
                                            {termo.titulo}
                                        </h3>
                                    </div>
                                    <div className="w-16 h-1 bg-gradient-to-r from-[#3A7D44] to-[#55c065] rounded-full"></div>
                                </header>
                                <p className="text-gray-700 text-lg leading-relaxed">{termo.texto}</p>
                            </article>
                        ))}

                        <div className="bg-gradient-to-r from-gray-50 to-white p-8 rounded-2xl shadow-md border border-gray-100 mt-12">
                            <p className="text-gray-700 italic text-center">
                                Data da última atualização: 02 de Junho de 2025
                            </p>
                            <p className="text-gray-700 text-center mt-4">
                                Ao utilizar nossa plataforma, você concorda com estes termos e política de privacidade.
                                Para mais informações, entre em contato através da nossa página de{' '}
                                <a href="/contato" className="text-[#3A7D44] font-medium hover:underline transition-colors duration-200">
                                    contato
                                </a>.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
