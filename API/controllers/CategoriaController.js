import { criarCategoria, buscarCategoriaPorId, listarCategoriasPorUsuario, atualizarCategoria } from '../models/Categorias.js';
import { logActivity } from '../config/database.js';

// Criar uma nova categoria
const registrarCategoria = async (req, res) => {
  try {
    console.log('Headers recebidos:', req.headers);
    console.log('Body recebido:', req.body);

    const userId = req.userId;
    const { nome } = req.body;

    console.log('Dados recebidos:', { userId, nome });

    if (!userId) {
      console.error('Usuário não autenticado - userId não encontrado');
      return res.status(401).json({
        status: 'error',
        message: 'Usuário não autenticado'
      });
    }

    if (!nome || nome.trim() === '') {
      console.error('Nome da categoria não fornecido ou vazio');
      return res.status(400).json({
        status: 'error',
        message: 'Nome da categoria é obrigatório'
      });
    }

    const categoriaDados = {
      usuario_id: parseInt(userId),
      nome: nome.trim()
    };

    console.log('Dados da categoria a ser criada:', categoriaDados);

    const categoriaId = await criarCategoria(categoriaDados);
    
    // Registrar log de atividade
    await logActivity(userId, 'criar_categoria', `Usuário criou categoria ${nome}`);

    res.status(201).json({
      status: 'success',
      message: 'Categoria criada com sucesso',
      data: { id: categoriaId, nome: categoriaDados.nome }
    });
  } catch (error) {
    console.error('Erro detalhado ao criar categoria:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao criar categoria',
      error: error.message
    });
  }
};

// Listar categorias do usuário
const listarCategorias = async (req, res) => {
  try {
    const userId = req.query.userId || req.userId;

    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Usuário não autenticado'
      });
    }

    const categorias = await listarCategoriasPorUsuario(userId);

    res.status(200).json({
      status: 'success',
      data: categorias
    });
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao listar categorias',
      error: error.message
    });
  }
};

// Obter categoria específica
const obterCategoria = async (req, res) => {
  try {
    const userId = req.query.userId || req.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Usuário não autenticado'
      });
    }

    const categoria = await buscarCategoriaPorId(id);

    if (!categoria || categoria.usuario_id !== parseInt(userId)) {
      return res.status(404).json({
        status: 'error',
        message: 'Categoria não encontrada'
      });
    }

    res.status(200).json({
      status: 'success',
      data: categoria
    });
  } catch (error) {
    console.error('Erro ao obter categoria:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao obter categoria',
      error: error.message
    });
  }
};

// Atualizar categoria
const atualizarCategoriaController = async (req, res) => {
  try {
    const userId = req.query.userId || req.userId;
    const { id } = req.params;
    const { nome } = req.body;

    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Usuário não autenticado'
      });
    }

    if (!nome || nome.trim() === '') {
      return res.status(400).json({
        status: 'error',
        message: 'Nome da categoria é obrigatório'
      });
    }

    const categoria = await buscarCategoriaPorId(id);

    if (!categoria || categoria.usuario_id !== parseInt(userId)) {
      return res.status(404).json({
        status: 'error',
        message: 'Categoria não encontrada'
      });
    }

    await atualizarCategoria(id, { nome: nome.trim() });
    
    // Registrar log de atividade
    await logActivity(userId, 'atualizar_categoria', `Usuário atualizou categoria ${nome}`);

    res.status(200).json({
      status: 'success',
      message: 'Categoria atualizada com sucesso',
      data: { id, nome: nome.trim() }
    });
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao atualizar categoria',
      error: error.message
    });
  }
};

export {
  registrarCategoria,
  listarCategorias,
  obterCategoria,
  atualizarCategoriaController
};