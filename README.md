# 💸 Saldo Verde

<div align="center">

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Next.js](https://img.shields.io/badge/Next.js-13.0-black)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC)](https://tailwindcss.com/)

<img src="public/principal_home.svg" alt="SaldoVerde Logo" width="200"/>

**Transforme sua relação com o dinheiro de forma simples, intuitiva e divertida.**

[Demo](https://saldoverde.vercel.app) · [Reportar Bug](https://github.com/palmitex/projeto-financias/issues) · [Solicitar Feature](https://github.com/palmitex/projeto-financias/issues)

</div>

---

## ✨ Funcionalidades

- 📊 **Dashboard Intuitivo**: Visualize suas finanças com gráficos claros e objetivos
- 🎯 **Metas Financeiras**: Defina e acompanhe objetivos financeiros
- 💰 **Controle de Gastos**: Categorize e monitore suas despesas
- 📱 **Responsivo**: Interface adaptável para todos os dispositivos
- 🔒 **Seguro**: Proteção de dados e privacidade do usuário
- 📚 **Blog Educativo**: Conteúdo sobre educação financeira

## 🚀 Instalação

### Pré-requisitos

- Node.js 18.x ou superior
- NPM ou Yarn
- Git

### Passo a Passo

1. **Clone o repositório**
```bash
git clone https://github.com/palmitex/projeto-financias
cd projeto-financias
```

2. **Configure as variáveis de ambiente**
```bash
# Na pasta API
cp .env.example .env
# Na pasta front
cp .env.example .env.local
```

3. **Instale as dependências**
```bash
# Instale as dependências do backend
cd API
npm install

# Instale as dependências do frontend
cd ../front
npm install
```

4. **Inicie o projeto**

Em dois terminais separados:

```bash
# Terminal 1 - Backend (API)
cd API
npm run dev

# Terminal 2 - Frontend
cd front
npm run dev
```

Acesse `http://localhost:3000` para ver o projeto rodando.

## 🛠️ Stack Tecnológica

### Frontend
- [Next.js](https://nextjs.org/) - Framework React com SSR
- [React](https://reactjs.org/) - Biblioteca JavaScript para UI
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utilitário
- [Flowbite](https://flowbite.com/) - Componentes Tailwind
- [Chart.js](https://www.chartjs.org/) - Biblioteca de gráficos

### Backend
- [Node.js](https://nodejs.org/) - Runtime JavaScript
- [Express](https://expressjs.com/) - Framework web
- [MongoDB](https://www.mongodb.com/) - Banco de dados NoSQL

## 📁 Estrutura do Projeto

```
projeto-financias/
├── API/                   # Backend
│   ├── config/           # Configurações do servidor
│   ├── controllers/      # Controladores da API
│   ├── models/          # Modelos do banco de dados
│   ├── routes/          # Rotas da API
│   └── app.js           # Entrada da aplicação
└── front/               # Frontend
    ├── app/            # Páginas e rotas
    ├── components/     # Componentes React
    ├── context/        # Contextos React
    ├── data/          # Dados estáticos
    └── public/        # Arquivos públicos
```

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Siga estes passos:

1. Fork o projeto
2. Crie sua Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Time

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/vc-franca">
        <img src="https://github.com/vc-franca.png" width="100px;" alt="Victor Cestari"/><br>
        <sub><b>Victor Cestari</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/ToledoP">
        <img src="https://github.com/ToledoP.png" width="100px;" alt="Lucas Toledo"/><br>
        <sub><b>Lucas Toledo</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/palmitex">
        <img src="https://github.com/palmitex.png" width="100px;" alt="Gabriel Palmieri"/><br>
        <sub><b>Gabriel Palmieri</b></sub>
      </a>
    </td>
  </tr>
</table>

---

<div align="center">
  Feito com ❤️ pela equipe SaldoVerde
</div>