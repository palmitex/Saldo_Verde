'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RecuperarSenha() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    pergunta_secreta: '',
    resposta_secreta: '',
    nova_senha: '',
    confirmar_senha: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [perguntaSecreta, setPerguntaSecreta] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const buscarPerguntaSecreta = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/pergunta-secreta?email=${formData.email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Email não encontrado');
      }
      
      // Verifica se a pergunta secreta está em data.data.pergunta_secreta (formato correto do backend)
      if (data.data && data.data.pergunta_secreta) {
        setPerguntaSecreta(data.data.pergunta_secreta);
        setStep(2);
      } else {
        console.error('Formato de resposta inesperado:', data);
        throw new Error('Não foi possível recuperar a pergunta secreta');
      }
    } catch (error) {
      console.error('Erro ao buscar pergunta secreta:', error);
      setError(error.message || 'Ocorreu um erro ao buscar a pergunta secreta');
    } finally {
      setLoading(false);
    }
  };

  const redefinirSenha = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.nova_senha !== formData.confirmar_senha) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/recuperar-senha`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          resposta_secreta: formData.resposta_secreta,
          nova_senha: formData.nova_senha
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao redefinir senha');
      }

      // Redirecionar para a página de login com mensagem de sucesso
      router.push('/login?message=Senha redefinida com sucesso');
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      setError(error.message || 'Ocorreu um erro ao redefinir a senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-evenly bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <img src="/recuperar_senha.svg" alt="" className="w-100 hidden lg:block" />

      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-5xl font-bold text-gray-800">
            Recuperar Senha
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            <Link href="/login" className="text-xl text-green-500 hover:text-green-300">
              Voltar para o login
            </Link>
          </p>
        </div>

        {step === 1 ? (
          <form className="mt-8 space-y-6" onSubmit={buscarPerguntaSecreta}>
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="email"
                name="email"
                id="email"
                required
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-600 peer"
                placeholder=" "
                value={formData.email}
                onChange={handleChange}
              />
              <label htmlFor="email" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-green-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Email
              </label>
            </div>

            {error && <div className="text-red-500 text-sm text-center">{error}</div>}

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 text-sm font-medium rounded-md text-white ${loading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
              >
                {loading ? 'Verificando...' : 'Continuar'}
              </button>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={redefinirSenha}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Pergunta Secreta</label>
              <p className="p-2 bg-gray-100 rounded-md">{perguntaSecreta}</p>
            </div>

            <div className="relative z-0 w-full mb-5 group">
              <input
                type="text"
                name="resposta_secreta"
                id="resposta_secreta"
                required
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-600 peer"
                placeholder=" "
                value={formData.resposta_secreta}
                onChange={handleChange}
              />
              <label htmlFor="resposta_secreta" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-green-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Resposta Secreta
              </label>
            </div>

            <div className="relative z-0 w-full mb-5 group">
              <input
                type="password"
                name="nova_senha"
                id="nova_senha"
                required
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-600 peer"
                placeholder=" "
                value={formData.nova_senha}
                onChange={handleChange}
              />
              <label htmlFor="nova_senha" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-green-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Nova Senha
              </label>
            </div>

            <div className="relative z-0 w-full mb-5 group">
              <input
                type="password"
                name="confirmar_senha"
                id="confirmar_senha"
                required
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-600 peer"
                placeholder=" "
                value={formData.confirmar_senha}
                onChange={handleChange}
              />
              <label htmlFor="confirmar_senha" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-green-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Confirmar Nova Senha
              </label>
            </div>

            {error && <div className="text-red-500 text-sm text-center">{error}</div>}

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/2 py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Voltar
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`w-1/2 py-2 px-4 text-sm font-medium rounded-md text-white ${loading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
              >
                {loading ? 'Redefinindo...' : 'Redefinir Senha'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>

  );
}