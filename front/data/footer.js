const footer = {
    navegacao: {
        navs: [
            { id: 1, titulo: 'Home', link: '/' },
            { id: 2, titulo: 'Contato', link: '/contato' },
            { id: 3, titulo: 'Blog', link: '/blog' },
        ],

        plats: [
            { id: 1, titulo: 'Metas', link: '/metas' },
            { id: 2, titulo: 'Transações', link: '/transacoes' },
            { id: 3, titulo: 'Análise', link: '/analise' },
            { id: 4, titulo: 'Categorias', link: '/categorias' },
        ],

        trans: [
            { id: 1, titulo: 'Sobre nós', link: '/sobrenos' },
            { id: 2, titulo: 'Termos e Privacidade', link: '/termos' },
            { id: 3, titulo: 'FAQ', link: '/faq' },
        ],
    },

    contato: [
        { id: 1, emoji: '🎯', titulo: 'Central de ajuda', link: '/faq' },
        { id: 2, emoji: '🎧', titulo: 'Falar conosco', link: 'contato' },
    ],

    redes: [
        { id: 1, titulo: 'Facebook', link: 'https://facebook.com', target: '_blank', rel: 'noopener noreferrer' },
        { id: 2, titulo: 'Instagram', link: 'https://instagram.com', target: '_blank', rel: 'noopener noreferrer' },
        { id: 3, titulo: 'Twitter', link: 'https://twitter.com', target: '_blank', rel: 'noopener noreferrer' },
    ],
};


export default footer;
