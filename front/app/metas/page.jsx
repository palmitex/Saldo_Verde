'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function MetasPage() {
  return (
    <ProtectedRoute>
      <Metas />
    </ProtectedRoute>
  );
}

function Metas() {
  const [metas, setMetas] = useState([]);
  const auth = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: '',
    valor_objetivo: '',
    valor_inicial: '',
    prazo: new Date().toISOString().split('T')[0],
    categoria_id: '',
    usuario_id: auth?.user?.id || null
  });
  const [editando, setEditando] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [transacoesPorMeta, setTransacoesPorMeta] = useState({});
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    if (auth?.user) {
      buscarMetas();
      buscarCategorias();
    }
  }, [auth?.user]);

  const buscarCategorias = async () => {
    try {
      if (!auth?.user) {
        console.error('Usuário não autenticado');
        return;
      }
      
      const response = await auth.authFetch('http://localhost:3001/categorias');
      if (response.ok) {
        const data = await response.json();
        // Garantir que data seja sempre um array
        setCategorias(Array.isArray(data) ? data : (data.data ? data.data : []));
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
        router.push('/login');
        return;
      }
      console.log('Buscando metas para usuário:', auth.user.id);
      
      // Usar o endpoint correto
      const response = await auth.authFetch('http://localhost:3001/metas');
      console.log('Resposta da API:', response);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Dados recebidos:', data);
        
        if (data.status === 'success' && Array.isArray(data.data)) {
          console.log('Metas encontradas:', data.data);
          setMetas(data.data);
        } else if (Array.isArray(data)) {
          // Caso a API retorne diretamente um array
          console.log('Metas encontradas (formato alternativo):', data);
          setMetas(data);
        } else {
          console.error('Formato de dados inválido:', data);
          setMetas([]);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Erro na resposta:', errorData);
        setMetas([]);
        // Remover o alerta para evitar mensagens irritantes para o usuário
        console.error(`Erro ao buscar metas: ${errorData.message || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro ao buscar metas:', error);
      setMetas([]);
      // Remover o alerta para evitar mensagens irritantes para o usuário
      console.error(`Erro ao buscar metas: ${error.message || 'Erro desconhecido'}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!auth?.user) {
        console.error('Usuário não autenticado');
        router.push('/login');
        return;
      }

      // Validar campos obrigatórios
      if (!formData.nome || !formData.valor_objetivo || !formData.valor_inicial || !formData.prazo) {
        alert('Por favor, preencha todos os campos obrigatórios: Nome, Valor Objetivo, Valor Inicial e Prazo');
        return;
      }

      // Validar valor objetivo
      const valorObjetivo = parseFloat(formData.valor_objetivo);
      if (isNaN(valorObjetivo) || valorObjetivo <= 0) {
        alert('O valor objetivo deve ser um número positivo');
        return;
      }

      // Validar valor inicial
      const valorInicial = parseFloat(formData.valor_inicial);
      if (isNaN(valorInicial) || valorInicial < 0) {
        alert('O valor inicial deve ser um número não negativo');
        return;
      }

      // Validar prazo
      const dataPrazo = new Date(formData.prazo);
      const hoje = new Date();
      if (dataPrazo < hoje) {
        alert('O prazo deve ser uma data futura');
        return;
      }
      
      const metaData = {
        ...formData,
        usuario_id: auth.user.id,
        valor_objetivo: valorObjetivo,
        valor_inicial: valorInicial,
        nome: formData.nome.trim()
      };
      
      console.log('Dados da meta a ser enviada:', metaData);
      
      let response;
      
      if (editando) {
        // Verificar se a meta pertence ao usuário atual
        const metaAtual = metas.find(m => m.id === editando);
        if (!metaAtual) {
          alert('Meta não encontrada.');
          return;
        }
        
        // Verificar se o usuário é o proprietário da meta antes de tentar atualizar
        if (String(metaAtual.usuario_id) !== String(auth.user.id)) {
          alert('Você não tem permissão para editar esta meta');
          return;
        }
        
        // Simplificar a requisição para usar apenas o método padrão de authFetch
        response = await auth.authFetch(`http://localhost:3001/metas/${editando}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...metaData,
            usuario_id: parseInt(auth.user.id) // Garantir que seja número no corpo
          }),
        });
      } else {
        response = await auth.authFetch('http://localhost:3001/metas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(metaData),
        });
      }
      
      console.log('Resposta da API:', response);
      
      if (response.ok) {
        const responseData = await response.json();
        console.log('Dados da resposta:', responseData);
        
        setFormData({
          nome: '',
          valor_objetivo: '',
          valor_inicial: '',
          prazo: new Date().toISOString().split('T')[0],
          usuario_id: auth.user.id
        });
        setEditando(null);
        setMostrarForm(false);
        
        // Buscar metas atualizadas
        await buscarMetas();
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error(`Erro ao salvar meta: ${response.status} ${response.statusText}`, errorData);
        alert(errorData.message || 'Erro ao salvar meta. Por favor, tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao salvar meta:', error);
      alert('Erro ao salvar meta. Por favor, tente novamente.');
    }
  };

  const handleEditar = (meta) => {
    setFormData({
      nome: meta.nome,
      valor_objetivo: meta.valor_objetivo,
      valor_inicial: meta.valor_inicial,
      prazo: meta.prazo ? meta.prazo.split('T')[0] : '',
      categoria_id: meta.categoria_id || '',
      usuario_id: meta.usuario_id
    });
    setEditando(meta.id);
    setMostrarForm(true);
  };

  const handleExcluir = async (id) => {
    if (confirm('Tem certeza que deseja excluir esta meta?')) {
      try {
        if (!auth?.user) {
          console.error('Usuário não autenticado');
          router.push('/login');
          return;
        }
        
        // Usar fetch nativo em vez de authFetch para ter mais controle sobre o tratamento de erros
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3001/metas/${id}?userId=${auth.user.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
          }
        });
        
        if (response.ok) {
          buscarMetas();
        } else {
          // Tratar o erro de forma mais robusta
          let mensagemErro = 'Erro ao excluir meta';
          try {
            const errorData = await response.json();
            mensagemErro = errorData.message || 'Erro ao excluir meta';
          } catch (e) {
            console.error('Erro ao processar resposta:', e);
          }
          
          console.error(`Erro ao excluir meta: ${response.status} ${response.statusText}`);
          alert(mensagemErro);
        }
      } catch (error) {
        console.error('Erro ao excluir meta:', error);
        alert('Erro ao excluir meta: ' + (error.message || 'Erro desconhecido'));
      }
    }
  };

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const buscarTransacoesDaMeta = async (metaId) => {
    try {
      if (!auth?.user) {
        console.error('Usuário não autenticado');
        router.push('/login');
        return;
      }
      
      const response = await auth.authFetch(`http://localhost:3001/transacoes?meta_id=${metaId}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success' && data.data && Array.isArray(data.data.transacoes)) {
          // Atualizar o estado com as transações desta meta
          setTransacoesPorMeta(prev => ({
            ...prev,
            [metaId]: data.data.transacoes
          }));
        } else {
          console.error('Formato de resposta inválido:', data);
          setTransacoesPorMeta(prev => ({
            ...prev,
            [metaId]: []
          }));
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error(`Erro ao buscar transações da meta: ${errorData.message || response.statusText}`);
        setTransacoesPorMeta(prev => ({
          ...prev,
          [metaId]: []
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar transações da meta:', error);
      setTransacoesPorMeta(prev => ({
        ...prev,
        [metaId]: []
      }));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Minhas Metas</h1>
      
      <button 
        onClick={() => {
          setFormData({
            nome: '',
            valor_objetivo: '',
            valor_inicial: '',
            prazo: new Date().toISOString().split('T')[0],
            categoria_id: '',
            usuario_id: auth?.user?.id || null
          });
          setEditando(null);
          setMostrarForm(!mostrarForm);
        }}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mb-4"
      >
        {mostrarForm ? 'Cancelar' : 'Nova Meta'}
      </button>
      
      {mostrarForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">{editando ? 'Editar Meta' : 'Nova Meta'}</h2>
          
          <div className="mb-4">
            <label className="block mb-1">Nome</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-1">Categoria</label>
            <select
              name="categoria_id"
              value={formData.categoria_id}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Selecione uma categoria (opcional)</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nome}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block mb-1">Valor Objetivo (R$)</label>
            <input
              type="number"
              name="valor_objetivo"
              value={formData.valor_objetivo}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Valor(R$)</label>
            <input
              type="number"
              name="valor_inicial"
              value={formData.valor_inicial}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              min="0"
              step="0.01"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-1">Prazo</label>
            <input
              type="date"
              name="prazo"
              value={formData.prazo}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            {editando ? 'Atualizar' : 'Salvar'}
          </button>
        </form>
      )}
      
      {metas.length === 0 ? (
        <p>Você ainda não tem metas cadastradas.</p>
      ) : (
        <ul className="space-y-4">
          {metas.map((meta) => (
            <li key={meta.id} className="border p-4 rounded-lg bg-white shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{meta.nome}</h2>
                  {meta.categoria_nome && (
                    <p className="text-sm text-gray-600 mt-1">
                      Categoria: {meta.categoria_nome}
                    </p>
                  )}
                  <p className="font-bold text-green-600 mt-2">
                    Valor objetivo: {formatarMoeda(meta.valor_objetivo)}
                  </p>
                  <p className="mt-1">
                    Valor: {formatarMoeda(meta.valor_inicial)}
                  </p>
                  <p className="mt-1">
                    Prazo: {new Date(meta.prazo).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEditar(meta)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleExcluir(meta.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Excluir
                  </button>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-blue-600 h-4 rounded-full transition-all duration-500 ease-in-out" 
                    style={{ width: `${meta.percentual}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>Progresso: {formatarMoeda(meta.valor_inicial)}</span>
                  <span>Objetivo: {formatarMoeda(meta.valor_objetivo)}</span>
                  <span>{meta.percentual.toFixed(1)}%</span>
                </div>
              </div>
              
              {/* Adicionar esta seção para mostrar transações associadas */}
              <div className="mt-4">
                <button 
                  onClick={() => buscarTransacoesDaMeta(meta.id)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Ver transações associadas
                </button>
                
                {transacoesPorMeta[meta.id] && transacoesPorMeta[meta.id].length > 0 && (
                  <div className="mt-2 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {transacoesPorMeta[meta.id].map(transacao => (
                          <tr key={transacao.id}>
                            <td className="px-3 py-2 whitespace-nowrap">
                              {new Date(transacao.data).toLocaleDateString('pt-BR')}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">{transacao.descricao}</td>
                            <td className={`px-3 py-2 whitespace-nowrap ${transacao.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                              {formatarMoeda(transacao.valor)}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                transacao.tipo === 'entrada' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {transacao.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                
                {transacoesPorMeta[meta.id] && transacoesPorMeta[meta.id].length === 0 && (
                  <p className="mt-2 text-sm text-gray-500">Nenhuma transação associada a esta meta.</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};