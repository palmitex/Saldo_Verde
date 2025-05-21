"use client";
import { useState } from 'react';
import './header.css';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
    const [isActive, setIsActive] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const auth = useAuth();

    const toggleActive = () => {
        setIsActive(!isActive);
    };

    const handleLogout = () => {
        auth.logout();
    };

    return (
        <header className="header">
            <div className="header-container">
                <Link href="/">
                    <img className="Logo" src="/CA Saldo Verde.png" alt="Logo" />
                </Link>
                <nav className={`nav ${isActive ? 'active' : ''}`}>
                    <Link href="/">Home</Link>

                    {auth?.user && (
                        <div className="relative group">
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="relative text-gray-800 font-medium after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#E8EC67] hover:after:w-full after:transition-all after:duration-300"
                            >
                                Finanças
                            </button>
                            <div
                                className={` w-45 absolute mt-2 bg-white shadow-lg rounded-md py-2 px-4 z-50 transition-all duration-300 ease-out transform origin-top ${showDropdown ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible pointer-events-none'
                                    }`}
                            >
                                <Link href="/metas" className="block text-gray-700 hover:text-green-700 py-1">
                                    <div className="flex items-center gap-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
                                        </svg>
                                        <span>Metas</span>
                                    </div>
                                </Link>
                                <Link href="/transacoes" className="block text-gray-700 hover:text-green-700 py-1">
                                    <div className="flex items-center gap-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                                        </svg>
                                        <span>Transações</span>
                                    </div>
                                </Link>
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
                                <Link href="/analise" className="block text-gray-700 hover:text-green-700 py-1">
                                    <div className="flex items-center gap-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                                        </svg>

                                        <span>Análise</span>
                                    </div>
                                </Link>
                                <Link href="/categorias" className="block text-gray-700 hover:text-green-700 py-1">
                                    <div className="flex items-center gap-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                                        </svg>
                                        <span>Categorias</span>
                                    </div>
                                </Link>




                            </div>
                        </div>
                    )}
                    <Link href="/blog">Blog</Link>
                    <Link href="/sobrenos">Sobre Nós</Link>
                </nav>

                <div className="auth-buttons">
                    {auth?.user ? (
                        <button onClick={handleLogout} className="btn entrar">Sair</button>
                    ) : (
                        <>
                            <Link href="/login">
                                <button className="btn bg-yellow-300">Entrar</button>
                            </Link>
                            <Link href="/registro">
                                <button className="btn bg-yellow-300">Criar Conta</button>
                            </Link>
                        </>
                    )}
                </div>

                <button className="menu-toggle" onClick={toggleActive}>
                    ☰
                </button>
            </div>
        </header>
    );
}
