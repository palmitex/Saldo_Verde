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
    try {
      console.log('Tentando fazer login com:', { email });
      
      let response;
      try {
        response = await fetch('http://localhost:3001/usuarios/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ login: email, senha }),
          // Adicionar timeout para evitar espera infinita
          signal: AbortSignal.timeout(10000) // 10 segundos de timeout
        });
      } catch (fetchError) {
        console.error('Erro na requisição fetch durante login:', fetchError);
        throw new Error('Não foi possível conectar ao servidor. Verifique se o servidor está rodando e tente novamente.');
      }

      // Verificar status da resposta
      if (!response.ok) {
        // Tentar obter detalhes do erro
        let errorData;
        try {
          errorData = await response.json();
        } catch (jsonError) {
          console.error('Erro ao analisar resposta JSON:', jsonError);
        }

        // Mensagens de erro específicas baseadas no status
        if (response.status === 401) {
          throw new Error('Credenciais inválidas. Verifique seu email e senha.');
        } else if (response.status === 404) {
          throw new Error('Usuário não encontrado. Verifique seu email.');
        } else if (errorData?.message) {
          throw new Error(errorData.message);
        } else {
          throw new Error('Erro ao fazer login. Tente novamente.');
        }
      }

      const userData = await response.json();
      
      // Verificar se a resposta contém os dados do usuário
      if (!userData || !userData.data || !userData.data.usuario) {
        throw new Error('Resposta do servidor inválida. Tente novamente.');
      }
      
      const userInfo = userData.data.usuario;
      
      // Armazenar dados do usuário no localStorage
      localStorage.setItem('user', JSON.stringify(userInfo));
      setUser(userInfo);
      
      return userInfo;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  };

  // Função de registro
  const register = async (nome, email, password) => {
    try {
      const response = await fetch('http://localhost:3001/usuarios/cadastrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, email, senha: password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao criar conta');
      }

      // Login após registro bem-sucedido
      return login(email, password);
    } catch (error) {
      console.error('Erro ao registrar:', error);
      throw error;
    }
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  // Verificar se o usuário está autenticado
  const isAuthenticated = () => {
    return !!user;
  };

  // Função para fazer requisições autenticadas (sem JWT)
  const authFetch = async (url, options = {}) => {
    if (!isAuthenticated()) {
      router.push('/login');
      throw new Error('Usuário não autenticado');
    }
    
    // Adiciona o ID do usuário como parâmetro de consulta para autenticação simples
    const separator = url.includes('?') ? '&' : '?';
    const authenticatedUrl = `${url}${separator}userId=${user.id}`;
    
    return fetch(authenticatedUrl, options);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      register, 
      isAuthenticated, 
      loading,
      authFetch
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
      authFetch: () => Promise.reject(new Error('AuthProvider não encontrado'))
    };
  }
  return context;
}



