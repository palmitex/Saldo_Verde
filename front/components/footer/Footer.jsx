
'use client';
import footer from '../../data/footer.js';
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaTwitter, FaArrowUp, FaLinkedin} from 'react-icons/fa';

export default function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const socialIcons = {
        'Facebook': <FaFacebook />,
        'Instagram': <FaInstagram />,
        'Twitter': <FaTwitter />, 
        'Linkedin': <FaLinkedin/>
        
    };

    return (
        <footer className="bg-gradient-to-b from-[#3A7D44] to-[#306838] text-white">
            {/* Conteúdo principal do footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ml-15">

                    {/* Coluna 2: Navegação */}
                    <div>
                        <h4 className="text-2xl font-bold mb-4 text-yellow-300">Navegação</h4>
                        <ul className="space-y-2">
                            {footer.navegacao.navs.map((nav) => (
                                <li key={nav.id}>
                                    <Link
                                        href={nav.link}
                                        className="text-gray-200 hover:text-yellow-300 transition-colors duration-300"
                                    >
                                        {nav.titulo}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Coluna 3: Plataforma */}
                    <div>
                        <h4 className="text-2xl font-bold mb-4 text-yellow-300">Plataforma</h4>
                        <ul className="space-y-2">
                            {footer.navegacao.plats.map((plat) => (
                                <li key={plat.id}>
                                    <Link
                                        href={plat.link}
                                        className="text-gray-200 hover:text-yellow-300 transition-colors duration-300"
                                    >
                                        {plat.titulo}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-2xl font-bold mb-4 text-yellow-300">Transparência</h4>
                        <ul className="space-y-2">
                            {footer.navegacao.trans.map((tra) => (
                                <li key={tra.id}>
                                    <Link
                                        href={tra.link}
                                        className="text-gray-200 hover:text-yellow-300 transition-colors duration-300"
                                    >
                                        {tra.titulo}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <div>
                            <h3 className='text-2xl font-bold text-yellow-300'>Acompanhe nas redes</h3>
                            <div className="flex space-x-4 mt-4">
                                {footer.redes.map((rede) => (
                                    <a
                                        key={rede.id}
                                        href={rede.link}
                                        target={rede.target}
                                        rel={rede.rel}
                                        className="text-white w-5 text-lg hover:text-yellow-300 transition-colors duration-300"
                                        aria-label={rede.titulo}
                                    >
                                        {socialIcons[rede.titulo]}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rodapé inferior */}
            <div className="border-t border-[#4a9d54] bg-[#2a5e32]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center">
                    <p className="text-sm text-gray-300 mb-4 sm:mb-0">
                        © {new Date().getFullYear()} Saldo Verde. Todos os direitos reservados.
                    </p>

                    <button
                        onClick={scrollToTop}
                        className="flex items-center space-x-1 bg-[#3A7D44] hover:bg-[#4a9d54] text-white px-4 py-2 rounded-full text-sm transition-colors duration-300 group"
                        aria-label="Voltar ao topo"
                    >
                        <span>Topo</span>
                        <FaArrowUp size={12} className="group-hover:animate-bounce" />
                    </button>
                </div>
            </div>
        </footer>
    );
}