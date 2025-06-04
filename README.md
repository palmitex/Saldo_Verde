# <div align="center">💸 Saldo Verde</div>

<div align="center">

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://choosealicense.com/licenses/mit/)
[![Stars](https://img.shields.io/github/stars/palmitex/projeto-financias?style=for-the-badge&color=yellow)](https://github.com/palmitex/projeto-financias/stargazers)
[![Issues](https://img.shields.io/github/issues/palmitex/projeto-financias?style=for-the-badge&color=red)](https://github.com/palmitex/projeto-financias/issues)

<br/>

<p align="center">
  <a href="#-funcionalidades">Funcionalidades</a> •
  <a href="#-instalação">Instalação</a> •
  <a href="#%EF%B8%8F-stack-tecnológica">Stack</a> •
  <a href="#-contribuindo">Contribuir</a> •
  <a href="#-time">Time</a>
</p>

<br/>

<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=500&size=25&duration=3000&pause=1000&color=3A7D44&center=true&vCenter=true&width=435&lines=Controle+Financeiro+Inteligente;Educação+Financeira;Planejamento+de+Metas;Dashboard+Intuitivo" alt="Typing SVG" />

</div>

---

## ✨ Funcionalidades

<table align="center">
  <tr>
    <td align="center">
      <img width="60" src="https://img.icons8.com/color/96/000000/dashboard-layout.png" alt="Dashboard"/><br>
      <b>Dashboard<br>Intuitivo</b>
    </td>
    <td align="center">
      <img width="60" src="https://img.icons8.com/color/96/000000/goal.png" alt="Metas"/><br>
      <b>Metas<br>Financeiras</b>
    </td>
    <td align="center">
      <img width="60" src="https://img.icons8.com/color/96/000000/money-bag.png" alt="Controle"/><br>
      <b>Controle de<br>Gastos</b>
    </td>
    <td align="center">
      <img width="60" src="https://img.icons8.com/color/96/000000/mobile-payment.png" alt="Responsivo"/><br>
      <b>Design<br>Responsivo</b>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img width="60" src="https://img.icons8.com/color/96/000000/security-checked.png" alt="Segurança"/><br>
      <b>Dados<br>Seguros</b>
    </td>
    <td align="center">
      <img width="60" src="https://img.icons8.com/color/96/000000/book.png" alt="Blog"/><br>
      <b>Blog<br>Educativo</b>
    </td>
    <td align="center">
      <img width="60" src="https://img.icons8.com/color/96/000000/graph.png" alt="Gráficos"/><br>
      <b>Gráficos<br>Interativos</b>
    </td>
    <td align="center">
      <img width="60" src="https://img.icons8.com/color/96/000000/cloud-sync.png" alt="Backup"/><br>
      <b>Backup<br>na Nuvem</b>
    </td>
  </tr>
</table>

## 🚀 Instalação

<details>
<summary>📋 Pré-requisitos</summary>

- Node.js 18.x ou superior
- NPM ou Yarn
- Git
</details>

<details>
<summary>⚙️ Configuração</summary>

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
</details>

<details>
<summary>🔧 Instalação</summary>

```bash
# Instale as dependências do backend
cd API && npm install

# Instale as dependências do frontend
cd ../front && npm install
```
</details>

<details>
<summary>▶️ Execução</summary>

Em dois terminais separados:

```bash
# Terminal 1 - Backend (API)
cd API && npm run dev

# Terminal 2 - Frontend
cd front && npm run dev
```

📱 Acesse `http://localhost:3000`
</details>

## 🛠️ Stack Tecnológica

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind](https://img.shields.io/badge/Tailwind-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)

</div>

## 📁 Estrutura do Projeto

```mermaid
graph TD
    A[projeto-financias] --> B[API]
    A --> C[front]
    B --> D[config]
    B --> E[controllers]
    B --> F[models]
    B --> G[routes]
    C --> H[app]
    C --> I[components]
    C --> J[context]
    C --> K[data]
    C --> L[public]
```

## 🤝 Contribuindo

<div align="center">

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](http://makeapullrequest.com)

</div>

1. 🔱 Fork o projeto
2. 🔨 Crie sua Feature Branch
   ```bash
   git checkout -b feature/RecursoIncrivel
   ```
3. ✏️ Commit suas mudanças
   ```bash
   git commit -m 'Adiciona um recurso incrível'
   ```
4. 📌 Push para a Branch
   ```bash
   git push origin feature/RecursoIncrivel
   ```
5. 🔃 Abra um Pull Request

## 👥 Time

<div align="center">

| <img src="https://github.com/vc-franca.png" width="100px" alt="Victor"/><br>[**Victor Cestari**](https://github.com/vc-franca)<br>💻 Full Stack | <img src="https://github.com/ToledoP.png" width="100px" alt="Lucas"/><br>[**Lucas Toledo**](https://github.com/ToledoP)<br>🎨 Frontend | <img src="https://github.com/palmitex.png" width="100px" alt="Gabriel"/><br>[**Gabriel Palmieri**](https://github.com/palmitex)<br>⚙️ Backend |
|:---:|:---:|:---:|

</div>

---

<div align="center">

[![Stargazers](https://reporoster.com/stars/palmitex/projeto-financias)](https://github.com/palmitex/projeto-financias/stargazers)

<br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=3A7D44&height=100&section=footer" width="100%"/>

</div>