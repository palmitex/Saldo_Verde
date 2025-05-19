import { criarTransacao, listarTransacoes, buscarTransacaoPorId, atualizarTransacao, excluirTransacao, calcularSaldo, obterGastosPorCategoria } from '../models/Transacoes.js';
import { logActivity, query, read } from '../config/database.js';

// Criar uma nova transação
const registrarTransacao = async (req, res) => {
  try {
    const userId = req.query.userId || req.userId;
    const { tipo, valor, data, categoria_id, descricao, forma_pagamento } = req.body;

    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Usuário não autenticado'
      });
    }

    // Verificar se categoria existe (se fornecida)
    if (categoria_id) {
      const categoria = await read('categorias', `id = ${categoria_id} AND usuario_id = ${userId}`);
      if (!categoria) {
        return res.status(404).json({
          status: 'error',
          message: 'Categoria não encontrada'
        });
      }
    }

    // Dados para inserção
    const transacaoDados = {
      usuario_id: userId,
      categoria_id: categoria_id || null,
      tipo,
      valor,
      data,
      descricao: descricao || null,
      forma_pagamento: forma_pagamento || null
    };

    // Inserir transação usando a função do model
    const transacaoId = await criarTransacao(transacaoDados);
    
    // Registrar log de atividade
    await logActivity(userId, 'criar_transacao', `Usuário criou uma ${tipo} no valor de ${valor}`);

    res.status(201).json({
      status: 'success',
      message: 'Transação registrada com sucesso',
      data: { id: transacaoId }
    });
  } catch (error) {
    console.error('Erro ao criar transação:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao registrar transação'
    });
  }
};

// Listar transações com filtros
const listarTransacoesController = async (req, res) => {
  try {
    // Garantir que userId seja um único valor
    const userId = Array.isArray(req.query.userId) ? req.query.userId[0] : (req.query.userId || req.userId);
    console.log('Listando transações para usuário:', userId);

    if (!userId) {
      console.error('Usuário não autenticado');
      return res.status(401).json({
        status: 'error',
        message: 'Usuário não autenticado'
      });
    }

    const { 
      tipo, 
      categoria_id, 
      data_inicio, 
      data_fim, 
      valor_min, 
      valor_max, 
      limit, 
      offset 
    } = req.query;

    console.log('Filtros recebidos:', {
      tipo,
      categoria_id,
      data_inicio,
      data_fim,
      valor_min,
      valor_max,
      limit,
      offset
    });

    const filtros = {
      usuario_id: userId,
      tipo,
      categoria_id,
      data_inicio,
      data_fim
    };

    // Obter transações
    const transacoes = await listarTransacoes(filtros);
    console.log(`Encontradas ${transacoes.length} transações`);

    res.status(200).json({
      status: 'success',
      data: {
        transacoes,
        paginacao: {
          total: transacoes.length,
          limit: limit ? parseInt(limit) : null,
          offset: offset ? parseInt(offset) : 0
        }
      }
    });
  } catch (error) {
    console.error('Erro detalhado ao listar transações:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao listar transações',
      error: error.message
    });
  }
};

// Obter detalhes de uma transação específica
const obterTransacao = async (req, res) => {
  try {
    const userId = req.query.userId || req.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Usuário não autenticado'
      });
    }

    const transacao = await buscarTransacaoPorId(id);

    if (!transacao || transacao.usuario_id !== parseInt(userId)) {
      return res.status(404).json({
        status: 'error',
        message: 'Transação não encontrada'
      });
    }

    res.status(200).json({
      status: 'success',
      data: transacao
    });
  } catch (error) {
    console.error('Erro ao obter transação:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao obter transação'
    });
  }
};

// Atualizar uma transação
const atualizarTransacaoController = async (req, res) => {
  try {
    const userId = req.query.userId || req.userId;
    const { id } = req.params;
    const { tipo, valor, data, categoria_id, descricao, forma_pagamento } = req.body;

    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Usuário não autenticado'
      });
    }

    // Verificar se transação existe e pertence ao usuário
    const transacao = await buscarTransacaoPorId(id);
    if (!transacao || transacao.usuario_id !== parseInt(userId)) {
      return res.status(404).json({
        status: 'error',
        message: 'Transação não encontrada'
      });
    }

    // Verificar se categoria existe (se fornecida)
    if (categoria_id) {
      const categoria = await read('categorias', `id = ${categoria_id} AND usuario_id = ${userId}`);
      if (!categoria) {
        return res.status(404).json({
          status: 'error',
          message: 'Categoria não encontrada'
        });
      }
    }

    // Dados para atualização
    const dadosAtualizados = {};
    if (tipo !== undefined) dadosAtualizados.tipo = tipo;
    if (valor !== undefined) dadosAtualizados.valor = valor;
    if (data !== undefined) dadosAtualizados.data = data;
    if (categoria_id !== undefined) dadosAtualizados.categoria_id = categoria_id || null;
    if (descricao !== undefined) dadosAtualizados.descricao = descricao || null;
    if (forma_pagamento !== undefined) dadosAtualizados.forma_pagamento = forma_pagamento || null;

    // Atualizar transação usando função do model
    await atualizarTransacao(id, dadosAtualizados);
    
    // Registrar log de atividade
    await logActivity(userId, 'atualizar_transacao', `Usuário atualizou transação ID ${id}`);

    res.status(200).json({
      status: 'success',
      message: 'Transação atualizada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao atualizar transação'
    });
  }
};

// Excluir uma transação
const excluirTransacaoController = async (req, res) => {
  try {
    const userId = req.query.userId || req.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Usuário não autenticado'
      });
    }

    // Verificar se transação existe e pertence ao usuário
    const transacao = await buscarTransacaoPorId(id);
    if (!transacao || transacao.usuario_id !== parseInt(userId)) {
      return res.status(404).json({
        status: 'error',
        message: 'Transação não encontrada'
      });
    }

    // Excluir transação
    await excluirTransacao(id);
    
    // Registrar log de atividade
    await logActivity(userId, 'excluir_transacao', `Usuário excluiu transação ID ${id}`);

    res.status(200).json({
      status: 'success',
      message: 'Transação excluída com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir transação:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao excluir transação'
    });
  }
};

// Obter saldo atual
const obterSaldo = async (req, res) => {
  try {
    const userId = req.query.userId || req.userId;

    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Usuário não autenticado'
      });
    }

    const saldo = await calcularSaldo(userId);
    
    res.status(200).json({
      status: 'success',
      data: {
        totalEntradas: parseFloat(saldo.total_entradas || 0),
        totalSaidas: parseFloat(saldo.total_saidas || 0),
        saldo: parseFloat(saldo.saldo || 0)
      }
    });
  } catch (error) {
    console.error('Erro ao obter saldo:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao obter saldo'
    });
  }
};

// Obter gastos por categoria
const obterGastosPorCategoriaController = async (req, res) => {
  try {
    const userId = req.query.userId || req.userId;
    const { data_inicio, data_fim } = req.query;

    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Usuário não autenticado'
      });
    }

    const periodo = {
      data_inicio,
      data_fim
    };

    const gastos = await obterGastosPorCategoria(userId, periodo);
    
    res.status(200).json({
      status: 'success',
      data: gastos
    });
  } catch (error) {
    console.error('Erro ao obter gastos por categoria:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao obter gastos por categoria'
    });
  }
};

export {
  registrarTransacao,
  listarTransacoesController,
  obterTransacao,
  atualizarTransacaoController,
  excluirTransacaoController,
  obterSaldo,
  obterGastosPorCategoriaController
}; 