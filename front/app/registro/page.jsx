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

  // Função para formatar CPF enquanto o usuário digita
  const formatarCPF = (cpf) => {
    // Remove todos os caracteres não numéricos
    cpf = cpf.replace(/\D/g, '');
    
    // Limita a 11 dígitos
    cpf = cpf.slice(0, 11);
    
    // Aplica a formatação: XXX.XXX.XXX-XX
    if (cpf.length > 9) {
      cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    } else if (cpf.length > 6) {
      cpf = cpf.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (cpf.length > 3) {
      cpf = cpf.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }
    
    return cpf;
  };

  // Função para formatar telefone enquanto o usuário digita
  const formatarTelefone = (telefone) => {
    // Remove todos os caracteres não numéricos
    telefone = telefone.replace(/\D/g, '');
    
    // Limita a 11 dígitos (com DDD)
    telefone = telefone.slice(0, 11);
    
    // Aplica a formatação: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
    if (telefone.length > 10) {
      // Celular com 9 dígitos + DDD: (XX) XXXXX-XXXX
      telefone = telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (telefone.length > 6) {
      // Telefone fixo com 8 dígitos + DDD: (XX) XXXX-XXXX
      telefone = telefone.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else if (telefone.length > 2) {
      // DDD + início do número: (XX) XXXX
      telefone = telefone.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    }
    
    return telefone;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Aplicar formatação específica para CPF e telefone
    if (name === 'cpf') {
      setFormData({
        ...formData,
        [name]: formatarCPF(value)
      });
    } else if (name === 'telefone') {
      setFormData({
        ...formData,
        [name]: formatarTelefone(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Função para validar formato de CPF
  const validarCPF = (cpf) => {
    // Remove caracteres não numéricos
    const cpfLimpo = cpf.replace(/[^0-9]/g, '');

    // Verifica se tem 11 dígitos
    if (cpfLimpo.length !== 11) {
      return false;
    }

    // Verifica CPF com todos os dígitos iguais
    if (/^(\d)\1{10}$/.test(cpfLimpo)) {
      return false;
    }
    
    // Implementação da validação de CPF
    let soma = 0;
    let resto;
    
    for (let i = 1; i <= 9; i++) {
      soma += parseInt(cpfLimpo.substring(i-1, i)) * (11 - i);
    }
    
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpfLimpo.substring(9, 10))) return false;
    
    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma += parseInt(cpfLimpo.substring(i-1, i)) * (12 - i);
    }
    
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpfLimpo.substring(10, 11))) return false;
    
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
      setError('CPF inválido. Verifique os números digitados.');
      setLoading(false);
      return;
    }

    // Validar formato de telefone
    if (!validarTelefone(formData.telefone)) {
      setError('Formato de telefone inválido. Use o formato (00) 00000-0000');
      setLoading(false);
      return;
    }


    // Tenta registrar o usuário usando a função do contexto de autenticação
    const result = await auth.register(formData.nome, formData.email, formData.senha);
    
    if (result.success) {
      // Registro e login bem-sucedidos
      router.push('/');
    } else {
      // Exibir mensagem de erro
      alert(result.message);
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-evenly bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <img src="/porco_rico.svg" alt="" className="w-100 hidden lg:block" />

      <div className="flex flex-col max-w-md w-full space-y-8">
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

        <form className="w-full mx-auto mt-8 space-y-6" onSubmit={handleSubmit}>
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
              Telefone (00) 00000-0000
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
              CPF 000.000.000-00
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