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
        setCategorias(Array.isArray(data) ? data : []);
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
        // Ensure data is always an array
        setMetas(Array.isArray(data) ? data : []);
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
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error(`Erro ao adicionar transação: ${response.status} ${response.statusText}`, errorData);
      }
    } catch (error) {
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

  const salvarEdicao = async () => {
  try {
    if (!auth?.user) {
      console.error('Usuário não autenticado');
      router.push('/login');
      return;
    }

    const response = await auth.authFetch(`http://localhost:3001/transacoes/${editando}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        descricao: novaTransacaoForm.descricao,
        valor: parseFloat(novaTransacaoForm.valor),
        data: novaTransacaoForm.data,
        tipo: novaTransacaoForm.tipo,
        categoria_id: novaTransacaoForm.categoria_id ? parseInt(novaTransacaoForm.categoria_id) : null,
        meta_id: novaTransacaoForm.meta_id ? parseInt(novaTransacaoForm.meta_id) : null,
      }),
    });

    if (response.ok) {
      setEditando(null);
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
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.error(`Erro ao salvar edição: ${response.status} ${response.statusText}`, errorData);
    }
  } catch (error) {
    console.error('Erro ao salvar edição:', error);
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
        <h2 className="text-lg font-semibold mb-4">
          {editando ? 'Editar Transação' : 'Adicionar Nova Transação'}
        </h2>
        <form onSubmit={editando ? (e) => { e.preventDefault(); salvarEdicao(); } : adicionarTransacao}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <input
                type="text"
                name="descricao"
                value={novaTransacaoForm.descricao}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
              <input
                type="number"
                name="valor"
                value={novaTransacaoForm.valor}
                onChange={handleInputChange}
                step="0.01"
                className="w-full border border-gray-300 rounded-md p-2"
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
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Categoria
              </label>
              <select
                name="categoria_id"
                value={novaTransacaoForm.categoria_id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione uma categoria (opcional)</option>
                {categorias.map(categoria => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Relacionada</label>
              <select
                name="meta_id"
                value={novaTransacaoForm.meta_id}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option value="">Selecione uma meta (opcional)</option>
                {Array.isArray(metas) && metas.map((meta) => (
                  <option key={meta.id} value={meta.id}>
                    {meta.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            {editando && (
              <button
                type="button"
                onClick={cancelarEdicao}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md mr-2"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              {editando ? 'Salvar Alterações' : 'Adicionar Transação'}
            </button>
          </div>
        </form>
      </div>

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
                      {transacao.meta_nome || 'Sem meta'}
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
    </div>
  );
}