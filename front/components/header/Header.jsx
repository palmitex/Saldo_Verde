"use client";
import { useState, useEffect, useRef } from 'react';
import './header.css';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { FaHome, FaChartLine, FaBlog, FaSignInAlt, FaUserCircle, FaSignOutAlt, FaUserCog, FaCoins, FaChartPie, FaListAlt, FaTags, FaTimes } from 'react-icons/fa';

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

    return (
        <header className="bg-gradient-to-r from-[#3A7D44] to-[#55c065] shadow-md sticky top-0 z-50">
            <div className="container mx-auto py-3 px-3 flex items-center justify-between">
                {/* Botão do menu mobile - Movido para a esquerda */}
                <button 
                    className="menu-toggle md:hidden" 
                    onClick={toggleActive}
                    aria-label="Menu"
                >
                    <div className={`hamburger ${isActive ? 'active' : ''}`}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </button>
                
                <Link 
                    href="/" 
                    onClick={handleLinkClick}
                    className="flex items-center transition-transform hover:scale-105"
                >
                    <img 
                        className="h-10 md:h-12" 
                        src="/Porco-logo.png" 
                        alt="Logo Saldo Verde" 
                    />
                    <span className="ml-2 text-xl font-bold text-white hidden sm:block">Saldo Verde</span>
                </Link>
                
                <nav className={`nav-menu ${isActive ? 'active' : ''}` }>
                    <button 
                        className="close-menu-btn md:hidden" 
                        onClick={toggleActive}
                        aria-label="Fechar menu"
                    >
                        <FaTimes size={24} />
                    </button>
                    
                    <Link 
                        href="/" 
                        onClick={handleLinkClick}
                        className="nav-link flex items-center gap-2"
                    >
                        <FaHome className="text-yellow-300" />
                        <span>Home</span>
                    </Link>

                    {auth?.user && (
                        <div className="relative">
                            <button
                                ref={financeButtonRef}
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="nav-link flex items-center gap-2"
                            >
                                <FaChartLine className="text-yellow-300" />
                                <span>Finanças</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                </svg>
                            </button>
                            
                            <div
                                ref={dropdownRef}
                                className={`finance-dropdown ${showDropdown ? 'show' : ''}`}
                            >
                                <Link href="/metas" className="dropdown-item" onClick={handleLinkClick}>
                                    <FaCoins className="text-green-600" />
                                    <span>Metas</span>
                                </Link>
                                
                                <Link href="/transacoes" className="dropdown-item" onClick={handleLinkClick}>
                                    <FaListAlt className="text-green-600" />
                                    <span>Transações</span>
                                </Link>
                                
                                <Link href="/analise" className="dropdown-item" onClick={handleLinkClick}>
                                    <FaChartPie className="text-green-600" />
                                    <span>Análise</span>
                                </Link>
                                
                                <Link href="/categorias" className="dropdown-item" onClick={handleLinkClick}>
                                    <FaTags className="text-green-600" />
                                    <span>Categorias</span>
                                </Link>
                            </div>
                        </div>
                    )}
                    
                    <Link 
                        href="/blog" 
                        onClick={handleLinkClick}
                        className="nav-link flex items-center gap-2"
                    >
                        <FaBlog className="text-yellow-300" />
                        <span>Blog</span>
                    </Link>
                    
                    
                    <div className="auth-mobile-container">
                        {auth?.user ? (
                            <div className="mobile-user-menu">
                                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-green-100">
                                    <div className="w-10 h-10 rounded-full bg-yellow-300 flex items-center justify-center text-green-800">
                                        <FaUserCircle size={24} />
                                    </div>
                                    <span className="user-greeting">Olá, {auth.user.nome?.split(' ')[0] || 'Usuário'}</span>
                                </div>
                                
                                {/* Links diretos para mobile */}
                                <Link href="/perfil" onClick={handleLinkClick}>
                                    <div className="mobile-menu-item">
                                        <FaUserCog className="text-green-700" />
                                        <span>Meu Perfil</span>
                                    </div>
                                </Link>
                                
                                <div onClick={() => { handleLogout(); handleLinkClick(); }} className="mobile-menu-item">
                                    <FaSignOutAlt className="text-green-700" />
                                    <span>Sair</span>
                                </div>
                            </div>
                        ) : (
                            <Link href="/login" onClick={handleLinkClick} className="login-mobile">
                                <div className="w-10 h-10 rounded-full bg-yellow-300 flex items-center justify-center text-green-800">
                                    <FaSignInAlt size={20} />
                                </div>
                                <span className="ml-2 font-medium">Entrar</span>
                            </Link>
                        )}
                    </div>
                </nav>

                <div className="hidden md:block">
                    {auth?.user ? (
                        <div className="relative">
                            <button 
                                ref={userAvatarRef}
                                onClick={() => setShowUserMenu(!showUserMenu)} 
                                className="user-avatar-btn"
                                aria-label="Menu do usuário"
                            >
                                <FaUserCircle size={24} />
                                <span className="ml-2 hidden lg:inline">{auth.user.nome?.split(' ')[0] || 'Usuário'}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 ml-1 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                </svg>
                            </button>
                            
                            <div 
                                ref={userMenuRef}
                                className={`user-dropdown ${showUserMenu ? 'show' : ''}`}
                            >
                                <div className="px-4 py-2 border-b border-gray-100">
                                    <p className="text-sm font-semibold text-gray-800">Olá, {auth.user.nome?.split(' ')[0] || 'Usuário'}</p>
                                    <p className="text-xs text-gray-500 truncate">{auth.user.email}</p>
                                </div>
                                
                                <Link href="/perfil" onClick={handleLinkClick}>
                                    <div className="dropdown-item">
                                        <FaUserCog className="text-green-600" />
                                        <span>Meu Perfil</span>
                                    </div>
                                </Link>
                                
                                <div onClick={handleLogout} className="dropdown-item">
                                    <FaSignOutAlt className="text-green-600" />
                                    <span>Sair</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Link 
                            href="/login" 
                            onClick={handleLinkClick}
                            className="login-btn"
                        >
                            <FaSignInAlt />
                            <span className="ml-2">Entrar</span>
                        </Link>
                    )}
                </div>

                {/* O botão do menu mobile foi movido para o início do container */}
            </div>
        </header>
    );
}