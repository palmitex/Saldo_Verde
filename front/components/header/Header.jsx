"use client";
import { useState } from 'react';
import './header.css';


export default function Header() {
    const [isActive, setIsActive] = useState(false);

    const toggleActive = () => {
        setIsActive(!isActive);
    };


    return (
        <>
            <header className="header">
                <div className="header-container">
                    <img className="Logo" src="./CA Saldo Verde.png" alt=''></img>
                    <nav className={`nav ${isActive ? 'active' : ''}`}>
                        <a href="#home">Home</a>
                        <a href="#sobre">Sobre</a>
                        <a href="#servicos">Dicas</a>
                        <a href="#contato">Contato</a>
                        <a href="#contato">Calendário</a>
                    </nav>
                    <div className="auth-buttons">
                        <button className="btn entrar">Entrar</button>
                        <button className="btn criar">Criar Conta</button>
                    </div>
                    <button className="menu-toggle" onClick={toggleActive}>
                        ☰
                    </button>
                </div>
            </header>
        </>
    )

}