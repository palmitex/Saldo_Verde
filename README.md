<div align="center">

# <img src="front/public/Porco-logo.png" alt="Logo SaldoVerde" width="40"> SaldoVerde

### 💰 Controle financeiro simplificado para sua vida

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat&logo=license)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-13.4+-000000?style=flat&logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=flat&logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

</div>

## 📋 Sobre o Projeto

O **SaldoVerde** é uma plataforma de finanças pessoais desenvolvida para facilitar o controle financeiro do usuário de forma simples, intuitiva e divertida. Nosso objetivo é ajudar as pessoas a organizarem suas finanças, estabelecerem metas e acompanharem seu progresso financeiro com facilidade.

### ✨ Principais Funcionalidades

- **Controle de Transações**: Registre receitas e despesas de forma organizada
- **Categorias Personalizadas**: Crie e gerencie categorias com cores e ícones personalizados
- **Metas Financeiras**: Estabeleça objetivos claros para suas economias e investimentos
- **Análises e Gráficos**: Visualize suas finanças com gráficos e relatórios detalhados
- **Planejamento Inteligente**: Organize seu orçamento mensal e planeje seus gastos

## 🖼️ Capturas de Tela

<div align="center">
<table>
  <tr>
    <td><img src="front/public/principal_home.jpeg" alt="Tela Inicial" width="300"/></td>
    <td><img src="front/public/grafico.jpeg" alt="Análises" width="300"/></td>
  </tr>
  <tr>
    <td><img src="front/public/metas.png" alt="Metas" width="300"/></td>
  </tr>
</table>
</div>

## 🚀 Começando

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18.x ou superior)
- [npm](https://www.npmjs.com/) (normalmente instalado com o Node.js)
- [Git](https://git-scm.com/) para clonar o repositório

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/palmitex/projeto-financias.git
   cd projeto-financias
   ```

2. Instale as dependências do backend:
   ```bash
   cd API
   npm install
   ```

3. Configure o arquivo `.env` na pasta API com suas credenciais de banco de dados:
   ```
   DB_HOST=seu_host
   DB_USER=seu_usuario
   DB_PASSWORD=sua_senha
   DB_NAME=saldoverde
   JWT_SECRET=sua_chave_secreta
   ```

4. Instale as dependências do frontend:
   ```bash
   cd ../front
   npm install
   ```

5. Configure o arquivo `.env.local` na pasta front com a URL da API:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

### Executando o Projeto

Você precisará executar o backend e o frontend em terminais separados:

#### Backend (API)

```bash
cd API
node app.js
```
O servidor backend estará disponível em `http://localhost:3001`.

#### Frontend

```bash
cd front
npm run dev
```
O aplicativo frontend estará disponível em `http://localhost:3000`.

## 📦 Tecnologias Utilizadas

### Backend
- [Node.js](https://nodejs.org/) - Ambiente de execução JavaScript
- [Express](https://expressjs.com/) - Framework web para Node.js
- [PostgreSQL](https://postgresqlstudio.org/) - Sistema de gerenciamento de banco de dados

### Frontend
- [Next.js](https://nextjs.org/) - Framework React com renderização do lado do servidor
- [React](https://reactjs.org/) - Biblioteca JavaScript para construção de interfaces
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utilitário
- [Flowbite](https://flowbite.com/) - Biblioteca de componentes para Tailwind CSS
- [Chart.js](https://www.chartjs.org/) - Biblioteca para criação de gráficos

## 🗂️ Estrutura do Projeto

```
.
└── projeto-financias/
    ├── API/                   # Backend da aplicação
    │   ├── config/           # Configurações (banco de dados, etc)
    │   ├── controllers/      # Controladores da API
    │   ├── models/           # Modelos de dados
    │   ├── routes/           # Rotas da API
    │   ├── .env              # Variáveis de ambiente (não versionado)
    │   └── app.js            # Ponto de entrada do backend
    │
    └── front/                # Frontend da aplicação
        ├── app/              # Páginas e componentes Next.js
        ├── components/       # Componentes React reutilizáveis
        ├── context/          # Contextos React (autenticação, etc)
        ├── data/             # Dados estáticos
        ├── public/           # Arquivos públicos (imagens, etc)
        └── .env.local        # Variáveis de ambiente (não versionado)
```


## 📃 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 Desenvolvedores

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
  <p>Desenvolvido com 💚 pelo time SaldoVerde</p>
</div>