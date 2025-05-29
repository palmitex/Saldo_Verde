"use client";
import { useState, useEffect, useRef } from 'react';
import './header.css';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
    const [isActive, setIsActive] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const auth = useAuth();
    
    // Refs para os menus dropdown
    const dropdownRef = useRef(null);
    const userMenuRef = useRef(null);
    const financeButtonRef = useRef(null);
    const userAvatarRef = useRef(null);

    // Efeito para fechar os dropdowns quando clicar fora deles
    useEffect(() => {
        function handleClickOutside(event) {
            // Fechar menu de finanças ao clicar fora
            if (showDropdown && 
                dropdownRef.current && 
                !dropdownRef.current.contains(event.target) &&
                financeButtonRef.current && 
                !financeButtonRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
            
            // Fechar menu de usuário ao clicar fora
            if (showUserMenu && 
                userMenuRef.current && 
                !userMenuRef.current.contains(event.target) &&
                userAvatarRef.current && 
                !userAvatarRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        }
        
        // Adicionar listener para detectar cliques
        document.addEventListener("mousedown", handleClickOutside);
        
        // Remover listener ao desmontar componente
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDropdown, showUserMenu]);

    const toggleActive = () => {
        setIsActive(!isActive);
        // Fechar os outros menus quando fechar o menu responsivo
        if (!isActive === false) {
            setShowUserMenu(false);
            setShowDropdown(false);
        }
    };

    const handleLogout = () => {
        auth.logout();
    };

    // Função para fechar o menu quando um link é clicado
    const handleLinkClick = () => {
        setIsActive(false);
        setShowDropdown(false);
        setShowUserMenu(false);
    };

    // Componente para o avatar do usuário
    const UserAvatar = () => (
        <button 
            ref={userAvatarRef}
            onClick={() => setShowUserMenu(!showUserMenu)} 
            className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-800 hover:bg-green-200 transition-colors"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
        </button>
    );

    // Componente para o menu dropdown de usuário
    const UserDropdownMenu = ({ isMobile = false }) => (
        <div 
            ref={isMobile ? null : userMenuRef}
            className={`${isMobile ? 'mobile-dropdown' : 'desktop-dropdown absolute right-0'} mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-50 transition-all duration-300 ease-out transform origin-top ${
                isMobile ? 'block' : // Sempre visível no modo móvel
                (showUserMenu ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible pointer-events-none')
            }`}>
            <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-800">Olá, {auth.user.nome?.split(' ')[0] || 'Usuário'}</p>
                <p className="text-xs text-gray-500 truncate">{auth.user.email}</p>
            </div>
            
            <Link href="/perfil" onClick={handleLinkClick}>
                <div className="px-4 py-2 hover:bg-gray-50 flex items-center gap-2 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    <span className="text-sm text-gray-700">Meu Perfil</span>
                </div>
            </Link>
            
            <div onClick={handleLogout} className="px-4 py-2 hover:bg-gray-50 flex items-center gap-2 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                </svg>
                <span className="text-sm text-gray-700">Sair</span>
            </div>
        </div>
    );

    // Componente para o botão de login
    const LoginButton = () => (
        <Link href="/login" onClick={handleLinkClick}>
            <button className="w-10 h-10 rounded-full bg-yellow-300 flex items-center justify-center text-gray-800 hover:bg-green-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                </svg>
            </button>
        </Link>
    );

    return (
        <header className="header">
            <div className="header-container">
                <Link href="/" onClick={handleLinkClick}>
                    <img className="Logo" src="/CA Saldo Verde.png" alt="Logo" />
                </Link>
                <nav className={`nav ${isActive ? 'active' : ''}`}>
                    <Link href="/" onClick={handleLinkClick}>Home</Link>

                    {auth?.user && (
                        <div className="relative group">
                            <button
                                ref={financeButtonRef}
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="relative text-gray-800 font-medium after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#E8EC67] hover:after:w-full after:transition-all after:duration-300"
                            >
                                Finanças
                            </button>
                            <div
                                ref={dropdownRef}
                                className={`w-45 absolute mt-2 bg-white shadow-lg rounded-md py-2 px-4 z-50 transition-all duration-300 ease-out transform origin-top ${showDropdown ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible pointer-events-none'
                                    }`}
                            >
                                <Link href="/metas" className="block text-gray-700 hover:text-green-700 py-1" onClick={handleLinkClick}>
                                    <div className="flex items-center gap-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
                                        </svg>
                                        <span>Metas</span>
                                    </div>
                                </Link>
                                <Link href="/transacoes" className="block text-gray-700 hover:text-green-700 py-1" onClick={handleLinkClick}>
                                    <div className="flex items-center gap-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                                        </svg>
                                        <span>Transações</span>
                                    </div>
                                </Link>
                                
                                <Link href="/analise" className="block text-gray-700 hover:text-green-700 py-1" onClick={handleLinkClick}>
                                    <div className="flex items-center gap-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                                        </svg>

                                        <span>Análise</span>
                                    </div>
                                </Link>
                                <Link href="/categorias" className="block text-gray-700 hover:text-green-700 py-1" onClick={handleLinkClick}>
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
                    <Link href="/blog" onClick={handleLinkClick}>Blog</Link>
                    <Link href="/sobrenos" onClick={handleLinkClick}>Sobre Nós</Link>
                    <Link href="/faq" onClick={handleLinkClick}>FAQ</Link>
                    <Link href="/contato" onClick={handleLinkClick}>Contato</Link>
                    
                    {/* Componente de autenticação dentro do menu responsivo */}
                    <div className="auth-mobile-container">
                        {auth?.user ? (
                            <div className="mobile-user-menu">
                                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200">
                                    <UserAvatar />
                                    <span className="user-greeting">Olá, {auth.user.nome?.split(' ')[0] || 'Usuário'}</span>
                                </div>
                                
                                {/* Links diretos para mobile */}
                                <Link href="/perfil" onClick={handleLinkClick}>
                                    <div className="mobile-menu-item">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-600">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg>
                                        <span className="text-sm text-gray-700">Meu Perfil</span>
                                    </div>
                                </Link>
                                
                                <div onClick={() => { handleLogout(); handleLinkClick(); }} className="mobile-menu-item">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-600">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                                    </svg>
                                    <span className="text-sm text-gray-700">Sair</span>
                                </div>
                            </div>
                        ) : (
                            <div className="login-mobile py-3">
                                <LoginButton />
                                <span className="ml-2">Entrar</span>
                            </div>
                        )}
                    </div>
                </nav>

                {/* Botões de autenticação para telas grandes */}
                <div className="auth-buttons">
                    {auth?.user ? (
                        <div className="relative">
                            <UserAvatar />
                            <UserDropdownMenu />
                        </div>
                    ) : (
                        <LoginButton />
                    )}
                </div>

                <button className="menu-toggle" onClick={toggleActive}>
                    ☰
                </button>
            </div>
        </header>
    );
}
