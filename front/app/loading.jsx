'use client';
import { useEffect, useState } from 'react';

export default function Loading() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(true);
    }, []);

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <div className="bg-white/90 backdrop-blur rounded-lg p-6 shadow-lg flex flex-col items-center gap-4">
                {/* Logo e Loading */}
                <div className="relative w-16 h-16">
                    <img
                        src="/Porco-logo.png"
                        alt="Saldo Verde"
                        className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                </div>
                
                {/* Texto simples */}
                <span className="text-emerald-700 font-medium">Carregando...</span>
            </div>
        </div>
    );
} 