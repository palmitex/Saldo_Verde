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
  const [formMeta, setFormMeta] = useState({
    nome: '',
    descricao: '',
    valor_alvo: '',
    prazo: '',
    categoria_id: ''
  });
  const [categorias, setCategorias] = useState([]);
  const [editando, setEditando] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);

  useEffect(() => {
    if (auth?.user) {
      buscarMetas();
      buscarCategorias();
    }
  }, [auth?.user]);

  const buscarMetas = async () => {
    try {
      if (!auth?.user) {
        console.error('Usuário não autenticado');
        router.push('/login');
        return;
      }
      
      // Use authFetch instead of regular fetch to include authentication
      const response = await auth.authFetch(`http://localhost:3001/metas/usuario/${auth.user.id}`);
      if (response.ok) {
        const data = await response.json();
        // Ensure data is an array
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

  const buscarCategorias = async () => {
    try {
      if (!auth?.user) {
        console.error('Usuário não autenticado');
        return;
      }
      
      // Use authFetch instead of regular fetch to include authentication
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormMeta({
      ...formMeta,
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
      
      const metaData = {
        ...formMeta,
        usuario_id: auth.user.id
      };
      
      let response;
      
      if (editando) {
        // Atualizar meta existente
        response = await auth.authFetch(`http://localhost:3001/metas/${editando}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(metaData),
        });
      } else {
        // Criar nova meta
        response = await auth.authFetch('http://localhost:3001/metas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(metaData),
        });
      }
      
      if (response.ok) {
        // Limpar formulário e recarregar metas
        setFormMeta({
          nome: '',
          descricao: '',
          valor_alvo: '',
          prazo: '',
          categoria_id: ''
        });
        setEditando(null);
        setMostrarForm(false);
        buscarMetas();
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error(`Erro ao salvar meta: ${response.status} ${response.statusText}`, errorData);
      }
    } catch (error) {
      console.error('Erro ao salvar meta:', error);
    }
  };

  const handleEditar = (meta) => {
    setFormMeta({
      nome: meta.nome,
      descricao: meta.descricao,
      valor_alvo: meta.valor_alvo,
      prazo: meta.prazo ? meta.prazo.split('T')[0] : '',
      categoria_id: meta.categoria_id
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
        
        const response = await auth.authFetch(`http://localhost:3001/metas/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          buscarMetas();
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error(`Erro ao excluir meta: ${response.status} ${response.statusText}`, errorData);
        }
      } catch (error) {
        console.error('Erro ao excluir meta:', error);
      }
    }
  };

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Minhas Metas</h1>
      
      <button 
        onClick={() => {
          setFormMeta({
            nome: '',
            descricao: '',
            valor_alvo: '',
            prazo: '',
            categoria_id: ''
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
              value={formMeta.nome}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-1">Descrição</label>
            <textarea
              name="descricao"
              value={formMeta.descricao}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              rows="3"
            ></textarea>
          </div>
          
          <div className="mb-4">
            <label className="block mb-1">Valor Alvo (R$)</label>
            <input
              type="number"
              name="valor_alvo"
              value={formMeta.valor_alvo}
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
              value={formMeta.prazo}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-1">Categoria</label>
            <select
              name="categoria_id"
              value={formMeta.categoria_id}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Selecione uma categoria</option>
              {Array.isArray(categorias) && categorias.map(categoria => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nome}
                </option>
              ))}
            </select>
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
                  <p className="text-gray-700">{meta.descricao}</p>
                  <p className="font-bold text-green-600">Valor alvo: {formatarMoeda(meta.valor_alvo)}</p>
                  <p>Prazo: {new Date(meta.prazo).toLocaleDateString()}</p>
                  {meta.categoria && (
                    <p className="mt-2">
                      <span className="bg-gray-200 px-2 py-1 rounded text-sm">
                        {meta.categoria.nome}
                      </span>
                    </p>
                  )}
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
              
              {meta.progresso && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${Math.min((meta.progresso / meta.valor_alvo) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-right mt-1">
                    {formatarMoeda(meta.progresso)} de {formatarMoeda(meta.valor_alvo)}
                    ({Math.round((meta.progresso / meta.valor_alvo) * 100)}%)
                  </p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
