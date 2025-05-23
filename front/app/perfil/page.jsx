'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function Perfil() {
  const auth = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [perfilData, setPerfilData] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    confirmarSenha: '',
  });
  const [trocandoSenha, setTrocandoSenha] = useState(false);
  const [excluindoConta, setExcluindoConta] = useState(false);

  useEffect(() => {
    if (auth?.user) {
      // Preenche os campos com os dados do usuário logado
      setPerfilData({
        nome: auth.user.nome || '',
        email: auth.user.email || '',
        telefone: auth.user.telefone || '',
        senha: '',
        confirmarSenha: '',
      });
    }
  }, [auth?.user]);

  const formatarTelefone = (value) => {
    // Remove tudo que não é número
    const telefone = value.replace(/\D/g, '');
    
    if (telefone.length <= 2) {
      return telefone;
    }
    
    if (telefone.length <= 6) {
      return `(${telefone.slice(0, 2)}) ${telefone.slice(2)}`;
    }
    
    if (telefone.length <= 10) {
      return `(${telefone.slice(0, 2)}) ${telefone.slice(2, 6)}-${telefone.slice(6)}`;
    }
    
    return `(${telefone.slice(0, 2)}) ${telefone.slice(2, 7)}-${telefone.slice(7, 11)}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'telefone') {
      setPerfilData({
        ...perfilData,
        [name]: formatarTelefone(value),
      });
    } else {
      setPerfilData({
        ...perfilData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validações básicas
      if (!perfilData.nome.trim()) {
        throw new Error('O nome é obrigatório');
      }

      // Validação para troca de senha
      if (trocandoSenha) {
        if (perfilData.senha.length < 6) {
          throw new Error('A senha deve ter pelo menos 6 caracteres');
        }
        
        if (perfilData.senha !== perfilData.confirmarSenha) {
          throw new Error('As senhas não conferem');
        }
      }

      // Prepara os dados para atualização
      const dadosAtualizados = {
        nome: perfilData.nome,
        telefone: perfilData.telefone.replace(/\D/g, ''), // Remove formatação
      };

      // Adiciona a senha se estiver trocando
      if (trocandoSenha && perfilData.senha) {
        dadosAtualizados.senha = perfilData.senha;
      }

      // Chama a API para atualizar o perfil
      const response = await auth.authFetch('http://localhost:3001/usuarios/perfil', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosAtualizados),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erro ao atualizar o perfil');
      }

      // Atualiza o usuário no contexto de autenticação
      const userData = { ...auth.user, ...dadosAtualizados };
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Atualiza o contexto com os novos dados
      if (auth.updateUserData) {
        auth.updateUserData(userData);
      }

      setSuccess('Perfil atualizado com sucesso!');
      setTrocandoSenha(false);
      setPerfilData({
        ...perfilData,
        senha: '',
        confirmarSenha: '',
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setError(error.message || 'Erro ao atualizar o perfil. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExcluirConta = async () => {
    if (!confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita e todos os seus dados serão removidos permanentemente.')) {
      return;
    }
    
    setExcluindoConta(true);
    setError(null);

    try {
      const response = await auth.authFetch('http://localhost:3001/usuarios/conta', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erro ao excluir a conta');
      }

      // Faz logout após exclusão bem-sucedida
      auth.logout();
      router.push('/');
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      setError(error.message || 'Erro ao excluir a conta. Tente novamente mais tarde.');
      setExcluindoConta(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-60 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="h-2 w-full bg-gradient-to-r from-green-600 to-green-400 relative">
              <div className="absolute inset-0 bg-white opacity-30 shine-effect"></div>
            </div>
            
            <div className="p-8">
              <div className="flex flex-col items-center mb-8">
                <div className="bg-green-100 p-5 rounded-full mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Meu Perfil</h1>
                <p className="text-gray-600">Visualize e edite suas informações pessoais</p>
              </div>
              
              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                  <p>{error}</p>
                </div>
              )}
              
              {success && (
                <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
                  <p>{success}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome completo
                    </label>
                    <input
                      type="text"
                      id="nome"
                      name="nome"
                      value={perfilData.nome}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Seu nome completo"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={perfilData.email}
                      disabled
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 cursor-not-allowed"
                      placeholder="Seu email"
                    />
                    <p className="text-xs text-gray-500 mt-1">O email não pode ser alterado</p>
                  </div>
                  
                  <div>
                    <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone
                    </label>
                    <input
                      type="text"
                      id="telefone"
                      name="telefone"
                      value={perfilData.telefone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="(00) 00000-0000"
                      maxLength={15}
                    />
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-800">Alterar senha</h3>
                      <button 
                        type="button" 
                        onClick={() => setTrocandoSenha(!trocandoSenha)}
                        className="text-green-600 hover:text-green-700 text-sm font-medium"
                      >
                        {trocandoSenha ? 'Cancelar' : 'Alterar senha'}
                      </button>
                    </div>
                    
                    {trocandoSenha && (
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">
                            Nova senha
                          </label>
                          <input
                            type="password"
                            id="senha"
                            name="senha"
                            value={perfilData.senha}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Mínimo de 6 caracteres"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirmar nova senha
                          </label>
                          <input
                            type="password"
                            id="confirmarSenha"
                            name="confirmarSenha"
                            value={perfilData.confirmarSenha}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Confirme a nova senha"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between pt-6">
                  <button
                    type="button"
                    onClick={handleExcluirConta}
                    className="px-6 py-3 bg-red-800 text-white rounded-lg shadow-md hover:shadow-lg disabled:opacity-70"
                    disabled={excluindoConta}
                  >
                    {excluindoConta ? 'Excluindo...' : 'Excluir conta'}
                  </button>

                  <div className="space-x-3">
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="px-6 py-3 bg-white text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg shadow-md hover:shadow-lg disabled:opacity-70"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Salvando...
                        </span>
                      ) : (
                        'Salvar alterações'
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 