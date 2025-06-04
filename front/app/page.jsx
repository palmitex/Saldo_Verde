'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const auth = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, [auth?.user]);



  return (
    <div className={`overflow-hidden transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
      {/* Hero Section */}
      <section className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-gradient-to-b from-gray-200 to-gray-300 py-16 px-4 md:px-8 lg:px-16 mb-16 rounded-b-2xl">
        <div className="max-w-7xl mx-auto">
          <div className="container mx-auto flex flex-row md:flex-row items-center max-h-200px">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-6">
                Controle financeiro simplificado para sua vida
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Organize suas finanças, estabeleça metas e acompanhe seu progresso com facilidade
              </p>

              {!auth?.user && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/registro" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center">
                    Comece Grátis
                  </Link>
                  <Link href="/login" className="bg-white text-green-600 border-2 border-green-600 hover:bg-green-500 hover:text-white hover:border-green-500 font-semibold py-3 px-6 rounded-lg transition-colors text-center">
                    Já tenho uma conta
                  </Link>
                </div>
              )}
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-lg h-80 md:h-96">
                <Image
                  src="/principal_home.svg"
                  alt="Controle financeiro"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
            Por que escolher o SaldoVerde?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gradient-to-b from-gray-200 to-gray-300 p-8 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-3 duration-300 border border-gray-300">
              <div className="text-5xl mb-4 flex justify-center">
                <img src="/sobre1.svg" alt="Planejamento financeiro" className="w-24 h-24" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Planejamento inteligente</h3>
              <p className="text-gray-600">Organize seu orçamento mensal e planeje seus gastos com antecedência</p>
            </div>
            <div className="bg-gradient-to-b from-gray-200 to-gray-300 p-8 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-3 duration-300 border border-gray-300">
              <div className="text-5xl mb-4 flex justify-center">
                <img src="/sobre2.svg" alt="Reserva financeira" className="w-24 h-24" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Construa sua reserva</h3>
              <p className="text-gray-600">Acompanhe o crescimento da sua reserva de emergência e investimentos</p>
            </div>
            <div className="bg-gradient-to-b from-gray-200 to-gray-300 p-8 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-3 duration-300 border border-gray-300">
              <div className="text-5xl mb-4 flex justify-center">
                <img src="/porco_rico.svg" alt="Economizar dinheiro" className="w-24 h-24" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Economize com consciência</h3>
              <p className="text-gray-600">Identifique padrões de gastos e descubra oportunidades para economizar</p>
            </div>
            <div className="bg-gradient-to-b from-gray-200 to-gray-300 p-8 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-3 duration-300 border border-gray-300">
              <div className="text-5xl mb-4 flex justify-center">
                <img src="/sobre4.svg" alt="Realize seus sonhos" className="w-24 h-24" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Realize seus sonhos</h3>
              <p className="text-gray-600">Transforme objetivos em realidade com planejamento financeiro estruturado</p>
            </div>
          </div>
        </div>
      </section>

      {/* NOVA SEÇÃO: Conheça Nossas Funcionalidades */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-gray-50 border-t border-b border-gray-300">
        <div className="container mx-auto text-center max-w-7xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Conheça Nossas Funcionalidades
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Ferramentas poderosas para transformar sua vida financeira
          </p>
          
          {/* Metas */}
          <div className="flex flex-col md:flex-row items-center mb-16 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="md:w-1/2 p-8 md:p-12 text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Metas Financeiras</h3>
              <p className="text-gray-600 mb-6">
                Estabeleça objetivos claros para suas economias e investimentos. Com o sistema de metas do Saldo Verde, você pode:
              </p>
              <ul className="list-disc pl-5 mb-6 text-gray-600 space-y-2">
                <li>Definir valores e prazos para cada objetivo</li>
                <li>Acompanhar o progresso em tempo real</li>
                <li>Receber notificações sobre seu desempenho</li>
                <li>Visualizar transações relacionadas a cada meta</li>
                <li>Celebrar conquistas ao atingir seus objetivos</li>
              </ul>
              <Link href="/metas" className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
                Criar Metas
              </Link>
            </div>
            <div className="md:w-1/2 bg-gray-100 p-8 flex justify-center items-center">
              <div className="relative w-full h-64 md:h-80">
                <Image
                  src="/alvo_home.svg"
                  alt="Metas Financeiras"
                  layout="fill"
                  objectFit="contain"
                  className="p-4"
                />
              </div>
            </div>
          </div>
          
          {/* Categorias */}
          <div className="flex flex-col md:flex-row-reverse items-center mb-16 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="md:w-1/2 p-8 md:p-12 text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Categorias Personalizadas</h3>
              <p className="text-gray-600 mb-6">
                Organize suas transações de forma inteligente com categorias personalizáveis. Com o sistema de categorias, você pode:
              </p>
              <ul className="list-disc pl-5 mb-6 text-gray-600 space-y-2">
                <li>Criar categorias com cores e ícones personalizados</li>
                <li>Classificar receitas e despesas de forma organizada</li>
                <li>Identificar padrões de gastos por categoria</li>
                <li>Filtrar transações por categoria específica</li>
                <li>Adaptar o sistema às suas necessidades financeiras</li>
              </ul>
              <Link href="/categorias" className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
                Gerenciar Categorias
              </Link>
            </div>
            <div className="md:w-1/2 bg-gray-100 p-8 flex justify-center items-center">
              <div className="relative w-full h-64 md:h-80">
                <Image
                  src="/porco_rico.svg"
                  alt="Categorias Personalizadas"
                  layout="fill"
                  objectFit="contain"
                  className="p-4"
                />
              </div>
            </div>
          </div>
          
          {/* Análises e Gráficos */}
          <div className="flex flex-col md:flex-row items-center mb-8 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="md:w-1/2 p-8 md:p-12 text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Análises e Gráficos</h3>
              <p className="text-gray-600 mb-6">
                Visualize suas finanças de forma clara e intuitiva com gráficos e relatórios detalhados. Com o sistema de análise, você pode:
              </p>
              <ul className="list-disc pl-5 mb-6 text-gray-600 space-y-2">
                <li>Visualizar a distribuição de gastos por categoria</li>
                <li>Comparar receitas e despesas ao longo do tempo</li>
                <li>Identificar tendências e padrões financeiros</li>
                <li>Analisar períodos específicos (mês, trimestre, ano)</li>
                <li>Exportar relatórios para melhor planejamento</li>
              </ul>
              <Link href="/analise" className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
                Ver Análises
              </Link>
            </div>
            <div className="md:w-1/2 bg-gray-100 p-8 flex justify-center items-center">
              <div className="relative w-full h-64 md:h-80">
                <Image
                  src="/grafico_home.svg"
                  alt="Análises e Gráficos"
                  layout="fill"
                  objectFit="contain"
                  className="p-4"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NOVA SEÇÃO: Dicas Financeiras */}
      <section className="py-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Dicas para Organizar suas Finanças
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Pequenas mudanças que podem transformar sua relação com o dinheiro
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Orçamento Mensal</h3>
              <p className="text-gray-600">
                Crie um orçamento mensal detalhado, registrando todas as suas receitas e despesas. Use o Saldo Verde para automatizar esse processo e ter uma visão clara do seu fluxo financeiro.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Reserva de Emergência</h3>
              <p className="text-gray-600">
                Estabeleça uma meta para criar uma reserva de emergência equivalente a 3-6 meses de despesas. Isso te dará segurança financeira para enfrentar imprevistos sem comprometer seu orçamento.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Investimentos Regulares</h3>
              <p className="text-gray-600">
                Invista regularmente, mesmo que pequenas quantias. O segredo está na consistência e no poder dos juros compostos ao longo do tempo. Use o Saldo Verde para acompanhar o crescimento dos seus investimentos.
              </p>
            </div>
          </div>
          
          <div className="mt-12">
            <Link href="/blog" className="inline-block bg-white text-green-600 border-2 border-green-600 hover:bg-green-600 hover:text-white font-semibold py-3 px-8 rounded-lg transition-colors">
              Mais Dicas no Nosso Blog
            </Link>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-gray-50 border-t border-b border-gray-300 max-w-7xl mx-auto">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
            Como funciona
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="w-full sm:w-64 flex flex-col items-center">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Cadastre-se gratuitamente</h3>
              <p className="text-gray-600">Crie sua conta em menos de 2 minutos</p>
            </div>
            <div className="w-full sm:w-64 flex flex-col items-center">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Registre suas transações</h3>
              <p className="text-gray-600">Adicione suas receitas e despesas de forma simples</p>
            </div>
            <div className="w-full sm:w-64 flex flex-col items-center">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Defina suas metas</h3>
              <p className="text-gray-600">Estabeleça objetivos financeiros realistas</p>
            </div>
            <div className="w-full sm:w-64 flex flex-col items-center">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-6">
                4
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Acompanhe seu progresso</h3>
              <p className="text-gray-600">Visualize relatórios e alcance a liberdade financeira</p>
            </div>
          </div>
        </div>
      </section>

      {/* Estatísticas */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-gray-100 border-t border-gray-300">
        <div className="container mx-auto text-center max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
            Juntos, estamos fazendo a diferença
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { valor: '15.000+', descricao: 'Usuários ativos' },
              { valor: 'R$ 4M+', descricao: 'Gerenciados na plataforma' },
              { valor: '95%', descricao: 'Taxa de satisfação dos usuários' }
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-white rounded-xl border border-gray-300 shadow-sm">
                <div className="text-2xl font-bold text-green-700 mb-2">{item.valor}</div>
                <p className="text-gray-700">{item.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Depoimentos */}
      <section className="py-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
            O que nossos usuários dizem
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-l from-gray-200 to-gray-300 p-6 rounded-xl shadow-md border border-gray-300">
              <p className="text-gray-700 italic mb-6">
                "Finalmente consegui organizar minhas finanças e economizar para realizar meus sonhos!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <Image src="/user1.jpg" alt="Ana Silva" width={48} height={48} />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-gray-800">Ana Silva</h4>
                  <p className="text-sm text-gray-600">Usuária desde 2022</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-l from-gray-200 to-gray-300 p-6 rounded-xl shadow-md border border-gray-300">
              <p className="text-gray-700 italic mb-6">
                "A melhor plataforma para controle financeiro que já usei. Simples e completa ao mesmo tempo."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <Image src="/user2.jpg" alt="Carlos Mendes" width={48} height={48} />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-gray-800">Carlos Mendes</h4>
                  <p className="text-sm text-gray-600">Usuário desde 2021</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-l from-gray-200 to-gray-300 p-6 rounded-xl shadow-md border border-gray-300">
              <p className="text-gray-700 italic mb-6">
                "Graças ao Saldo Verde consegui sair das dívidas e começar a investir. Recomendo a todos!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <Image src="/user3.jpg" alt="Juliana Costa" width={48} height={48} />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-gray-800">Juliana Costa</h4>
                  <p className="text-sm text-gray-600">Usuária desde 2023</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-gradient-to-br from-green-600 to-green-800 rounded-t-2xl mt-16">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Pronto para transformar sua vida financeira?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Junte-se a milhares de pessoas que já estão no controle de suas finanças
          </p>
          {!auth?.user && (
            <Link href="/registro" className="inline-block bg-white text-green-700 hover:bg-gray-300 hover:text-green-500 font-semibold py-4 px-8 rounded-lg text-xl transition-colors">
              Começar agora
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
