'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import Image from 'next/image';
import './profile.css';

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
      const response = await auth.authFetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/perfil`, {
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
      const response = await auth.authFetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/conta`, {
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
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 backdrop-blur-sm bg-white/90 profile-card">
            {/* Header with decorative wave */}
            <div className="relative h-32 bg-gradient-to-r from-[#3A7D44] to-[#55c065] overflow-hidden">
              <div className="absolute inset-0 shine-effect"></div>
              <div className="absolute bottom-0 left-0 right-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-16">
                  <path fill="#ffffff" fillOpacity="1" d="M0,128L48,138.7C96,149,192,171,288,165.3C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
              </div>
            </div>
            
            <div className="p-6 sm:p-8 md:p-10 -mt-10 relative z-10">
              <div className="flex flex-col items-center mb-8 sm:mb-10">
                <div className="bg-white p-2 rounded-full mb-4 shadow-lg ring-4 ring-[#3A7D44]/20 animate-bounce-slow">
                  <div className="bg-gradient-to-br from-[#3A7D44] to-[#55c065] p-3 sm:p-4 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 sm:h-20 sm:w-20 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-3">Meu Perfil</h1>
                <p className="text-sm sm:text-base text-gray-600 max-w-md text-center">Visualize e edite suas informações pessoais</p>
              </div>
              
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p>{error}</p>
                </div>
              )}
              
              {success && (
                <div className="mb-6 p-4 bg-[#f0f7f0] border border-[#3A7D44]/30 text-[#3A7D44] rounded-lg flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0 text-[#3A7D44]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p>{success}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                <div className="space-y-5 sm:space-y-6 bg-white/50 p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100 hover:bg-white/80 transition-all duration-300">
                  <div className="input-focus-effect">
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome completo
                    </label>
                    <input
                      type="text"
                      id="nome"
                      name="nome"
                      value={perfilData.nome}
                      onChange={handleChange}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#3A7D44] focus:border-transparent shadow-sm transition duration-200 ease-in-out hover:border-[#55c065]"
                      placeholder="Seu nome completo"
                    />
                  </div>
                  
                  <div className="input-focus-effect">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={perfilData.email}
                      disabled
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-gray-300 bg-gray-50 cursor-not-allowed shadow-sm"
                      placeholder="Seu email"
                    />
                    <p className="text-xs text-gray-500 mt-1">O email não pode ser alterado</p>
                  </div>
                  
                  <div className="input-focus-effect">
                    <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone
                    </label>
                    <input
                      type="text"
                      id="telefone"
                      name="telefone"
                      value={perfilData.telefone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#3A7D44] focus:border-transparent shadow-sm transition duration-200 ease-in-out hover:border-[#55c065]"
                      placeholder="(00) 00000-0000"
                      maxLength={15}
                    />
                  </div>
                  
                  <div className="pt-5 sm:pt-6 mt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base sm:text-lg font-medium text-gray-800">Alterar senha</h3>
                      <button 
                        type="button" 
                        onClick={() => setTrocandoSenha(!trocandoSenha)}
                        className="text-[#3A7D44] hover:text-[#55c065] text-sm font-medium transition duration-200 ease-in-out flex items-center gap-1"
                      >
                        {trocandoSenha ? (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancelar
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Alterar senha
                          </>
                        )}
                      </button>
                    </div>
                    
                    {trocandoSenha && (
                      <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
                        <div className="input-focus-effect">
                          <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">
                            Nova senha
                          </label>
                          <input
                            type="password"
                            id="senha"
                            name="senha"
                            value={perfilData.senha}
                            onChange={handleChange}
                            className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#3A7D44] focus:border-transparent shadow-sm transition duration-200 ease-in-out hover:border-[#55c065]"
                            placeholder="Mínimo de 6 caracteres"
                          />
                        </div>
                        
                        <div className="input-focus-effect">
                          <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirmar nova senha
                          </label>
                          <input
                            type="password"
                            id="confirmarSenha"
                            name="confirmarSenha"
                            value={perfilData.confirmarSenha}
                            onChange={handleChange}
                            className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#3A7D44] focus:border-transparent shadow-sm transition duration-200 ease-in-out hover:border-[#55c065]"
                            placeholder="Confirme a nova senha"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-between pt-6 sm:pt-8 mt-2 border-t border-gray-100 space-y-3 sm:space-y-0">
                  <button
                    type="button"
                    onClick={handleExcluirConta}
                    className="sm:order-1 px-4 py-2 sm:px-6 sm:py-3 bg-red-700 text-white rounded-lg shadow-md hover:bg-red-800 hover:shadow-lg disabled:opacity-70 w-full sm:w-auto transition duration-200 ease-in-out flex items-center justify-center gap-2"
                    disabled={excluindoConta}
                  >
                    {excluindoConta ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Excluindo...
                      </span>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Excluir conta
                      </>
                    )}
                  </button>

                  <div className="order-2 sm:order-2 flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="px-4 py-2 sm:px-6 sm:py-3 bg-white text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-800 w-full sm:w-auto transition duration-200 ease-in-out flex items-center justify-center gap-2"
                    >
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Cancelar
                      </>
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-[#3A7D44] to-[#55c065] text-white rounded-lg shadow-md hover:shadow-lg hover:from-[#2e6436] hover:to-[#48a354] disabled:opacity-70 w-full sm:w-auto transition duration-200 ease-in-out flex items-center justify-center gap-2"
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
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Salvar alterações
                        </>
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