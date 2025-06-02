'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Registrar componentes do Chart.js
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AnalisePage()  {
  return (
    <ProtectedRoute>
      <Analise />
    </ProtectedRoute>
  );
};

const Analise = () => {
  const { authFetch, user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [periodo, setPeriodo] = useState('mes');
  const [categoriaId, setCategoriaId] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [dadosAnalise, setDadosAnalise] = useState(null);
  
  // Estados para o calendário e período personalizado
  const [tipoSelecao, setTipoSelecao] = useState('predefinido'); // 'predefinido', 'personalizado', 'mesEspecifico'
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [mesEspecifico, setMesEspecifico] = useState(new Date().getMonth()); // 0-11 (Jan-Dez)
  const [anoEspecifico, setAnoEspecifico] = useState(new Date().getFullYear());
  
  // Array com os meses do ano para exibição
  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  
  // Array com os anos disponíveis (últimos 5 anos até o atual)
  const anoAtual = new Date().getFullYear();
  const anos = Array.from({length: 6}, (_, i) => anoAtual - 5 + i);

  // Define a data de início e fim do mês específico
  const definirDatasDoMesEspecifico = () => {
    const primeiroDia = new Date(anoEspecifico, mesEspecifico, 1);
    const ultimoDia = new Date(anoEspecifico, mesEspecifico + 1, 0); // último dia do mês
    
    return {
      inicio: primeiroDia.toISOString().split('T')[0],
      fim: ultimoDia.toISOString().split('T')[0]
    };
  };

  // Função para formatar a data para o formato ISO (YYYY-MM-DD)
  const formatarData = (data) => {
    if (!data) return '';
    const d = new Date(data);
    return d.toISOString().split('T')[0];
  };
  
  // Inicializa valores padrão para datas quando componente for montado
  useEffect(() => {
    if (!dataInicio) {
      const hoje = new Date();
      const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
      setDataInicio(formatarData(inicioMes));
    }
    
    if (!dataFim) {
      const hoje = new Date();
      setDataFim(formatarData(hoje));
    }
  }, []);

  // Buscar dados apenas quando o componente é montado ou quando o usuário muda
  useEffect(() => {
    if (user) {
      buscarCategorias();
      buscarDadosAnalise(); // Busca inicial
    }
  }, [user]); // Remover dependências para evitar múltiplas requisições automáticas

  const buscarCategorias = async () => {
    try {
      const response = await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/categorias`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setCategorias(data);
        } else if (data.status === 'success' && Array.isArray(data.data)) {
          setCategorias(data.data);
        } else {
          setCategorias([]);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  const buscarDadosAnalise = async () => {
    try {
      setLoading(true);
      setError(null);

      let url = `${process.env.NEXT_PUBLIC_API_URL}/transacoes/analise?`;
      const params = new URLSearchParams();
      
      // Adicionar os parâmetros de acordo com o tipo de seleção
      if (tipoSelecao === 'predefinido') {
        // Períodos predefinidos (semana, mês, ano, etc)
        params.append('periodo', periodo);
      } 
      else if (tipoSelecao === 'mesEspecifico') {
        // Mês e ano específicos
        params.append('mes', mesEspecifico + 1); // API espera mês de 1-12, não 0-11
        params.append('ano', anoEspecifico);
      } 
      else if (tipoSelecao === 'personalizado') {
        // Datas específicas (período personalizado)
        params.append('data_inicio', dataInicio);
        params.append('data_fim', dataFim);
      }
      
      // Adicionar categoria se selecionada
      if (categoriaId) {
        params.append('categoria_id', categoriaId);
      }
      
      // Construir a URL final
      url += params.toString();
      
      console.log('URL da requisição:', url); // Log para depuração

      const response = await authFetch(url);
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          setDadosAnalise(data.data);
        } else {
          throw new Error(data.message || 'Erro ao buscar dados de análise');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao buscar dados de análise');
      }
    } catch (error) {
      console.error('Erro ao buscar dados de análise:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  // Preparar dados para o gráfico de pizza (gastos por categoria)
  const dadosGraficoPizza = {
    labels: dadosAnalise?.resultados?.map(item => item.nome || 'Sem categoria') || [],
    datasets: [
      {
        label: 'Gastos',
        data: dadosAnalise?.resultados?.map(item => item.total_saidas) || [],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',  // Verde esmeralda (primário)
          'rgba(5, 150, 105, 0.8)',   // Verde esmeralda escuro
          'rgba(4, 120, 87, 0.8)',    // Verde mais escuro
          'rgba(79, 70, 229, 0.8)',   // Indigo (contraste)
          'rgba(67, 56, 202, 0.8)',   // Indigo escuro
          'rgba(239, 68, 68, 0.8)',   // Vermelho (para destaque)
          'rgba(245, 158, 11, 0.8)',  // Âmbar
          'rgba(249, 115, 22, 0.8)',  // Laranja
        ],
        borderWidth: 1,
        borderColor: '#ffffff',
      },
    ],
  };

  // Preparar dados para o gráfico de barras (entradas vs saídas)
  const dadosGraficoBarras = {
    labels: dadosAnalise?.resultados?.map(item => item.nome || 'Sem categoria') || [],
    datasets: [
      {
        label: 'Entradas',
        data: dadosAnalise?.resultados?.map(item => item.total_entradas) || [],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',  // Verde esmeralda (entradas)
        borderColor: 'rgba(5, 150, 105, 1)',
        borderWidth: 1,
      },
      {
        label: 'Saídas',
        data: dadosAnalise?.resultados?.map(item => item.total_saidas) || [],
        backgroundColor: 'rgba(239, 68, 68, 0.8)',  // Vermelho (saídas)
        borderColor: 'rgba(220, 38, 38, 1)',
        borderWidth: 1,
      },
    ],
  };

  const opcoesGrafico = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: 'Inter, sans-serif',
            size: 12
          },
          padding: 20
        }
      },
      title: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          family: 'Inter, sans-serif',
          size: 14
        },
        bodyFont: {
          family: 'Inter, sans-serif',
          size: 13
        },
        padding: 12,
        cornerRadius: 8
      }
    },
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen max-w-7xl mx-auto ">
      <div className="container mx-auto px-4 py-10 max-w-7xl">
        {/* Header com design sofisticado */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 bg-white p-8 rounded-2xl shadow-lg border-l-4 border-emerald-600 transition-all duration-300 transform hover:shadow-xl">
          <div className="flex items-center">
            <div className="bg-emerald-100 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Análise Financeira</h1>
              <p className="text-gray-500">Visualize e acompanhe seus gastos e receitas</p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8 border border-gray-200 transition-all duration-300 hover:shadow-lg">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filtros de Análise
          </h2>
          {/* Seleção do tipo de período */}
          <div className="mb-4 border-b pb-4">
            <p className="text-sm text-gray-600 mb-3">Escolha como deseja visualizar o período:</p>
            <div className="flex space-x-2 mb-4">
              <button
                onClick={() => setTipoSelecao('predefinido')}
                className={`px-4 py-2 text-sm rounded-lg flex items-center ${tipoSelecao === 'predefinido' 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Períodos Predefinidos
              </button>
              <button
                onClick={() => setTipoSelecao('mesEspecifico')}
                className={`px-4 py-2 text-sm rounded-lg flex items-center ${tipoSelecao === 'mesEspecifico' 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Mês Específico
              </button>
              <button
                onClick={() => setTipoSelecao('personalizado')}
                className={`px-4 py-2 text-sm rounded-lg flex items-center ${tipoSelecao === 'personalizado' 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Período Personalizado
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Períodos predefinidos */}
            {tipoSelecao === 'predefinido' && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Período
                </label>
                <select
                  value={periodo}
                  onChange={(e) => setPeriodo(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="dia">Hoje</option>
                  <option value="semana">Última Semana</option>
                  <option value="mes">Mês Atual</option>
                  <option value="trimestre">Últimos 3 Meses</option>
                  <option value="semestre">Últimos 6 Meses</option>
                  <option value="ano">Ano Atual</option>
                </select>
              </div>
            )}
            
            {/* Seleção de mês específico */}
            {tipoSelecao === 'mesEspecifico' && (
              <>
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Mês
                  </label>
                  <select
                    value={mesEspecifico}
                    onChange={(e) => setMesEspecifico(parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  >
                    {meses.map((mes, index) => (
                      <option key={index} value={index}>{mes}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Ano
                  </label>
                  <select
                    value={anoEspecifico}
                    onChange={(e) => setAnoEspecifico(parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  >
                    {anos.map((ano) => (
                      <option key={ano} value={ano}>{ano}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
            
            {/* Período personalizado com datas específicas */}
            {tipoSelecao === 'personalizado' && (
              <>
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Data Inicial
                  </label>
                  <input
                    type="date"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Data Final
                  </label>
                  <input
                    type="date"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </>
            )}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Categoria
              </label>
              <select
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Todas as Categorias</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button 
                type="button"
                onClick={buscarDadosAnalise}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center transform hover:scale-105 w-full justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Atualizar Análise ({tipoSelecao === 'predefinido' ? periodo : tipoSelecao === 'mesEspecifico' ? `${meses[mesEspecifico]} de ${anoEspecifico}` : `${dataInicio} a ${dataFim}`})
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-gray-200 animate-pulse">
            <div className="flex justify-center mb-6">
              <div className="bg-emerald-50 p-5 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-emerald-400 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Carregando dados de análise</h3>
            <p className="text-gray-500 max-w-md mx-auto">Aguarde enquanto processamos suas informações financeiras...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl shadow-md p-8 border border-l-4 border-l-red-500 text-gray-700 mb-8 animate-fadeIn">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 p-3 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Erro ao carregar dados</h3>
                <p className="text-gray-600 mt-1">{error}</p>
              </div>
            </div>
            <button 
              onClick={() => buscarDadosAnalise()}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 transition-colors duration-300"
            >
              Tentar novamente
            </button>
          </div>
        ) : dadosAnalise && dadosAnalise.resultados && dadosAnalise.resultados.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
            {/* Resumo geral */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border-l-4 border-emerald-600 shadow-md transition-transform hover:scale-105 hover:shadow-lg">
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-emerald-100 rounded-lg mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium text-emerald-800">Total de Entradas</h3>
                </div>
                <p className="text-3xl font-bold text-gray-800">
                  {formatarMoeda(dadosAnalise.resultados.reduce((acc, item) => acc + (parseFloat(item.total_entradas) || 0), 0))}
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border-l-4 border-red-500 shadow-md transition-transform hover:scale-105 hover:shadow-lg">
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-red-100 rounded-lg mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium text-red-800">Total de Saídas</h3>
                </div>
                <p className="text-3xl font-bold text-gray-800">
                  {formatarMoeda(dadosAnalise.resultados.reduce((acc, item) => acc + (parseFloat(item.total_saidas) || 0), 0))}
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-l-4 border-blue-500 shadow-md transition-transform hover:scale-105 hover:shadow-lg">
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium text-blue-800">Saldo do Período</h3>
                </div>
                <p className="text-3xl font-bold text-gray-800">
                  {formatarMoeda(
                    dadosAnalise.resultados.reduce((acc, item) => acc + (parseFloat(item.total_entradas) || 0), 0) - 
                    dadosAnalise.resultados.reduce((acc, item) => acc + (parseFloat(item.total_saidas) || 0), 0)
                  )}
                </p>
              </div>
            </div>

            {/* Gráfico de pizza */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
                Gastos por Categoria
              </h2>
              <div className="h-80">
                <Pie data={dadosGraficoPizza} options={opcoesGrafico} />
              </div>
            </div>

            {/* Gráfico de barras */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Entradas vs Saídas por Categoria
              </h2>
              <div className="h-80">
                <Bar data={dadosGraficoBarras} options={opcoesGrafico} />
              </div>
            </div>
            
            {/* Tabela de detalhes */}
            <div className="bg-white p-6 rounded-2xl shadow-md md:col-span-2 border border-gray-200 transition-all duration-300 hover:shadow-lg">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Resumo Detalhado
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoria
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Entradas
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Saídas
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Saldo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dadosAnalise.resultados.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-emerald-600 font-medium text-sm">{(item.nome?.charAt(0) || "?").toUpperCase()}</span>
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.nome || 'Sem categoria'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-emerald-600 font-semibold bg-emerald-50 px-3 py-1 rounded-lg inline-block">
                            {formatarMoeda(item.total_entradas || 0)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-red-600 font-semibold bg-red-50 px-3 py-1 rounded-lg inline-block">
                            {formatarMoeda(item.total_saidas || 0)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-semibold px-3 py-1 rounded-lg inline-block ${
                            (item.total_entradas || 0) - (item.total_saidas || 0) >= 0 
                              ? 'text-emerald-600 bg-emerald-50' 
                              : 'text-red-600 bg-red-50'
                          }`}>
                            {formatarMoeda((item.total_entradas || 0) - (item.total_saidas || 0))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600 font-medium bg-gray-100 px-3 py-1 rounded-lg inline-block">
                            {item.quantidade || 0}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-l-4 border-l-yellow-500 animate-fadeIn">
            <div className="flex justify-center mb-6">
              <div className="bg-yellow-50 p-5 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">Sem dados para análise</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Nenhum dado encontrado para o período e categoria selecionados. Tente mudar os filtros ou adicionar transações.</p>
            <button 
              onClick={() => router.push('/transacoes')}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-medium px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center mx-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Adicionar Transações
            </button>
          </div>
        )}
      </div>
    </div>
  );
};