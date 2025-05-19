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
      const response = await fetch(`http://localhost:3001/usuarios/pergunta-secreta?email=${formData.email}`, {
      method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Email não encontrado');
      }

      setPerguntaSecreta(data.pergunta_secreta);
      setStep(2);
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
      const response = await fetch('http://localhost:3001/usuarios/recuperar-senha', {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Recuperar Senha
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            <Link href="/login" className="font-medium text-green-600 hover:text-green-500">
              Voltar para o login
            </Link>
          </p>
        </div>
        
        {step === 1 ? (
          <form className="mt-8 space-y-6" onSubmit={buscarPerguntaSecreta}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleChange}
              />
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
                {loading ? 'Verificando...' : 'Continuar'}
              </button>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={redefinirSenha}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pergunta Secreta</label>
              <p className="p-2 bg-gray-100 rounded-md">{perguntaSecreta}</p>
            </div>
            
            <div>
              <label htmlFor="resposta_secreta" className="block text-sm font-medium text-gray-700 mb-1">Resposta Secreta</label>
              <input
                id="resposta_secreta"
                name="resposta_secreta"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Sua resposta secreta"
                value={formData.resposta_secreta}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="nova_senha" className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
              <input
                id="nova_senha"
                name="nova_senha"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Nova senha"
                value={formData.nova_senha}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="confirmar_senha" className="block text-sm font-medium text-gray-700 mb-1">Confirmar Nova Senha</label>
              <input
                id="confirmar_senha"
                name="confirmar_senha"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Confirmar nova senha"
                value={formData.confirmar_senha}
                onChange={handleChange}
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="group relative w-1/2 flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Voltar
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-1/2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                  loading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
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