'use client';
import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { emailConfig } from './emailjs-config';

export default function Contato() {
    const [formData, setFormData] = useState({
        email: '',
        nome: '',
        assunto: '',
        mensagem: ''
    });
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState({ show: false, type: '', message: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const showNotification = (type, message) => {
        setNotification({ show: true, type, message });
        setTimeout(() => {
            setNotification({ show: false, type: '', message: '' });
        }, 5000);
    };

    const formatDateTime = () => {
        const now = new Date();
        return now.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const templateParams = {
                name: formData.nome,
                email: formData.email,
                subject: formData.assunto,
                message: formData.mensagem,
                time: formatDateTime(),
                to_name: 'Equipe Saldo Verde',
            };

            await emailjs.send(
                emailConfig.serviceId,
                emailConfig.templateId,
                templateParams,
                emailConfig.publicKey
            );

            showNotification('success', 'Mensagem enviada com sucesso! Em breve entraremos em contato.');
            setFormData({
                email: '',
                nome: '',
                assunto: '',
                mensagem: ''
            });
        } catch (error) {
            console.error('Erro ao enviar e-mail:', error);
            showNotification('error', 'Erro ao enviar mensagem. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-600/5 via-white to-emerald-600/5">
            {/* Notificação */}
            {notification.show && (
                <div className={`fixed top-5 right-5 p-4 rounded-lg shadow-lg z-50 ${notification.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    } transform transition-all duration-500 animate-slide-in-right`}>
                    <div className="flex items-center">
                        {notification.type === 'success' ? (
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                        <span>{notification.message}</span>
                    </div>
                </div>
            )}

            {/* Hero Section */}
            <div className="relative py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
                            Entre em Contato
                        </h1>
                        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:text-xl">
                            Estamos aqui para ajudar você a ter mais controle sobre suas finanças.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Formulário de Contato */}
                        <div className="md:col-span-2">
                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm bg-white/80">
                                <div className="p-8">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            <div className="relative">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Nome Completo
                                                </label>
                                                <input
                                                    type="text"
                                                    name="nome"
                                                    value={formData.nome}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                                    placeholder="Digite seu nome"
                                                    required
                                                />
                                            </div>

                                            <div className="relative">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    E-mail
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                                    placeholder="seu@email.com"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Assunto
                                            </label>
                                            <input
                                                type="text"
                                                name="assunto"
                                                value={formData.assunto}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                                placeholder="Sobre o que você quer falar?"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Mensagem
                                            </label>
                                            <textarea
                                                name="mensagem"
                                                value={formData.mensagem}
                                                onChange={handleChange}
                                                rows="6"
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                                placeholder="Digite sua mensagem aqui..."
                                                required
                                            ></textarea>
                                        </div>

                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className={`
                                                    inline-flex items-center px-6 py-3 border border-transparent 
                                                    text-base font-medium rounded-lg shadow-md text-white 
                                                    bg-gradient-to-r from-emerald-500 to-emerald-600 
                                                    hover:from-emerald-600 hover:to-emerald-700 
                                                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 
                                                    transition-all transform hover:scale-105
                                                    ${loading ? 'opacity-70 cursor-not-allowed' : ''}
                                                `}
                                            >
                                                {loading ? (
                                                    <>
                                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Enviando...
                                                    </>
                                                ) : (
                                                    'Enviar Mensagem'
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* Informações de Contato */}
                        <div className="space-y-6">
                            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                                <div className="text-emerald-500 mb-4">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">E-mail</h3>
                                <p className="text-gray-600">suportesaldoverde@gmail.com</p>
                            </div>

                            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                                <div className="text-emerald-500 mb-4">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Redes Sociais</h3>
                                <div className="space-y-3">
                                    <a href="https://instagram.com" target="_blank" className="flex items-center text-gray-600 hover:text-emerald-500 transition-colors">
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                        </svg>
                                        Instagram
                                    </a>
                                    <a href="https://linkedin.com" className="flex items-center text-gray-600 hover:text-emerald-500 transition-colors">
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                        </svg>
                                        LinkedIn
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mapa Interativo */}
            <section className="flex flex-col justify-center items-center mt-10 gap-4">
                <h2 className="text-3xl font-bold">Visite nossa central de antendimentos: </h2>
                <p className="text-base">São Caetano do Sul - Rua Boa Vista, 825</p>

                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3073.9184361194934!2d-46.55792768553798!3d-23.644466621777582!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1spt-BR!2sbr!4v1748633728217!5m2!1spt-BR!2sbr"
                    width="600"
                    height="450"
                    className="border-0 rounded-xl mb-20"
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </section>

        </div>
    );
}
