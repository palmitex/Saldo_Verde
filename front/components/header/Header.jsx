"use client";
import { useState } from 'react';
import './header.css';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
    const [isActive, setIsActive] = useState(false);
    const auth = useAuth();

    const toggleActive = () => {
        setIsActive(!isActive);
    };

    const handleLogout = () => {
        auth.logout();
    };

    return (
        <>
            <header className="header">
                <div className="header-container">
                    <Link href="/">
                        <img className="Logo" src="/CA Saldo Verde.png" alt="Logo"></img>
                    </Link>
                    <nav className={`nav ${isActive ? 'active' : ''}`}>
                        <Link href="/">Home</Link>
                        {auth?.user && (
                            <>
                                <Link href="/metas">Metas</Link>
                                <Link href="/transacoes">Transações</Link>
                            </>
                        )}
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
        </>
    )
}