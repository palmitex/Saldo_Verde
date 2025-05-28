'use client';

export default function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-[#3A7D44] text-white py-12 px-4 text-center">
            {/* Seção central: links + contato */}
            <div className="flex justify-center gap-16 flex-wrap mt-20 mb-8 text-left max-w-[1200px] mx-auto">
                {/* Links principais */}
                <div className="flex flex-col gap-16 sm:flex-row sm:align-start justify-center">
                    <div className="footer-column max-w-[200px]">
                        <h4 className="mb-4 font-bold text-[#115c4a] text-lg">Navegue</h4>
                        <ul className="list-none p-0 m-0">
                            {['Recursos', 'Planos', 'Contato'].map((item) => (
                                <li key={item} className="mb-2">
                                    <a 
                                      href="#" 
                                      className="relative text-white font-medium no-underline transition-colors transition-transform duration-300 ease-in-out hover:text-[#0da740] hover:-translate-y-0.5"
                                    >
                                        {item}
                                        <span className="absolute bottom-[-3px] left-0 w-0 h-0.5 bg-[#E8EC67] transition-all duration-300 ease-in-out hover:w-full"></span>
                                    </a>
                                </li>
                            ))}
                            <li className="mb-2">
                                <a
                                  href="/blog"
                                  className="relative text-white font-medium no-underline transition-colors transition-transform duration-300 ease-in-out hover:text-[#0da740] hover:-translate-y-0.5"
                                >
                                    Blog
                                    <span className="absolute bottom-[-3px] left-0 w-0 h-0.5 bg-[#E8EC67] transition-all duration-300 ease-in-out hover:w-full"></span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-column max-w-[200px]">
                        <h4 className="mb-4 font-bold text-[#115c4a] text-lg">Plataforma</h4>
                        <ul className="list-none p-0 m-0">
                            {['Para você', 'Para empresa', 'Ajuda'].map((item) => (
                                <li key={item} className="mb-2">
                                    <a 
                                      href="#" 
                                      className="relative text-white font-medium no-underline transition-colors transition-transform duration-300 ease-in-out hover:text-[#0da740] hover:-translate-y-0.5"
                                    >
                                        {item}
                                        <span className="absolute bottom-[-3px] left-0 w-0 h-0.5 bg-[#E8EC67] transition-all duration-300 ease-in-out hover:w-full"></span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="footer-column max-w-[200px]">
                        <h4 className="mb-4 font-bold text-[#115c4a] text-lg">Transparência</h4>
                        <ul className="list-none p-0 m-0">
                            <li className="mb-2">
                                <a 
                                  href="/sobrenos" 
                                  className="relative text-white font-medium no-underline transition-colors transition-transform duration-300 ease-in-out hover:text-[#0da740] hover:-translate-y-0.5"
                                >
                                    Sobre nós
                                    <span className="absolute bottom-[-3px] left-0 w-0 h-0.5 bg-[#E8EC67] transition-all duration-300 ease-in-out hover:w-full"></span>
                                </a>
                            </li>
                            <li className="mb-2">
                                <a 
                                  href="/termos" 
                                  className="relative text-white font-medium no-underline transition-colors transition-transform duration-300 ease-in-out hover:text-[#0da740] hover:-translate-y-0.5"
                                >
                                    Termos e Privacidade
                                    <span className="absolute bottom-[-3px] left-0 w-0 h-0.5 bg-[#E8EC67] transition-all duration-300 ease-in-out hover:w-full"></span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bloco de contato */}
                <div className="bg-[#306838] p-8 rounded-lg max-w-[500px] text-white">
                    <h4 className="mb-4 text-xl font-semibold">Contato</h4>
                    <p className="text-lg font-bold mb-2">
                        (35) 3292–8398 <span className="ml-2">🟢</span>
                    </p>
                    <p className="mb-6">suportesaldoverde@gmail.com</p>

                    <div className="flex gap-4 flex-wrap justify-center mb-6">
                        <a 
                          href="#" 
                          className="flex-1 text-center px-4 py-3 border border-[#2c8b72] rounded-lg bg-transparent text-white no-underline transition-colors duration-300 hover:bg-[#2c8b72]"
                        >
                            🎯 Central de ajuda
                        </a>
                        <a 
                          href="#" 
                          className="flex-1 text-center px-4 py-3 border border-[#2c8b72] rounded-lg bg-transparent text-white no-underline transition-colors duration-300 hover:bg-[#2c8b72]"
                        >
                            🎧 Falar conosco
                        </a>
                    </div>

                    <div>
                        <strong>Expediente</strong>
                        <p className="mt-1 text-sm">
                            Funcionamos de segunda-feira a<br />sexta-feira das 8h às 17h.
                        </p>
                    </div>
                </div>
            </div>

            {/* Rodapé inferior: logo + direitos */}
            <div className="border-t border-white/10 pt-6 mt-8 flex justify-center items-center gap-6 flex-wrap max-w-[1200px] mx-auto">
                <div className="flex gap-6">
                    <a 
                      href="https://facebook.com" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-white text-sm no-underline hover:underline"
                    >
                        Facebook
                    </a>
                    <a 
                      href="https://instagram.com" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-white text-sm no-underline hover:underline"
                    >
                        Instagram
                    </a>
                    <a 
                      href="https://twitter.com" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-white text-sm no-underline hover:underline"
                    >
                        Twitter
                    </a>
                </div>

                <button 
                  className="bg-[#306838] text-white px-4 py-2 rounded-md text-sm cursor-pointer mx-12 hover:bg-[#2c8b72]"
                  onClick={scrollToTop}
                >
                    Voltar ao topo ↑
                </button>

                <p className="text-white text-sm">© {new Date().getFullYear()} Todos os direitos reservados.</p>
            </div>
        </footer>
    );
}