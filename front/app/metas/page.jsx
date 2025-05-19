'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function MetasPage() {
  return (
    <ProtectedRoute>
      <Metas />
    </ProtectedRoute>
  );
}

function Metas() {
  const [metas, setMetas] = useState([]);
  const auth = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: '',
    valor_objetivo: '',
    valor_inicial: '',
    prazo: new Date().toISOString().split('T')[0],
    usuario_id: auth?.user?.id || null
  });
  const [editando, setEditando] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);

  useEffect(() => {
    if (auth?.user) {
      buscarMetas();
    }
  }, [auth?.user]);

  const buscarMetas = async () => {
    try {
      if (!auth?.user) {
        console.error('Usuário não autenticado');
        router.push('/login');
        return;
      }
      console.log('Buscando metas para usuário:', auth.user.id);
      const response = await auth.authFetch('http://localhost:3001/metas');
      console.log('Resposta da API:', response);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Dados recebidos:', data);
        
        if (data.status === 'success' && Array.isArray(data.data)) {
          console.log('Metas encontradas:', data.data);
          setMetas(data.data);
        } else {
          console.error('Formato de dados inválido:', data);
          throw new Error(data.message || 'Formato de dados inválido');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Erro na resposta:', errorData);
        throw new Error(errorData.message || 'Erro ao buscar metas');
      }
    } catch (error) {
      console.error('Erro ao buscar metas:', error);
      setMetas([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!auth?.user) {
        console.error('Usuário não autenticado');
        router.push('/login');
        return;
      }

      // Validar campos obrigatórios
      if (!formData.nome || !formData.valor_objetivo || !formData.valor_inicial || !formData.prazo) {
        alert('Por favor, preencha todos os campos obrigatórios: Nome, Valor Objetivo, Valor Inicial e Prazo');
        return;
      }

      // Validar valor objetivo
      const valorObjetivo = parseFloat(formData.valor_objetivo);
      if (isNaN(valorObjetivo) || valorObjetivo <= 0) {
        alert('O valor objetivo deve ser um número positivo');
        return;
      }

      // Validar valor inicial
      const valorInicial = parseFloat(formData.valor_inicial);
      if (isNaN(valorInicial) || valorInicial < 0) {
        alert('O valor inicial deve ser um número não negativo');
        return;
      }

      // Validar prazo
      const dataPrazo = new Date(formData.prazo);
      const hoje = new Date();
      if (dataPrazo < hoje) {
        alert('O prazo deve ser uma data futura');
        return;
      }
      
      const metaData = {
        ...formData,
        usuario_id: auth.user.id,
        valor_objetivo: valorObjetivo,
        valor_inicial: valorInicial,
        nome: formData.nome.trim()
      };
      
      console.log('Dados da meta a ser enviada:', metaData);
      
      let response;
      
      if (editando) {
        // Verificar se a meta pertence ao usuário atual
        const metaAtual = metas.find(m => m.id === editando);
        if (!metaAtual) {
          alert('Meta não encontrada.');
          return;
        }
        
        // Verificar se o usuário é o proprietário da meta antes de tentar atualizar
        if (String(metaAtual.usuario_id) !== String(auth.user.id)) {
          alert('Você não tem permissão para editar esta meta');
          return;
        }
        
        // Simplificar a requisição para usar apenas o método padrão de authFetch
        response = await auth.authFetch(`http://localhost:3001/metas/${editando}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...metaData,
            usuario_id: parseInt(auth.user.id) // Garantir que seja número no corpo
          }),
        });
      } else {
        response = await auth.authFetch('http://localhost:3001/metas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(metaData),
        });
      }
      
      console.log('Resposta da API:', response);
      
      if (response.ok) {
        const responseData = await response.json();
        console.log('Dados da resposta:', responseData);
        
        setFormData({
          nome: '',
          valor_objetivo: '',
          valor_inicial: '',
          prazo: new Date().toISOString().split('T')[0],
          usuario_id: auth.user.id
        });
        setEditando(null);
        setMostrarForm(false);
        
        // Buscar metas atualizadas
        await buscarMetas();
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error(`Erro ao salvar meta: ${response.status} ${response.statusText}`, errorData);
        alert(errorData.message || 'Erro ao salvar meta. Por favor, tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao salvar meta:', error);
      alert('Erro ao salvar meta. Por favor, tente novamente.');
    }
  };

  const handleEditar = (meta) => {
    setFormData({
      nome: meta.nome,
      valor_objetivo: meta.valor_objetivo,
      valor_inicial: meta.valor_inicial,
      prazo: meta.prazo ? meta.prazo.split('T')[0] : '',
      usuario_id: meta.usuario_id
    });
    setEditando(meta.id);
    setMostrarForm(true);
  };

  const handleExcluir = async (id) => {
    if (confirm('Tem certeza que deseja excluir esta meta?')) {
      try {
        if (!auth?.user) {
          console.error('Usuário não autenticado');
          router.push('/login');
          return;
        }
        
        // Modificar a URL para incluir o userId como parâmetro de consulta
        const response = await auth.authFetch(`http://localhost:3001/metas/${id}?userId=${auth.user.id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          buscarMetas();
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error(`Erro ao excluir meta: ${response.status} ${response.statusText}`, errorData);
          alert(errorData.message || 'Erro ao excluir meta');
        }
      } catch (error) {
        console.error('Erro ao excluir meta:', error);
        alert('Erro ao excluir meta: ' + error.message);
      }
    }
  };

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Minhas Metas</h1>
      
      <button 
        onClick={() => {
          setFormData({
            nome: '',
            valor_objetivo: '',
            valor_inicial: '',
            prazo: new Date().toISOString().split('T')[0],
            usuario_id: auth?.user?.id || null
          });
          setEditando(null);
          setMostrarForm(!mostrarForm);
        }}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mb-4"
      >
        {mostrarForm ? 'Cancelar' : 'Nova Meta'}
      </button>
      
      {mostrarForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">{editando ? 'Editar Meta' : 'Nova Meta'}</h2>
          
          <div className="mb-4">
            <label className="block mb-1">Nome</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-1">Valor Objetivo (R$)</label>
            <input
              type="number"
              name="valor_objetivo"
              value={formData.valor_objetivo}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Valor Inicial (R$)</label>
            <input
              type="number"
              name="valor_inicial"
              value={formData.valor_inicial}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              min="0"
              step="0.01"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-1">Prazo</label>
            <input
              type="date"
              name="prazo"
              value={formData.prazo}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            {editando ? 'Atualizar' : 'Salvar'}
          </button>
        </form>
      )}
      
      {metas.length === 0 ? (
        <p>Você ainda não tem metas cadastradas.</p>
      ) : (
        <ul className="space-y-4">
          {metas.map((meta) => (
            <li key={meta.id} className="border p-4 rounded-lg bg-white shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{meta.nome}</h2>
                  <p className="font-bold text-green-600 mt-2">
                    Valor objetivo: {formatarMoeda(meta.valor_objetivo)}
                  </p>
                  <p className="mt-1">
                    Valor inicial: {formatarMoeda(meta.valor_inicial)}
                  </p>
                  <p className="mt-1">
                    Prazo: {new Date(meta.prazo).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEditar(meta)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleExcluir(meta.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Excluir
                  </button>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-blue-600 h-4 rounded-full transition-all duration-500 ease-in-out" 
                    style={{ width: `${meta.percentual}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>Progresso: {formatarMoeda(meta.valor_inicial)}</span>
                  <span>Objetivo: {formatarMoeda(meta.valor_objetivo)}</span>
                  <span>{meta.percentual.toFixed(1)}%</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
