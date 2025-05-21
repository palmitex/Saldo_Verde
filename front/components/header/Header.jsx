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

                                <Link href="/historico" className="block text-gray-700 hover:text-green-700 py-1">
                                    <div className="flex items-center gap-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                                    </svg>
                                        <span>Histórico</span>
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
