'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import CustomAlert from '../../components/CustomAlert';
import Image from 'next/image';
import './profile.css';
import ConfirmacaoExclusao from '../../components/ConfirmacaoExclusao';

export default function Perfil() {
  // Hooks de autenticação e navegação
  const auth = useAuth();
  const router = useRouter();
  
  // Estado para controlar o carregamento durante operações assíncronas
  const [isLoading, setIsLoading] = useState(false);
  
  // Estado para armazenar os dados do perfil do usuário
  const [perfilData, setPerfilData] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    confirmarSenha: '',
  });
  
  // Estados para controlar a exibição de seções específicas
  const [trocandoSenha, setTrocandoSenha] = useState(false);
  const [excluindoConta, setExcluindoConta] = useState(false);
  
  // Estado para configuração do alerta personalizado
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: () => {},
    showConfirmButton: true,
    confirmText: 'Sim',
    cancelText: 'Não'
  });
  
  // Estado para controlar a exibição do modal de confirmação de exclusão
  const [showConfirmacaoExclusao, setShowConfirmacaoExclusao] = useState(false);

  /**
   * Efeito para carregar os dados do usuário quando o componente é montado
   * ou quando o usuário autenticado muda
   */
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

  /*
   * Função para formatar o número de telefone enquanto o usuário digita
   * Aplica a máscara (XX) XXXXX-XXXX
   */
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

  /**
   * Manipula as mudanças nos campos do formulário
   * Aplica formatação especial para o campo de telefone
   * 
   */
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

  /**
   * Manipula o envio do formulário para atualização do perfil
   * Realiza validações e envia os dados para a API
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

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

      // Exibe mensagem de sucesso e redireciona para a página inicial
      setAlertConfig({
        isOpen: true,
        title: 'Sucesso!',
        message: 'Seu perfil foi atualizado com sucesso.',
        type: 'success',
        showConfirmButton: true,
        confirmText: 'OK',
        onConfirm: () => {
          router.push('/');
        },
        cancelText: null
      });

      // Reseta os campos de senha
      setTrocandoSenha(false);
      setPerfilData({
        ...perfilData,
        senha: '',
        confirmarSenha: '',
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      // Exibe mensagem de erro
      setAlertConfig({
        isOpen: true,
        title: 'Erro',
        message: error.message || 'Erro ao atualizar o perfil. Tente novamente.',
        type: 'error',
        showConfirmButton: false,
        confirmText: 'OK'
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Inicia o processo de exclusão da conta
   * Exibe o modal de confirmação
   */
  const handleExcluirConta = () => {
    setShowConfirmacaoExclusao(true);
  };

  /**
   * Confirma a exclusão da conta após confirmação do usuário
   * Envia requisição para a API e trata o resultado
   */
  const handleConfirmarExclusao = async () => {
    setExcluindoConta(true);
    // Fechar o modal de confirmação imediatamente
    setShowConfirmacaoExclusao(false);
    
    try {
      // Preparar a URL com o userId no body em vez de contar apenas com o parâmetro de consulta
      const response = await auth.authFetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/perfil`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: auth.user.id
        })
      });
  
      // Verificar se a resposta é bem-sucedida
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao excluir a conta');
      }
  
      // Mensagem de sucesso e logout após exclusão
      setAlertConfig({
        isOpen: true,
        title: 'Conta Excluída',
        message: 'Sua conta foi excluída com sucesso.',
        type: 'success',
        onConfirm: () => {
          // Faz logout após exclusão bem-sucedida
          auth.logout();
          router.push('/');
        },
        showConfirmButton: true,
        confirmText: 'OK',
        cancelText: null
      });
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      setExcluindoConta(false);
      
      // Mostrar mensagem de erro para o usuário
      setAlertConfig({
        isOpen: true,
        title: 'Erro',
        message: error.message || 'Ocorreu um erro ao tentar excluir sua conta. Tente novamente.',
        type: 'error',
        showConfirmButton: true,
        confirmText: 'OK'
      });
    }
  };

  // Renderização do componente
  return (
    <ProtectedRoute>
      {/* Container principal */}
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        {/* Componente de alerta para feedback ao usuário */}
        <CustomAlert
          isOpen={alertConfig.isOpen}
          onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
          onConfirm={alertConfig.onConfirm}
          title={alertConfig.title}
          message={alertConfig.message}
          type={alertConfig.type}
          showConfirmButton={alertConfig.showConfirmButton}
          confirmText={alertConfig.confirmText}
          cancelText={alertConfig.cancelText}
        />
        
        {/* Modal de confirmação para exclusão de conta */}
        <ConfirmacaoExclusao 
          isOpen={showConfirmacaoExclusao}
          onClose={() => setShowConfirmacaoExclusao(false)}
          onConfirm={handleConfirmarExclusao}
        />
        
        {/* Card do perfil */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 backdrop-blur-sm bg-white/90 profile-card">
            {/* Header com efeito de onda decorativa */}
            <div className="relative h-32 bg-gradient-to-r from-[#3A7D44] to-[#55c065] overflow-hidden">
              <div className="absolute inset-0 shine-effect"></div>
              <div className="absolute bottom-0 left-0 right-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-16">
                  <path fill="#ffffff" fillOpacity="1" d="M0,128L48,138.7C96,149,192,171,288,165.3C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
              </div>
            </div>
            
            {/* Conteúdo do card */}
            <div className="p-6 sm:p-8 md:p-10 -mt-10 relative z-10">
              {/* Cabeçalho com ícone e título */}
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

              {/* Formulário de perfil */}
              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                {/* Seção de informações pessoais */}
                <div className="space-y-5 sm:space-y-6 bg-white/50 p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100 hover:bg-white/80 transition-all duration-300">
                  {/* Campo de nome */}
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
                  
                  {/* Campo de email (desabilitado) */}
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
                  
                  {/* Campo de telefone */}
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
                  
                  {/* Seção de alteração de senha */}
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
                    
                    {/* Campos de senha (condicionalmente renderizados) */}
                    {trocandoSenha && (
                      <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
                        {/* Campo de nova senha */}
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
                        
                        {/* Campo de confirmação de senha */}
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
                
                {/* Botões de ação */}
                <div className="flex flex-col sm:flex-row justify-between pt-6 sm:pt-8 mt-2 border-t border-gray-100 space-y-3 sm:space-y-0">
                  {/* Botão de exclusão de conta */}
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

                  {/* Botões de cancelar e salvar */}
                  <div className="order-2 sm:order-2 flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
                    {/* Botão de cancelar */}
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
                    
                    {/* Botão de salvar alterações */}
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



