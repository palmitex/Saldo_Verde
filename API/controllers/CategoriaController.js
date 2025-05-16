import { readAll, read } from '../config/database.js';
import { logActivity } from '../config/database.js';
import {  excluirCategoria, atualizarCategoria, criarCategoria, verCategoriaEspecifica, verCategorias } from '../models/Categorias.js';

// Criar uma nova categoria
const criarCategoriaController = async (req, res) => {
  try {
    const userId = req.userId;
    const { nome, tipo } = req.body;

    // Verificar se já existe uma categoria com mesmo nome e tipo para este usuário
    const existente = await read('categorias', `usuario_id = ${userId} AND nome = '${nome}' AND tipo = '${tipo}'`);
    if (existente) {
      return res.status(400).json({
        status: 'error',
        message: 'Já existe uma categoria com este nome e tipo'
      });
    }

    // Chamar a função do modelo para criar categoria
    const categoriaId = await criarCategoria(userId, { nome, tipo });
    
    // Registrar log de atividade
    await logActivity(userId, 'criar_categoria', `Usuário criou categoria "${nome}" do tipo ${tipo}`);

    res.status(201).json({
      status: 'success',
      message: 'Categoria criada com sucesso',
      data: { id: categoriaId }
    });
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao criar categoria'
    });
  }
};

// Listar categorias do usuário
 const listarCategoriasController = async (req, res) => {
  try {
    const userId = req.userId;
    const { tipo } = req.query;

    // Usar função do modelo para listar categorias
    const categorias = await verCategorias(userId, tipo);

    res.status(200).json({
      status: 'success',
      data: categorias
    });
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao listar categorias'
    });
  }
};

// Obter detalhes de uma categoria específica
const obterCategoriaController = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    // Usar função do modelo para obter categoria
    const categoria = await verCategoriaEspecifica(id, userId);

    if (!categoria) {
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
      message: 'Erro ao obter categoria'
    });
  }
};

// Atualizar uma categoria
 const atualizarCategoriaController = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { nome, tipo } = req.body;

    // Usar função do modelo para atualizar categoria
    try {
      await atualizarCategoria(id, userId, { nome, tipo });
      
      // Registrar log de atividade
      await logActivity(userId, 'atualizar_categoria', `Usuário atualizou categoria ID ${id}`);

      res.status(200).json({
        status: 'success',
        message: 'Categoria atualizada com sucesso'
      });
    } catch (error) {
      if (error.message.includes('não encontrada')) {
        return res.status(404).json({
          status: 'error',
          message: error.message
        });
      } else if (error.message.includes('Já existe')) {
        return res.status(400).json({
          status: 'error',
          message: error.message
        });
      }
      throw error;
    }
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao atualizar categoria'
    });
  }
};

// Excluir uma categoria
 const excluirCategoriaController = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    // Verificar se categoria existe e pertence ao usuário
    const categoria = await read('categorias', `id = ${id} AND usuario_id = ${userId}`);
    if (!categoria) {
      return res.status(404).json({
        status: 'error',
        message: 'Categoria não encontrada'
      });
    }

    // Verificar se existem transações usando esta categoria
    const transacoes = await readAll('transacoes', `categoria_id = ${id}`, 1);
    if (transacoes && transacoes.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Não é possível excluir categoria em uso por transações'
      });
    }

    // Usar função do modelo para excluir categoria
    await excluirCategoria(id, userId);
    
    // Registrar log de atividade
    await logActivity(userId, 'excluir_categoria', `Usuário excluiu categoria "${categoria.nome}"`);

    res.status(200).json({
      status: 'success',
      message: 'Categoria excluída com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir categoria:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao excluir categoria'
    });
  }
}; 

export {excluirCategoriaController, atualizarCategoriaController, criarCategoriaController, listarCategoriasController, obterCategoriaController}