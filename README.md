# SaldoVerde - Controle Financeiro Pessoal para Jovens Estudantes
SaldoVerde é uma aplicação de controle financeiro pessoal desenvolvida com o intuito de ajudar jovens estudantes a organizarem suas finanças, promoverem o planejamento financeiro e adquirirem conhecimento sobre a gestão do dinheiro. A plataforma oferece funcionalidades para registrar entradas e saídas financeiras, visualizar gráficos e análises, acompanhar metas financeiras e receber alertas e notificações, tudo com um design simples, interativo e educativo.

Objetivo
O objetivo principal do SaldoVerde é proporcionar aos jovens estudantes as ferramentas necessárias para controlar suas finanças pessoais de forma intuitiva, eficaz e educativa. Além de ser uma solução prática para o dia a dia financeiro, a aplicação visa promover a educação financeira, oferecendo conteúdo relevante e interativo para que o usuário aprenda a gerenciar suas finanças com responsabilidade e segurança.

Funcionalidades
Cadastro de Entradas e Saídas: Registre todas as movimentações financeiras, como mesada, despesas com alimentação, transporte, lazer, entre outras. Organize suas finanças de forma clara e simples.

Dashboard com Visão Geral: Acompanhe o saldo atual, visualize as entradas e saídas do mês e receba alertas quando ultrapassar o orçamento de alguma categoria.

Metas Financeiras: Defina metas financeiras, como "Economizar para um celular" ou "Pagar uma dívida". Acompanhe o progresso e receba notificações quando atingir suas metas.

Gráficos e Análises Visuais: Visualize gráficos interativos para entender como você está gastando, economizando e evoluindo ao longo do tempo.

Notificações e Alertas: Receba alertas sobre gastos excessivos, lembretes de pagamento e notificações de progresso nas suas metas financeiras.

Educação Financeira: Aprenda sobre finanças pessoais com dicas diárias e um glossário fácil de entender para melhorar sua gestão do dinheiro.

Tecnologias Utilizadas
Front-End: Desenvolvido com Next.js para uma experiência de usuário interativa, com páginas dinâmicas e reutilizáveis.

Back-End: Utiliza Node.js para a construção da lógica de servidor e persistência de dados.

Banco de Dados: A aplicação utiliza MongoDB para armazenar dados como entradas, saídas, metas financeiras e histórico de transações.

CSS Framework: TailwindCSS foi utilizado para estilização, garantindo um design moderno e responsivo.

Instalação e Execução
Pré-requisitos
Antes de rodar o projeto, você precisará ter os seguintes softwares instalados:

Node.js (LTS)

npm ou yarn

MongoDB (ou você pode usar o MongoDB Atlas para banco de dados hospedado)

Passos para rodar a aplicação localmente:
Clone o repositório:

bash
Copiar
Editar
git clone https://github.com/seu-usuario/saldoverde.git
Navegue até a pasta do projeto:

bash
Copiar
Editar
cd saldoverde
Instale as dependências:

bash
Copiar
Editar
npm install
Crie um arquivo .env na raiz do projeto e configure suas variáveis de ambiente, como a URL de conexão com o banco de dados MongoDB.

Inicie o servidor de desenvolvimento:

bash
Copiar
Editar
npm run dev
Acesse a aplicação no seu navegador:

bash
Copiar
Editar
http://localhost:3000
Estrutura de Diretórios
bash
Copiar
Editar
/saldoverde
|-- /components    # Componentes reutilizáveis da interface
|-- /pages        # Páginas da aplicação
|-- /public       # Arquivos estáticos (imagens, ícones, etc.)
|-- /styles       # Estilos globais (CSS)
|-- /models       # Modelos do banco de dados (MongoDB)
|-- /controllers  # Funções que lidam com a lógica do servidor
|-- /utils        # Funções utilitárias, helpers
Testes
Para rodar os testes, utilize o comando:

bash
Copiar
Editar
npm run test
Certifique-se de que os testes estão cobrindo as funcionalidades principais do sistema, como cadastro de transações, gerenciamento de metas e cálculos de saldo.

Contribuindo
Se você deseja contribuir para o desenvolvimento do SaldoVerde, siga as etapas abaixo:

Faça um fork deste repositório.

Crie uma branch para sua modificação (git checkout -b feature/nome-da-sua-feature).

Realize suas modificações e crie os commits (git commit -am 'Adicionando nova funcionalidade').

Envie suas alterações para o repositório original (git push origin feature/nome-da-sua-feature).

Abra um pull request explicando suas modificações.

Licença
Este projeto é licenciado sob a licença MIT - veja o arquivo LICENSE para mais detalhes.

Conclusão
O SaldoVerde não é apenas uma aplicação de controle financeiro pessoal, mas uma ferramenta educativa que promove a conscientização sobre a importância da educação financeira. Com funcionalidades inovadoras, uma interface intuitiva e uma experiência enriquecedora, o SaldoVerde visa ajudar os jovens estudantes a desenvolverem bons hábitos financeiros que os acompanharão ao longo da vida.

Contato
Se você tiver dúvidas ou sugestões sobre o projeto, entre em contato através do e-mail: [seu-email@dominio.com].
 
