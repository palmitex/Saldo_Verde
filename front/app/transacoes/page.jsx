'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function TransacoesPage() {
  return (
    <ProtectedRoute>
      <Transacoes />
    </ProtectedRoute>
  );
}

function Transacoes() {
  const [transacoes, setTransacoes] = useState([]);
  const auth = useAuth();
  const router = useRouter();
  const [categorias, setCategorias] = useState([]);
  const [metas, setMetas] = useState([]);
  const [metaDetalhes, setMetaDetalhes] = useState(null);
  const [mostrarModalMeta, setMostrarModalMeta] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [novaTransacaoForm, setNovaTransacaoForm] = useState({
    descricao: '',
    valor: '',
    data: new Date().toISOString().split('T')[0],
    tipo: 'saida',
    categoria_id: '',
    meta_id: '',
    usuario_id: auth?.user?.id || null
  });

  useEffect(() => {
    if (auth?.user) {
      // Carregar dados ao iniciar
      buscarTransacoes();
      buscarCategorias();
      buscarMetas();
    }
  }, [auth?.user]);

  const buscarTransacoes = async () => {
    try {
      setLoading(true); // Ativar loading antes de buscar dados
      if (!auth?.user) {
        console.error('Usuário não autenticado');
        router.push('/login');
        return;
      }
      
      const response = await auth.authFetch(`${process.env.NEXT_PUBLIC_API_URL}/transacoes?userId=${auth.user.id}`);
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success' && data.data && Array.isArray(data.data.transacoes)) {
          setTransacoes(data.data.transacoes);
        } else {
          console.error('Formato de resposta inválido:', data);
          setTransacoes([]);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error(`Erro ao buscar transações: ${errorData.message || response.statusText}`);
        setTransacoes([]);
      }
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      setTransacoes([]);
    } finally {
      setLoading(false); // Desativar loading após buscar dados
    }
  };

  const buscarCategorias = async () => {
    try {
      if (!auth?.user) {
        console.error('Usuário não autenticado');
        return;
      }
      
      const response = await auth.authFetch(`${process.env.NEXT_PUBLIC_API_URL}/categorias`);
      if (response.ok) {
        const data = await response.json();
        setCategorias(Array.isArray(data) ? data : (data.status === 'success' && Array.isArray(data.data) ? data.data : []));
      } else {
        console.error(`Erro ao buscar categorias: ${response.status} ${response.statusText}`);
        setCategorias([]);
      }
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      setCategorias([]);
    }
  };

  const buscarMetas = async () => {
    try {
      if (!auth?.user) {
        console.error('Usuário não autenticado');
        return;
      }
      
      const response = await auth.authFetch(`${process.env.NEXT_PUBLIC_API_URL}/metas`);
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success' && Array.isArray(data.data)) {
          setMetas(data.data);
        } else if (Array.isArray(data)) {
          setMetas(data);
        } else {
          console.error('Formato de resposta inválido:', data);
          setMetas([]);
        }
      } else {
        console.error(`Erro ao buscar metas: ${response.status} ${response.statusText}`);
        setMetas([]);
      }
    } catch (error) {
      console.error('Erro ao buscar metas:', error);
      setMetas([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'meta_id' && value) {
      // Encontra a meta selecionada
      const metaSelecionada = metas.find(meta => meta.id == value);
      if (metaSelecionada) {
        // Preencher a descrição com o nome da meta
        // Preencher a categoria com a categoria associada à meta
        setNovaTransacaoForm({
          ...novaTransacaoForm,
          [name]: value,
          descricao: `Contribuição para meta: ${metaSelecionada.nome}`,
          categoria_id: metaSelecionada.categoria_id || '' // Selecionar a categoria da meta se existir
        });
        return;
      }
    }
    
    // Comportamento padrão para outros campos
    setNovaTransacaoForm({
      ...novaTransacaoForm,
      [name]: value
    });
  };

  const adicionarTransacao = async (e) => {
    e.preventDefault();
    
    if (submitting) return;

    try {
      setSubmitting(true);

      if (!auth?.user) {
        console.error('Usuário não autenticado');
        router.push('/login');
        return;
      }
      
      const response = await auth.authFetch(`${process.env.NEXT_PUBLIC_API_URL}/transacoes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...novaTransacaoForm,
          usuario_id: auth.user.id,
          valor: parseFloat(novaTransacaoForm.valor),
          categoria_id: novaTransacaoForm.categoria_id ? parseInt(novaTransacaoForm.categoria_id) : null,
          meta_id: novaTransacaoForm.meta_id ? parseInt(novaTransacaoForm.meta_id) : null
        }),
      });
  
      if (response.ok) {
        // Limpar formulário e recarregar transações
        setNovaTransacaoForm({
          descricao: '',
          valor: '',
          data: new Date().toISOString().split('T')[0],
          tipo: 'saida',
          categoria_id: '',
          meta_id: '',
          usuario_id: auth.user.id
        });
        buscarTransacoes();
        // Atualizar também a lista de metas, pois o progresso pode ter sido alterado
        if (novaTransacaoForm.meta_id) {
          buscarMetas();
        }
      } else {
        // Exibir mensagem de erro em um alerta
        const errorData = await response.json().catch(() => ({}));
        const mensagemErro = errorData.message || 'Erro ao adicionar transação';
        alert(mensagemErro);
        console.error(`Erro ao adicionar transação: ${response.status} ${response.statusText}`, errorData);
      }
    } catch (error) {
      alert('Erro ao adicionar transação: ' + (error.message || 'Erro desconhecido'));
      console.error('Erro ao adicionar transação:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatarData = (dataString) => {
    if (!dataString) return '-';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen py-8 max-w-7xl mx-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500 animate-fadeIn">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Minhas Transações</h1>
              <p className="text-gray-600">Gerencie suas entradas e saídas financeiras</p>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-gray-200 animate-pulse">
            <div className="flex justify-center mb-6">
              <div className="bg-blue-50 p-5 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Carregando suas transações</h3>
            <p className="text-gray-500 max-w-md mx-auto">Aguarde enquanto buscamos suas informações financeiras...</p>
          </div>
        ) : (
          <>
            {/* Resumo financeiro */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Card 1: Total de Entradas */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 transform transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total de Entradas</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(
                        transacoes
                          .filter(t => t.tipo === 'entrada')
                          .reduce((acc, t) => acc + parseFloat(t.valor), 0)
                      )}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Card 2: Total de Saídas */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 transform transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center">
                  <div className="bg-red-100 p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total de Saídas</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(
                        transacoes
                          .filter(t => t.tipo === 'saida')
                          .reduce((acc, t) => acc + parseFloat(t.valor), 0)
                      )}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Card 3: Saldo */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 transform transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Saldo</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(
                        transacoes.reduce((acc, t) => {
                          return acc + (t.tipo === 'entrada' ? parseFloat(t.valor) : -parseFloat(t.valor));
                        }, 0)
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Formulário de nova transação */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-200 transition-all duration-300 hover:shadow-xl">
              <h2 className="text-2xl font-semibold mb-8 text-gray-800 border-b pb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nova Transação
              </h2>
              
              <form onSubmit={adicionarTransacao} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Descrição
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="descricao"
                      value={novaTransacaoForm.descricao}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white shadow-sm"
                      placeholder="Descrição da transação"
                      required
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2a2 2 0 0 0-2 2v1a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Valor (R$)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="valor"
                      value={novaTransacaoForm.valor}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white shadow-sm"
                      placeholder="0,00"
                      step="0.01"
                      min="0"
                      required
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="bg-emerald-100 rounded-md px-2 py-1 text-emerald-700 font-medium">R$</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Data
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="data"
                      value={novaTransacaoForm.data}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white shadow-sm"
                      required
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                    Tipo
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="relative flex cursor-pointer border border-gray-300 bg-gray-50 hover:bg-white rounded-xl p-3 shadow-sm transition-all duration-200">
                      <input
                        type="radio"
                        name="tipo"
                        value="entrada"
                        checked={novaTransacaoForm.tipo === 'entrada'}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-center w-full space-x-2">
                        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${novaTransacaoForm.tipo === 'entrada' ? 'border-emerald-500 bg-emerald-500' : 'border-gray-400'}`}>
                          {novaTransacaoForm.tipo === 'entrada' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8h-8" />
                          </svg>
                          <span className={`text-sm font-medium ${novaTransacaoForm.tipo === 'entrada' ? 'text-emerald-700' : 'text-gray-700'}`}>Entrada</span>
                        </div>
                      </div>
                      <div className={`absolute inset-y-0 left-0 w-1 ${novaTransacaoForm.tipo === 'entrada' ? 'bg-emerald-500' : 'bg-transparent'} rounded-l-xl transition-all duration-200`}></div>
                    </label>
                    
                    <label className="relative flex cursor-pointer border border-gray-300 bg-gray-50 hover:bg-white rounded-xl p-3 shadow-sm transition-all duration-200">
                      <input
                        type="radio"
                        name="tipo"
                        value="saida"
                        checked={novaTransacaoForm.tipo === 'saida'}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-center w-full space-x-2">
                        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${novaTransacaoForm.tipo === 'saida' ? 'border-red-500 bg-red-500' : 'border-gray-400'}`}>
                          {novaTransacaoForm.tipo === 'saida' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                          <span className={`text-sm font-medium ${novaTransacaoForm.tipo === 'saida' ? 'text-red-700' : 'text-gray-700'}`}>Saída</span>
                        </div>
                      </div>
                      <div className={`absolute inset-y-0 left-0 w-1 ${novaTransacaoForm.tipo === 'saida' ? 'bg-red-500' : 'bg-transparent'} rounded-l-xl transition-all duration-200`}></div>
                    </label>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 016.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                    Categoria
                  </label>
                  <div className="relative">
                    <select
                      name="categoria_id"
                      value={novaTransacaoForm.categoria_id}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl pl-12 pr-10 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white shadow-sm appearance-none"
                    >
                      <option value="">Selecione uma categoria (opcional)</option>
                      {categorias.map((categoria) => (
                        <option key={categoria.id} value={categoria.id}>
                          {categoria.nome}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    Meta (opcional)
                  </label>
                  <div className="relative">
                    <select
                      name="meta_id"
                      value={novaTransacaoForm.meta_id}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl pl-12 pr-10 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white shadow-sm appearance-none"
                    >
                      <option value="">Selecione uma meta (opcional)</option>
                      {metas.map((meta) => (
                        <option key={meta.id} value={meta.id}>
                          {meta.nome}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2 flex justify-end space-x-3 mt-8">
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className={`bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium px-8 py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center transform hover:scale-105 relative overflow-hidden group ${
                      submitting ? 'opacity-75 cursor-not-allowed' : 'hover:opacity-90'
                    }`}
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="relative">Processando...</span>
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="relative">Adicionar Transação</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
            
            {/* Lista de transações */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Histórico de Transações
                </h2>
              </div>
              
              <div className="overflow-x-auto">
                {transacoes.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="bg-gray-50 p-4 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Nenhuma transação encontrada</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Comece a registrar suas transações financeiras para acompanhar seus gastos e receitas.
                    </p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Descrição
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Valor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Categoria
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Meta
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {transacoes.map((transacao) => (
                        <tr 
                          key={transacao.id} 
                          className={`hover:bg-gray-50 transition-colors duration-150 ${
                            transacao.tipo === 'entrada' 
                              ? 'border-l-4 border-green-400' 
                              : 'border-l-4 border-red-400'
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{transacao.descricao}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm font-medium ${transacao.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                              {new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                              }).format(transacao.valor)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatarData(transacao.data)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                transacao.tipo === 'entrada'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {transacao.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {transacao.categoria_nome ? (
                              <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-500 text-green-800">
                                {transacao.categoria_nome}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-500">Sem categoria</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {transacao.meta_nome ? (
                              <button 
                                onClick={() => {
                                  const meta = metas.find(m => m.id === transacao.meta_id);
                                  if (meta) {
                                    setMetaDetalhes(meta);
                                    setMostrarModalMeta(true);
                                  }
                                }}
                                className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-500 text-green-800 hover:bg-green-200 transition-colors duration-200"
                              >
                                {transacao.meta_nome}
                              </button>
                            ) : (
                              <span className="text-sm text-gray-500">Sem meta</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
            
            {/* Modal para exibir detalhes da meta */}
            {mostrarModalMeta && metaDetalhes && (
              <div className="fixed inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
                <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-2xl max-w-md w-full border border-white/20 animate-fadeIn transform transition-all duration-300 hover:shadow-green-300/20">
                  {/* Cabeçalho com título e botão de fechar */}
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-500">
                      {metaDetalhes.nome}
                    </h2>
                    <button 
                      onClick={() => setMostrarModalMeta(false)}
                      className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full text-gray-500 hover:text-gray-700 transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Bloco de valores */}
                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-xl mb-6 shadow-inner border border-emerald-100">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-emerald-100 transition-all duration-300 hover:shadow-md">
                        <p className="text-xs font-medium text-emerald-600 mb-1 uppercase tracking-wider">Valor atual</p>
                        <p className="text-xl font-bold text-gray-800">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(metaDetalhes.valor_inicial)}
                        </p>
                      </div>
                      <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-emerald-100 transition-all duration-300 hover:shadow-md">
                        <p className="text-xs font-medium text-emerald-600 mb-1 uppercase tracking-wider">Valor objetivo</p>
                        <p className="text-xl font-bold text-gray-800">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(metaDetalhes.valor_objetivo)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bloco de progresso */}
                  <div className="mb-6 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-bold text-gray-700">Progresso</p>
                      <span className="text-sm font-bold px-3 py-1 bg-green-100 text-green-800 rounded-full">
                        {Math.min(Math.round((metaDetalhes.valor_inicial / metaDetalhes.valor_objetivo) * 100), 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 mb-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-400 h-3 rounded-full shadow-inner transition-all duration-1000 ease-in-out" 
                        style={{ width: `${Math.min((metaDetalhes.valor_inicial / metaDetalhes.valor_objetivo) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Meta iniciada</span>
                      <span className="text-xs font-medium text-emerald-600">Meta até: {formatarData(metaDetalhes.prazo)}</span>
                    </div>
                  </div>
                  
                  {/* Botões de ação */}
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={() => {
                        setMostrarModalMeta(false);
                        router.push('/metas');
                      }}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:translate-y-[-2px] flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Ver Detalhes da Meta
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
                
                
      
              




