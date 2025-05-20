'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';

export default function Registro() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    senha: '',
    confirmarSenha: '',
    pergunta_secreta: '',
    resposta_secreta: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const auth = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Função para validar formato de CPF
  const validarCPF = (cpf) => {
    // Remove caracteres não numéricos
    const cpfLimpo = cpf.replace(/[^0-9]/g, '');
    
    // Verifica se tem 11 dígitos
    if (cpfLimpo.length !== 11) {
      return false;
    }
    
    // Implementação básica de validação
    return true;
  };
  
  // Função para validar formato de telefone
  const validarTelefone = (telefone) => {
    // Remove caracteres não numéricos
    const telefoneLimpo = telefone.replace(/[^0-9]/g, '');
    
    // Verifica se tem entre 10 e 11 dígitos (com ou sem DDD)
    return telefoneLimpo.length >= 10 && telefoneLimpo.length <= 11;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    // Validar se as senhas coincidem
    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }
    
    // Validar formato de CPF
    if (!validarCPF(formData.cpf)) {
      setError('Formato de CPF inválido. Use o formato 000.000.000-00');
      setLoading(false);
      return;
    }
    
    // Validar formato de telefone
    if (!validarTelefone(formData.telefone)) {
      setError('Formato de telefone inválido. Use o formato (00) 00000-0000');
      setLoading(false);
      return;
    }
  
    try {
      // Enviar dados para a API
      let response;
      try {
        response = await fetch('http://localhost:3001/usuarios/cadastrar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nome: formData.nome,
            email: formData.email,
            telefone: formData.telefone,
            cpf: formData.cpf,
            senha: formData.senha,
            pergunta_secreta: formData.pergunta_secreta,
            resposta_secreta: formData.resposta_secreta
          }),
          // Adicionar timeout para evitar espera infinita
          signal: AbortSignal.timeout(10000) // 10 segundos de timeout
        });
      } catch (fetchError) {
        console.error('Erro na requisição fetch:', fetchError);
        throw new Error('Não foi possível conectar ao servidor. Verifique se o servidor está rodando e tente novamente.');
      }
  
      // Imprimir o status da resposta para depuração
      console.log('Status da resposta:', response.status);
      
      // Tentar obter o corpo da resposta
      let data;
      try {
        data = await response.json();
        console.log('Dados da resposta:', data);
      } catch (jsonError) {
        console.error('Erro ao analisar JSON:', jsonError);
        data = null;
      }
  
      if (!response.ok) {
        // Mensagem de erro mais detalhada
        let errorMessage = 'Erro ao cadastrar usuário';
        
        if (data) {
          // Verificar diferentes formatos possíveis de mensagem de erro
          if (typeof data.message === 'string') {
            errorMessage = data.message;
          } else if (typeof data.erro === 'string') {
            errorMessage = data.erro;
          } else if (typeof data.error === 'string') {
            errorMessage = data.error;
          } else if (Array.isArray(data.errors) && data.errors.length > 0) {
            errorMessage = data.errors.join(', ');
          }
        }
        
        // Verificar erros específicos de conexão
        if (response.status === 0 || response.status === 500) {
          errorMessage = 'Erro de conexão com o servidor. Verifique se o servidor está rodando.';
        } else if (response.status === 400) {
          errorMessage = data?.message || 'Dados inválidos. Verifique as informações e tente novamente.';
        } else if (response.status === 409) {
          errorMessage = 'Este usuário já está cadastrado. Tente outro email ou CPF.';
        }
        
        throw new Error(errorMessage);
      }
  
      // Fazer login após cadastro bem-sucedido
      try {
        // Verificar se o objeto auth está disponível e tem o método login
        if (!auth) {
          console.error('Objeto de autenticação não disponível');
          // Em vez de lançar um erro, redirecionar para a página de login com uma mensagem
          setError('Cadastro realizado com sucesso! Por favor, faça login manualmente.');
          setTimeout(() => {
            router.push('/login');
          }, 3000);
          return; // Importante: retornar aqui para evitar a execução do código abaixo
        }
        
        if (typeof auth.login !== 'function') {
          console.error('Método login não encontrado no objeto de autenticação');
          setError('Cadastro realizado com sucesso! Por favor, faça login manualmente.');
          setTimeout(() => {
            router.push('/login');
          }, 3000);
          return;
        }
        
        // Adicionar um pequeno atraso antes de tentar fazer login
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('Tentando fazer login com:', formData.email);
        
        // Tentar fazer login
        await auth.login(formData.email, formData.senha);
        router.push('/');
      } catch (loginError) {
        console.error('Erro ao fazer login após cadastro:', loginError);
        // Mesmo que o login falhe, o cadastro foi bem-sucedido
        setError('Cadastro realizado com sucesso, mas houve um erro ao fazer login automático. Por favor, faça login manualmente.');
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      
      // Mensagem de erro mais amigável para o usuário
      let mensagemErro = error.message || 'Ocorreu um erro ao cadastrar. Tente novamente.';
      
      // Verificar se é um erro de conexão
      if (mensagemErro.includes('conectar ao servidor') || mensagemErro.includes('connection') || mensagemErro.includes('network')) {
        mensagemErro = 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet e se o servidor está rodando.';
      }
      
      setError(mensagemErro);
      
      // Adicionar informações de depuração no console
      console.log('Detalhes do erro:', {
        mensagem: mensagemErro,
        original: error.toString(),
        stack: error.stack
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-evenly bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <img src="/porco_rico.svg" alt="" className="w-80" />

      <div className="flex flex-col gap-3 max-w-md w-full space-y-8">
        <div>
          <h1 className="mt-6 text-center text-5xl font-bold text-gray-800">
            Criar nova conta
          </h1>
          <p className="mt-2 text-center text-xl text-gray-600">
            Ou{' '}
            <Link href="/login" className="text-xl text-green-500 hover:text-green-300">
              entre na sua conta existente
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-3">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
              <input
                id="nome"
                name="nome"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Nome completo"
                value={formData.nome}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
              <input
                id="telefone"
                name="telefone"
                type="tel"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="(00) 00000-0000"
                value={formData.telefone}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
              <input
                id="cpf"
                name="cpf"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="000.000.000-00"
                value={formData.cpf}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input
                id="senha"
                name="senha"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Senha"
                value={formData.senha}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700 mb-1">Confirmar senha</label>
              <input
                id="confirmarSenha"
                name="confirmarSenha"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Confirmar senha"
                value={formData.confirmarSenha}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="pergunta_secreta" className="block text-sm font-medium text-gray-700 mb-1">Pergunta secreta</label>
              <select
                id="pergunta_secreta"
                name="pergunta_secreta"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                value={formData.pergunta_secreta}
                onChange={handleChange}
              >
                <option value="">Selecione uma pergunta secreta</option>
                <option value="Qual o nome do seu primeiro animal de estimação?">Qual o nome do seu primeiro animal de estimação?</option>
                <option value="Qual o nome da sua cidade natal?">Qual o nome da sua cidade natal?</option>
                <option value="Qual o nome da sua escola primária?">Qual o nome da sua escola primária?</option>
                <option value="Qual o nome do seu melhor amigo de infância?">Qual o nome do seu melhor amigo de infância?</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="resposta_secreta" className="block text-sm font-medium text-gray-700 mb-1">Resposta secreta</label>
              <input
                id="resposta_secreta"
                name="resposta_secreta"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Resposta secreta"
                value={formData.resposta_secreta}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                loading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
            >
              {loading ? (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              ) : (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="h-5 w-5 text-green-500 group-hover:text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}