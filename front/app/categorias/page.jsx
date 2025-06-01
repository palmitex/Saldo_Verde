'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import './categoria.css';

export default function CategoriasPage() {
  return (
    <ProtectedRoute>
      <Categorias />
    </ProtectedRoute>
  );
};

function Categorias() {
  const { authFetch, user } = useAuth();
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [drawerAberto, setDrawerAberto] = useState(false);
  const [categoriaAtual, setCategoriaAtual] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    cor: '#4CAF50', // Cor padrão verde
    icone_index: 0  // Novo campo para armazenar o índice do ícone selecionado
  });
  // Para efeitos visuais de hover e interações
  const [hoveredId, setHoveredId] = useState(null);
  const [animatedId, setAnimatedId] = useState(null);

  // Função para buscar categorias usando authFetch
  const buscarCategorias = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/categorias`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Dados recebidos da API:', data);
        
        // Verifica se data é um array diretamente (API pode estar retornando array diretamente)
        if (Array.isArray(data)) {
          setCategorias(data);
        } 
        // Verifica o formato esperado com status e data
        else if (data.status === 'success' && Array.isArray(data.data)) {
          setCategorias(data.data);
        } 
        // Verifica se data é um objeto com propriedades (pode ser que cada propriedade seja uma categoria)
        else if (data && typeof data === 'object' && Object.keys(data).length > 0) {
          // Tenta converter o objeto em array
          const categoriasArray = Object.values(data);
          if (Array.isArray(categoriasArray) && categoriasArray.length > 0) {
            setCategorias(categoriasArray);
          } else {
            console.error('Formato de dados inválido (objeto não convertível):', data);
            setCategorias([]);
          }
        } else {
          console.error('Formato de dados inválido:', data);
          setCategorias([]);
        }
      } else {
        throw new Error('Falha ao buscar categorias');
      }
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      setError('Não foi possível carregar as categorias. Por favor, tente novamente mais tarde.');
      setCategorias([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      console.log('Iniciando busca de categorias...');
      buscarCategorias();
    } else {
      console.log('Usuário não autenticado, não buscando categorias');
    }
  }, [user]);

  useEffect(() => {
    // Efeito de animação aleatória nos cards
    if (categorias.length > 0) {
      const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * categorias.length);
        const randomCat = categorias[randomIndex];
        if (randomCat && randomCat.id) {
          setAnimatedId(randomCat.id);
          setTimeout(() => setAnimatedId(null), 1000);
        }
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [categorias]);

  const abrirDrawer = (categoria = null) => {
    setCategoriaAtual(categoria);
    setFormData({
      nome: categoria ? categoria.nome : '',
      cor: categoria && categoria.cor ? categoria.cor : '#4CAF50',
      icone_index: categoria && categoria.icone_index !== undefined ? categoria.icone_index : 0
    });
    setDrawerAberto(true);
  };

  const fecharDrawer = () => {
    setDrawerAberto(false);
    setCategoriaAtual(null);
    setFormData({ nome: '', cor: '#4CAF50', icone_index: 0 });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const selecionarCor = (cor) => {
    console.log('Cor selecionada:', cor); // Para debug
    setFormData(prev => ({
      ...prev,
      cor: cor
    }));
  };

  const selecionarIcone = (index) => {
    setFormData(prev => ({
      ...prev,
      icone_index: index
    }));
  };

  const salvarCategoria = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const url = categoriaAtual ? `${process.env.NEXT_PUBLIC_API_URL}/categorias/${categoriaAtual.id}?userId=${user.id}`: `${process.env.NEXT_PUBLIC_API_URL}/categorias`;
      
      const response = await authFetch(url, { method: categoriaAtual ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          usuario_id: user.id // Adicionar ID do usuário explicitamente no corpo
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao salvar categoria');
      }

      fecharDrawer();
      buscarCategorias();
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      setError(error.message || 'Erro ao salvar categoria');
    }
  };

  // Cores para os cards de categoria - tons de verde
  const coresCategorias = [
    { cor: '#4CAF50', classe: 'from-green-600 to-green-400' },    // Verde médio
    { cor: '#2E7D32', classe: 'from-green-700 to-green-500' },    // Verde escuro
    { cor: '#1B5E20', classe: 'from-green-800 to-green-600' },    // Verde muito escuro
    { cor: '#66BB6A', classe: 'from-green-500 to-green-300' },    // Verde claro
    { cor: '#388E3C', classe: 'from-green-600 to-green-400' },    // Verde médio escuro
    { cor: '#81C784', classe: 'from-green-400 to-green-300' },    // Verde claro médio
    { cor: '#A5D6A7', classe: 'from-green-300 to-green-200' },    // Verde muito claro
    { cor: '#43A047', classe: 'from-green-600 to-green-400' },    // Verde médio alternativo
    { cor: '#558B2F', classe: 'from-green-700 to-green-500' },    // Verde oliva escuro
    { cor: '#33691E', classe: 'from-green-900 to-green-700' }     // Verde musgo
  ];
  
  // Ícones para categorias
  const icons = [
    "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z", // Cartão
    "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", // Dinheiro
    "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", // Pessoa
    "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", // Casa
    "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01", // Lista
    "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", // Gráfico
  ];

  // Tela de carregamento
  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          <p className="mt-6 text-green-700 font-medium">Carregando suas categorias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-60 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="max-w-6xl mx-auto">
        {/* Header com título e botão de nova categoria */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
          <div className="mb-6 sm:mb-0">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-green-500 inline">
              Categorias
            </h1>
            <p className="text-green-700 mt-2">
              Organize suas finanças criando categorias personalizadas
            </p>
          </div>
          <button
            onClick={() => abrirDrawer()}
            className="group flex items-center px-6 py-3 bg-gradient-to-r from-green-700 to-green-500 text-white rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-green-300/50 transform hover:-translate-y-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span>Nova Categoria</span>
          </button>
        </div>

        {/* Mensagem de erro */}
        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-center shadow-md animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Grid de categorias */}
        {Array.isArray(categorias) && categorias.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categorias.map((categoria, index) => {
              const corIndex = index % coresCategorias.length;
              const corConfig = coresCategorias.find(c => c.cor === categoria.cor) || coresCategorias[corIndex];
              const iconIndex = categoria.icone_index !== undefined ? categoria.icone_index : (index % icons.length);
              const isHovered = hoveredId === categoria.id;
              const isAnimated = animatedId === categoria.id;
              
              return (
                <div
                  key={categoria.id || `categoria-${index}`}
                  className={`bg-white rounded-2xl shadow-xl overflow-hidden card-categoria transition-all duration-300 
                    ${isHovered ? 'scale-105 shadow-green-300/50' : ''} 
                    ${isAnimated ? 'animate-pulse' : ''}`}
                  onMouseEnter={() => setHoveredId(categoria.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div className={`h-2 w-full bg-gradient-to-r ${corConfig.classe} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-white opacity-30 shine-effect"></div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${corConfig.classe} flex items-center justify-center text-white mr-3 shadow-md`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icons[iconIndex]} />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {categoria.nome}
                        </h3>
                      </div>
                      <div className={`flex space-x-2 opacity-0 transition-opacity duration-200 ${isHovered ? 'opacity-100' : ''}`}>
                        <button
                          onClick={() => abrirDrawer(categoria)}
                          className="p-2 rounded-full text-gray-500 hover:bg-green-50 hover:text-green-600 transition-colors duration-200"
                          title="Editar categoria"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>

                      </div>
                    </div>
                    <div className="mt-2 flex items-center">
                      <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-green-100 to-green-200 text-green-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                        Categoria
                      </span>
                      
                      <div className={`ml-auto transform transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-0'}`}>
                        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-green-600 to-green-400 shadow-md"></div>
                      </div>
                    </div>
                    
                    <div className={`mt-3 pt-3 border-t border-gray-100 opacity-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : ''}`}>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                          </svg>
                          
                        </div>
                        <div className="flex items-center">
                      
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-10 text-center border border-green-100">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="mt-4 text-xl font-medium text-gray-700">Nenhuma categoria encontrada</h3>
            <p className="mt-2 text-green-600">Crie categorias para organizar suas finanças</p>
            <button
              onClick={() => abrirDrawer()}
              className="mt-6 inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-700 to-green-500 text-white rounded-xl shadow-lg shadow-green-200 hover:shadow-green-300/50 hover:scale-105 transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Criar primeira categoria
            </button>
          </div>
        )}

        {/* Drawer lateral para adicionar/editar categoria */}
        {drawerAberto && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/50 backdrop-blur-sm transition-opacity"
                 onClick={fecharDrawer}></div>
            
            <div className="absolute inset-y-0 ml-185 sm:max-w-md w-full bg-white shadow-xl transform transition-all duration-300">
              <div className="h-full flex flex-col overflow-y-auto py-6 px-6">
                <div className="flex items-center justify-between border-b border-green-100 pb-4 mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <div className="h-8 w-1 rounded-full bg-gradient-to-b from-green-700 to-green-500 mr-3"></div>
                    {categoriaAtual ? 'Editar Categoria' : 'Nova Categoria'}
                  </h2>
                  <button 
                    onClick={fecharDrawer}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={salvarCategoria} className="flex-1 flex flex-col">
                  <div className="mb-6 flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome da Categoria
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                        placeholder="Digite o nome da categoria"
                        required
                        autoFocus
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cor da Categoria
                    </label>
                    <div className="flex items-center">
                      <input
                        type="color"
                        name="cor"
                        value={formData.cor}
                        onChange={handleInputChange}
                        className="h-10 w-10 rounded cursor-pointer"
                      />
                      <div className="ml-4 flex-1 grid grid-cols-5 gap-2">
                        {coresCategorias.map(({ cor }) => (
                          <div 
                            key={cor}
                            onClick={() => selecionarCor(cor)}
                            className={`h-8 w-8 rounded-full cursor-pointer hover:scale-110 transition-transform duration-200 ${formData.cor === cor ? 'ring-2 ring-offset-2 ring-green-700' : ''}`}
                            style={{ backgroundColor: cor }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ícone (Selecione um)
                    </label>
                    <div className="grid grid-cols-6 gap-3">
                      {icons.map((path, i) => (
                        <div 
                          key={i} 
                          onClick={() => selecionarIcone(i)}
                          className={`h-12 w-12 rounded-full flex items-center justify-center text-white cursor-pointer transition-all duration-200 ${formData.icone_index === i 
                            ? 'bg-gradient-to-br from-green-700 to-green-500 ring-2 ring-offset-2 ring-green-500 scale-110 shadow-md' 
                            : 'bg-gradient-to-br from-green-500 to-green-400 hover:scale-105'
                          }`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
                          </svg>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Ícone selecionado: {formData.icone_index + 1} de {icons.length}
                    </p>
                  </div>
                  
                  <div className="mt-auto pt-6 border-t border-green-100">
                    <div className="flex flex-col space-y-3">
                      <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-green-700 to-green-500 text-white rounded-lg shadow-md hover:shadow-lg hover:shadow-green-200 transition-all duration-200 flex items-center justify-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {categoriaAtual ? 'Atualizar Categoria' : 'Criar Categoria'}
                      </button>
                      <button
                        type="button"
                        onClick={fecharDrawer}
                        className="w-full py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Cancelar
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};