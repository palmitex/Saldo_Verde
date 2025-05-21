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
      <img src="/porco_rico.svg" alt="" className="w-100 hidden lg:block" />

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

        <form className="max-w-md mx-auto mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="nome"
              id="nome"
              placeholder=" "
              required
              value={formData.nome}
              onChange={handleChange}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-600 peer"
            />
            <label
              htmlFor="nome"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Nome completo
            </label>
          </div>

          <div className="relative z-0 w-full mb-5 group">
            <input
              type="email"
              name="email"
              id="email"
              placeholder=" "
              required
              value={formData.email}
              onChange={handleChange}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-600 peer"
            />
            <label
              htmlFor="email"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Email
            </label>
          </div>

          <div className="relative z-0 w-full mb-5 group">
            <input
              type="tel"
              name="telefone"
              id="telefone"
              placeholder=" "
              required
              value={formData.telefone}
              onChange={handleChange}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-600 peer"
            />
            <label
              htmlFor="telefone"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Telefone
            </label>
          </div>

          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="cpf"
              id="cpf"
              placeholder=" "
              required
              value={formData.cpf}
              onChange={handleChange}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-600 peer"
            />
            <label
              htmlFor="cpf"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              CPF
            </label>
          </div>

          <div className="relative z-0 w-full mb-5 group">
            <input
              type="password"
              name="senha"
              id="senha"
              placeholder=" "
              required
              value={formData.senha}
              onChange={handleChange}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-600 peer"
            />
            <label
              htmlFor="senha"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Senha
            </label>
          </div>

          <div className="relative z-0 w-full mb-5 group">
            <input
              type="password"
              name="confirmarSenha"
              id="confirmarSenha"
              placeholder=" "
              required
              value={formData.confirmarSenha}
              onChange={handleChange}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-600 peer"
            />
            <label
              htmlFor="confirmarSenha"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Confirmar senha
            </label>
          </div>

          <div className="relative z-0 w-full mb-5 group">
            <select
              id="pergunta_secreta"
              name="pergunta_secreta"
              required
              value={formData.pergunta_secreta}
              onChange={handleChange}
              className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer
      ${formData.pergunta_secreta ? 'border-green-600' : 'border-gray-300 focus:border-green-600'}`}
            >
              <option value="" disabled hidden>Selecione uma pergunta secreta</option>
              <option value="Qual o nome do seu primeiro animal de estimação?">Qual o nome do seu primeiro animal de estimação?</option>
              <option value="Qual o nome da sua cidade natal?">Qual o nome da sua cidade natal?</option>
              <option value="Qual o nome da sua escola primária?">Qual o nome da sua escola primária?</option>
              <option value="Qual o nome do seu melhor amigo de infância?">Qual o nome do seu melhor amigo de infância?</option>
            </select>
            <label
              htmlFor="pergunta_secreta"
              className={`absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] transition-all
      peer-focus:scale-75 peer-focus:-translate-y-6
      ${formData.pergunta_secreta ? 'scale-75 -translate-y-6' : ''}`}
            >
              Pergunta secreta
            </label>
          </div>


          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="resposta_secreta"
              id="resposta_secreta"
              placeholder=" "
              required
              value={formData.resposta_secreta}
              onChange={handleChange}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-600 peer"
            />
            <label
              htmlFor="resposta_secreta"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Resposta secreta
            </label>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center transition ${loading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
              } focus:outline-none focus:ring-4 focus:ring-green-300`}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

      </div>
    </div>
  );
}