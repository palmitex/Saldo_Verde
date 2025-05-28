'use client';

import { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Create the context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Verificar se o usuário está logado ao carregar a página
  useEffect(() => {
    const checkAuth = () => {
      try {
        // Verificar se estamos no ambiente do navegador
        if (typeof window !== 'undefined') {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Função de login
  const login = async (email, senha) => {
    let response;
    
    try {
      response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login: email, senha }),
        // Adicionar timeout para evitar espera infinita
        signal: AbortSignal.timeout(10000) // 10 segundos de timeout
      });
    } catch (fetchError) {
      // Erro de conexão
      return { 
        success: false, 
        message: 'Não foi possível conectar ao servidor. Verifique se o servidor está rodando e tente novamente.' 
      };
    }

    // Verificar status da resposta
    if (!response.ok) {
      // Tentar obter detalhes do erro
      let errorData;
      try {
        errorData = await response.json();
      } catch (jsonError) {
        // Erro silencioso ao analisar JSON
      }

      // Mensagens de erro específicas baseadas no status
      if (response.status === 401) {
        return { 
          success: false, 
          message: 'Credenciais inválidas. Verifique seu email e senha.' 
        };
      } else if (response.status === 404) {
        return { 
          success: false, 
          message: 'Usuário não encontrado. Verifique seu email.' 
        };
      } else if (errorData?.message) {
        return { 
          success: false, 
          message: errorData.message 
        };
      } else {
        return { 
          success: false, 
          message: 'Erro ao fazer login. Tente novamente.' 
        };
      }
    }

    try {
      const userData = await response.json();
      
      // Verificar se a resposta contém os dados do usuário
      if (!userData || !userData.data || !userData.data.usuario) {
        return { 
          success: false, 
          message: 'Resposta do servidor inválida. Tente novamente.' 
        };
      }
      
      const userInfo = userData.data.usuario;
      
      // Armazenar dados do usuário no localStorage
      localStorage.setItem('user', JSON.stringify(userInfo));
      setUser(userInfo);
      
      return { success: true, user: userInfo };
    } catch (error) {
      return { 
        success: false, 
        message: 'Erro ao processar resposta do servidor. Tente novamente.' 
      };
    }
  };

  // Função de registro
  const register = async (nome, email, telefone, cpf, senha, pergunta_secreta, resposta_secreta) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/cadastrar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          nome, 
          email, 
          telefone,
          cpf,
          senha,
          pergunta_secreta,
          resposta_secreta
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { 
          success: false, 
          message: errorData.message || 'Erro ao criar conta' 
        };
      }

      // Login após registro bem-sucedido
      return login(email, senha);
    } catch (error) {
      console.error('Erro no registro:', error);
      return { 
        success: false, 
        message: 'Erro ao processar seu registro. Tente novamente.' 
      };
    }
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  // Função para atualizar os dados do usuário
  const updateUserData = (newUserData) => {
    setUser(newUserData);
  };

  // Verificar se o usuário está autenticado
  const isAuthenticated = () => {
    return !!user;
  };

  // Função para fazer requisições autenticadas
  const authFetch = async (url, options = {}) => {
    if (!isAuthenticated()) {
      router.push('/login');
      throw new Error('Usuário não autenticado');
    }

    if (!url) {
      throw new Error('URL não fornecida');
    }

    // Garantir que a URL começa com http:// ou https://
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `${process.env.NEXT_PUBLIC_API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    }
    
    try {
      // Verificar se a URL já contém userId
      const urlObj = new URL(url);
      if (!urlObj.searchParams.has('userId')) {
        // Adiciona o ID do usuário como parâmetro de consulta para autenticação simples
        const separator = url.includes('?') ? '&' : '?';
        url = `${url}${separator}userId=${user.id}`;
      }
      
      console.log('Fazendo requisição para:', url);
      
      // Adiciona headers padrão
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers
      };

      // Faz a requisição com timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos de timeout

      try {
        const response = await fetch(url, {
          ...options,
          headers,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        // Se a resposta não for ok, tenta obter a mensagem de erro
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || response.statusText);
        }

        return response;
      } catch (fetchError) {
        clearTimeout(timeoutId);
        
        if (fetchError.name === 'AbortError') {
          throw new Error('A requisição demorou muito tempo para responder');
        }
        
        if (fetchError.message === 'Failed to fetch') {
          throw new Error('Não foi possível conectar ao servidor. Verifique se o servidor está rodando e tente novamente.');
        }
        
        throw fetchError;
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      register, 
      isAuthenticated, 
      loading,
      authFetch,
      updateUserData
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    console.error('useAuth deve ser usado dentro de um AuthProvider');
    // Retornar um objeto vazio com funções vazias para evitar erros
    return {
      user: null,
      login: () => Promise.reject(new Error('AuthProvider não encontrado')),
      logout: () => {},
      register: () => Promise.reject(new Error('AuthProvider não encontrado')),
      isAuthenticated: () => false,
      loading: false,
      authFetch: () => Promise.reject(new Error('AuthProvider não encontrado')),
      updateUserData: () => {}
    };
  }
  return context;
}



