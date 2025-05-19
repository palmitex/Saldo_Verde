'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/ProtectedRoute';

const CategoriasPage = () => {
  return (
    <ProtectedRoute>
      <Categorias />
    </ProtectedRoute>
  );
};

const Categorias = () => {
  const { authFetch } = useAuth();
  const router = useRouter();
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [categoriaAtual, setCategoriaAtual] = useState(null);
  const [formData, setFormData] = useState({
    nome: ''
  });

  useEffect(() => {
    carregarCategorias();
  }, []);

  const carregarCategorias = async () => {
    try {
      setLoading(true);
      const response = await authFetch('http://localhost:3001/categorias');
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          setCategorias(data.data);
        } else {
          throw new Error(data.message || 'Erro ao carregar categorias');
        }
      } else {
        throw new Error('Erro ao carregar categorias');
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      setError(error.message || 'Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (categoria = null) => {
    setCategoriaAtual(categoria);
    setFormData({
      nome: categoria ? categoria.nome : ''
    });
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setCategoriaAtual(null);
    setFormData({ nome: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const salvarCategoria = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const url = categoriaAtual 
        ? `http://localhost:3001/categorias/${categoriaAtual.id}`
        : 'http://localhost:3001/categorias';
      
      const response = await authFetch(url, {
        method: categoriaAtual ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao salvar categoria');
      }

      fecharModal();
      carregarCategorias();
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      setError(error.message || 'Erro ao salvar categoria');
    }
  };

  const excluirCategoria = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      return;
    }

    try {
      setError(null);
      const response = await authFetch(`http://localhost:3001/categorias/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao excluir categoria');
      }

      carregarCategorias();
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      setError(error.message || 'Erro ao excluir categoria');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando categorias...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Categorias</h1>
          <button
            onClick={() => abrirModal()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Nova Categoria
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categorias.map((categoria) => (
            <div
              key={categoria.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {categoria.nome}
                  </h3>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => abrirModal(categoria)}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => excluirCategoria(categoria.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {modalAberto && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">
                {categoriaAtual ? 'Editar Categoria' : 'Nova Categoria'}
              </h2>
              <form onSubmit={salvarCategoria}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Nome
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={fecharModal}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriasPage; 