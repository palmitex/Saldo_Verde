'use client';

import './footer.css';

export default function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="footer">
            {/* Seção central: links + contato */}
            <div className="footer-main">
                {/* Links principais */}
                <div className="footer-links">
                    <div className="footer-column">
                        <h4>Navegue</h4>
                        <ul>
                            <li><a href="#">Recursos</a></li>
                            <li><a href="#">Planos</a></li>
                            <li><a href="#">Contato</a></li>
                            <li><a href="/blog">Blog</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h4>Plataforma</h4>
                        <ul>
                            <li><a href="#">Para você</a></li>
                            <li><a href="#">Para empresa</a></li>
                            <li><a href="#">Ajuda</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h4>Transparência</h4>
                        <ul>
                            <li><a href="/sobrenos">Sobre nós</a></li>
                            <li><a href="#">Termos e Privacidade</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bloco de contato */}
                <div className="footer-contact">
                    <h4>Contato</h4>
                    <p className="contact-phone">(35) 3292–8398 <span className="whatsapp-icon">🟢</span></p>
                    <p className="contact-email">suporte@contasonline.com.br</p>

                    <div className="contact-actions">
                        <a href="#" className="contact-button">🎯 Central de ajuda</a>
                        <a href="#" className="contact-button">🎧 Falar conosco</a>
                    </div>

                    <div className="contact-hours">
                        <strong>Expediente</strong>
                        <p>Funcionamos de segunda-feira a<br />sexta-feira das 8h às 17h.</p>
                    </div>
                </div>
            </div>


            {/* Rodapé inferior: logo + direitos */}
            <div className="footer-bottom">
                <div className="social-links">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
                </div>
                <button className="scroll-top-btn" onClick={scrollToTop}>
                    Voltar ao topo ↑
                </button>
                <p>© {new Date().getFullYear()} Todos os direitos reservados.</p>
            </div>
        </footer>
    );
}
