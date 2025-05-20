'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Registrar componentes do Chart.js
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AnalisePage = () => {
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

  useEffect(() => {
    if (user) {
      buscarCategorias();
      buscarDadosAnalise();
    }
  }, [user, periodo, categoriaId]);

  const buscarCategorias = async () => {
    try {
      const response = await authFetch('http://localhost:3001/categorias');
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

      let url = `http://localhost:3001/transacoes/analise?periodo=${periodo}`;
      if (categoriaId) {
        url += `&categoria_id=${categoriaId}`;
      }

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
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(199, 199, 199, 0.6)',
        ],
        borderWidth: 1,
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
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Saídas',
        data: dadosAnalise?.resultados?.map(item => item.total_saidas) || [],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  const opcoesGrafico = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Análise Financeira',
      },
    },
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Análise Financeira</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="semana">Última Semana</option>
              <option value="mes">Mês Atual</option>
              <option value="ano">Ano Atual</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Todas as Categorias</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nome}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dados de análise...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      ) : dadosAnalise && dadosAnalise.resultados && dadosAnalise.resultados.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Gastos por Categoria</h2>
            <div className="h-80">
              <Pie data={dadosGraficoPizza} options={opcoesGrafico} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Entradas vs Saídas por Categoria</h2>
            <div className="h-80">
              <Bar data={dadosGraficoBarras} options={opcoesGrafico} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Resumo Detalhado</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
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
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {item.nome || 'Sem categoria'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-green-600">
                          {formatarMoeda(item.total_entradas || 0)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-red-600">
                          {formatarMoeda(item.total_saidas || 0)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${(item.total_entradas || 0) - (item.total_saidas || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatarMoeda((item.total_entradas || 0) - (item.total_saidas || 0))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
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
        <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <p>Nenhum dado encontrado para o período e categoria selecionados.</p>
        </div>
      )}
    </div>
  );
};

export default AnalisePage;