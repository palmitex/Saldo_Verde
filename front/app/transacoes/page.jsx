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
  const [editando, setEditando] = useState(null);
  const [metaDetalhes, setMetaDetalhes] = useState(null);
  const [mostrarModalMeta, setMostrarModalMeta] = useState(false);
  
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
      if (!auth?.user) {
        console.error('Usuário não autenticado');
        router.push('/login');
        return;
      }
      
      const response = await auth.authFetch(`http://localhost:3001/transacoes?userId=${auth.user.id}`);
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
    }
  };

  const buscarCategorias = async () => {
    try {
      if (!auth?.user) {
        console.error('Usuário não autenticado');
        return;
      }
      
      const response = await auth.authFetch('http://localhost:3001/categorias');
      if (response.ok) {
        const data = await response.json();
        // Ensure data is always an array
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
      
      const response = await auth.authFetch(`http://localhost:3001/metas/usuario/${auth.user.id}`);
      if (response.ok) {
        const data = await response.json();
        // Verificar o formato correto da resposta
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
    
    // Se o campo alterado for meta_id, vamos preencher a descrição automaticamente
    if (name === 'meta_id' && value) {
      // Encontrar a meta selecionada
      const metaSelecionada = metas.find(meta => meta.id == value);
      if (metaSelecionada) {
        // Preencher a descrição com o nome da meta
        setNovaTransacaoForm({
          ...novaTransacaoForm,
          [name]: value,
          descricao: `Contribuição para meta: ${metaSelecionada.nome}`
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
    
    try {
      if (!auth?.user) {
        console.error('Usuário não autenticado');
        router.push('/login');
        return;
      }
      
      const response = await auth.authFetch('http://localhost:3001/transacoes', {
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
    }
  };

  const excluirTransacao = async (id) => {
    try {
      if (!auth?.user) {
        console.error('Usuário não autenticado');
        router.push('/login');
        return;
      }
      
      const response = await auth.authFetch(`http://localhost:3001/transacoes/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        buscarTransacoes();
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error(`Erro ao excluir transação: ${response.status} ${response.statusText}`, errorData);
      }
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
    }
  };

  const iniciarEdicao = (transacao) => {
    setEditando(transacao.id);
    setNovaTransacaoForm({
      descricao: transacao.descricao || '',
      valor: transacao.valor,
      data: transacao.data ? transacao.data.split('T')[0] : new Date().toISOString().split('T')[0],
      tipo: transacao.tipo,
      categoria_id: transacao.categoria_id || '',
      meta_id: transacao.meta_id || '',
      usuario_id: transacao.usuario_id
    });
  };

  const cancelarEdicao = () => {
    setEditando(null);
    setNovaTransacaoForm({
      descricao: '',
      valor: '',
      data: new Date().toISOString().split('T')[0],
      tipo: 'saida',
      categoria_id: '',
      meta_id: '',
      usuario_id: auth?.user?.id || null
    });
  };

  const atualizarTransacao = async (e) => {
    e.preventDefault();
    
    try {
      if (!auth?.user || !editando) {
        console.error('Usuário não autenticado ou nenhuma transação sendo editada');
        return;
      }
      
      const response = await auth.authFetch(`http://localhost:3001/transacoes/${editando}`, {
        method: 'PUT',
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
        setEditando(null);
        buscarTransacoes();
        // Atualizar também a lista de metas, pois o progresso pode ter sido alterado
        if (novaTransacaoForm.meta_id) {
          buscarMetas();
        }
      } else {
        // Exibir mensagem de erro em um alerta
        const errorData = await response.json().catch(() => ({}));
        const mensagemErro = errorData.message || 'Erro ao atualizar transação';
        alert(mensagemErro);
        console.error(`Erro ao atualizar transação: ${response.status} ${response.statusText}`, errorData);
      }
    } catch (error) {
      alert('Erro ao atualizar transação: ' + (error.message || 'Erro desconhecido'));
      console.error('Erro ao atualizar transação:', error);
    }
  };

  const formatarData = (dataString) => {
    if (!dataString) return '-';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Minhas Transações</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Nova Transação</h2>
        <form onSubmit={adicionarTransacao} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <input
              type="text"
              name="descricao"
              value={novaTransacaoForm.descricao}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Descrição da transação"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
            <input
              type="number"
              name="valor"
              value={novaTransacaoForm.valor}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
            <input
              type="date"
              name="data"
              value={novaTransacaoForm.data}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select
              name="tipo"
              value={novaTransacaoForm.tipo}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="entrada">Entrada</option>
              <option value="saida">Saída</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <select
              name="categoria_id"
              value={novaTransacaoForm.categoria_id}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Selecione uma categoria (opcional)</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nome}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta (opcional)</label>
            <select
              name="meta_id"
              value={novaTransacaoForm.meta_id}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Selecione uma meta (opcional)</option>
              {metas.map((meta) => (
                <option key={meta.id} value={meta.id}>
                  {meta.nome}
                </option>
              ))}
            </select>
          </div>
          
          <div className="md:col-span-2">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              Adicionar Transação
            </button>
          </div>
        </form>
      </div>
      
      {/* Lista de transações */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="overflow-x-auto">
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
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transacoes.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    Nenhuma transação encontrada
                  </td>
                </tr>
              ) : (
                transacoes.map((transacao) => (
                  <tr key={transacao.id} className={transacao.tipo === 'entrada' ? 'bg-green-50' : 'bg-red-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
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
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transacao.tipo === 'entrada'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {transacao.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transacao.categoria_nome || 'Sem categoria'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transacao.meta_nome ? (
                        <button className="text-blue-600 hover:text-blue-800">
                          {transacao.meta_nome}
                        </button>
                      ) : (
                        'Sem meta'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => iniciarEdicao(transacao)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => excluirTransacao(transacao.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Modal para exibir detalhes da meta */}
      {mostrarModalMeta && metaDetalhes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">{metaDetalhes.nome}</h2>
            <p className="mb-2">
              <span className="font-medium">Valor objetivo:</span> {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(metaDetalhes.valor_objetivo)}
            </p>
            <p className="mb-2">
              <span className="font-medium">Valor atual:</span> {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(metaDetalhes.valor_inicial)}
            </p>
            <p className="mb-4">
              <span className="font-medium">Prazo:</span> {formatarData(metaDetalhes.prazo)}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div 
                className="bg-blue-600 h-4 rounded-full" 
                style={{ width: `${(metaDetalhes.valor_inicial / metaDetalhes.valor_objetivo) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setMostrarModalMeta(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
