import { criarTransacao, atualizarTransacao } from '../models/Transacoes.js';
import { logActivity, query, read, deleteRecord } from '../config/database.js';

// Criar uma nova transação
const registrarTransacao = async (req, res) => {
  try {
    const userId = req.userId;
    const { tipo, valor, data, categoria_id, descricao, forma_pagamento } = req.body;

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
const listarTransacoes = async (req, res) => {
  try {
    const userId = req.userId;
    const { 
      tipo, categoria_id, data_inicio, data_fim, 
      valor_min, valor_max, limit, offset 
    } = req.query;

    // Condição base para consulta
    let condicao = `t.usuario_id = ?`;
    const parametros = [userId];

    // Adicionar filtros à condição
    if (tipo) {
      condicao += ` AND t.tipo = ?`;
      parametros.push(tipo);
    }

    if (categoria_id) {
      condicao += ` AND t.categoria_id = ?`;
      parametros.push(categoria_id);
    }

    if (data_inicio) {
      condicao += ` AND t.data >= ?`;
      parametros.push(data_inicio);
    }

    if (data_fim) {
      condicao += ` AND t.data <= ?`;
      parametros.push(data_fim);
    }

    if (valor_min) {
      condicao += ` AND t.valor >= ?`;
      parametros.push(valor_min);
    }

    if (valor_max) {
      condicao += ` AND t.valor <= ?`;
      parametros.push(valor_max);
    }

    // Query principal para obter transações
    let sql = `
      SELECT 
        t.id,
        t.tipo,
        t.valor,
        t.data,
        t.descricao,
        t.forma_pagamento,
        t.criado_em,
        c.nome as categoria_nome,
        c.id as categoria_id
      FROM transacoes t
      LEFT JOIN categorias c ON t.categoria_id = c.id
      WHERE ${condicao}
      ORDER BY t.data DESC, t.id DESC
    `;

    // Adicionar paginação
    if (limit) {
      sql += ` LIMIT ?`;
      parametros.push(parseInt(limit));
      
      if (offset) {
        sql += ` OFFSET ?`;
        parametros.push(parseInt(offset));
      }
    }

    // Obter transações
    const transacoes = await query(sql, parametros);

    // Obter total de registros para paginação
    const totalSql = `
      SELECT COUNT(*) as total 
      FROM transacoes t 
      WHERE ${condicao}
    `;
    
    const totalResult = await query(totalSql, parametros);
    const total = totalResult[0].total;

    res.status(200).json({
      status: 'success',
      data: {
        transacoes,
        paginacao: {
          total,
          limit: limit ? parseInt(limit) : null,
          offset: offset ? parseInt(offset) : 0
        }
      }
    });
  } catch (error) {
    console.error('Erro ao listar transações:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao listar transações'
    });
  }
};

// Obter detalhes de uma transação específica
const obterTransacao = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    // Obter transação
    const sql = `
      SELECT 
        t.id,
        t.tipo,
        t.valor,
        t.data,
        t.descricao,
        t.forma_pagamento,
        t.criado_em,
        c.nome as categoria_nome,
        c.id as categoria_id
      FROM transacoes t
      LEFT JOIN categorias c ON t.categoria_id = c.id
      WHERE t.id = ? AND t.usuario_id = ?
    `;

    const transacoes = await query(sql, [id, userId]);
    const transacao = transacoes[0];

    if (!transacao) {
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
    const userId = req.userId;
    const { id } = req.params;
    const { tipo, valor, data, categoria_id, descricao, forma_pagamento } = req.body;

    // Verificar se transação existe e pertence ao usuário
    const transacao = await read('transacoes', `id = ${id} AND usuario_id = ${userId}`);
    if (!transacao) {
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
const excluirTransacao = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    // Verificar se transação existe e pertence ao usuário
    const transacao = await read('transacoes', `id = ${id} AND usuario_id = ${userId}`);
    if (!transacao) {
      return res.status(404).json({
        status: 'error',
        message: 'Transação não encontrada'
      });
    }

    // Excluir transação
    await deleteRecord('transacoes', `id = ${id}`);
    
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
    const userId = req.userId;

    // Calcular saldo
    const sql = `
      SELECT 
        SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE 0 END) as total_entradas,
        SUM(CASE WHEN tipo = 'saida' THEN valor ELSE 0 END) as total_saidas,
        SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE -valor END) as saldo
      FROM transacoes
      WHERE usuario_id = ?
    `;

    const resultado = await query(sql, [userId]);
    
    res.status(200).json({
      status: 'success',
      data: {
        totalEntradas: parseFloat(resultado[0].total_entradas || 0),
        totalSaidas: parseFloat(resultado[0].total_saidas || 0),
        saldo: parseFloat(resultado[0].saldo || 0)
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

// Obter saldo mensal
const obterSaldoMensal = async (req, res) => {
  try {
    const userId = req.userId;
    const { ano, mes } = req.query;

    if (!ano || !mes) {
      return res.status(400).json({
        status: 'error',
        message: 'Ano e mês são obrigatórios'
      });
    }

    // Calcular saldo mensal
    const sql = `
      SELECT 
        SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE 0 END) as total_entradas,
        SUM(CASE WHEN tipo = 'saida' THEN valor ELSE 0 END) as total_saidas,
        SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE -valor END) as saldo
      FROM transacoes
      WHERE usuario_id = ? AND YEAR(data) = ? AND MONTH(data) = ?
    `;

    const resultado = await query(sql, [userId, ano, mes]);
    
    res.status(200).json({
      status: 'success',
      data: {
        ano: parseInt(ano),
        mes: parseInt(mes),
        totalEntradas: parseFloat(resultado[0].total_entradas || 0),
        totalSaidas: parseFloat(resultado[0].total_saidas || 0),
        saldo: parseFloat(resultado[0].saldo || 0)
      }
    });
  } catch (error) {
    console.error('Erro ao obter saldo mensal:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao obter saldo mensal'
    });
  }
};

// Obter gastos por categoria
const obterGastosPorCategoria = async (req, res) => {
  try {
    const userId = req.userId;
    const { ano, mes } = req.query;

    // Condição para o período
    let filtroPeriodo = '';
    const parametros = [userId];
    
    if (ano && mes) {
      filtroPeriodo = ' AND YEAR(t.data) = ? AND MONTH(t.data) = ?';
      parametros.push(ano, mes);
    } else if (ano) {
      filtroPeriodo = ' AND YEAR(t.data) = ?';
      parametros.push(ano);
    }
    
    // Consulta SQL para gastos por categoria
    const sql = `
      SELECT 
        c.id,
        c.nome,
        SUM(t.valor) as total,
        COUNT(t.id) as quantidade
      FROM transacoes t
      JOIN categorias c ON t.categoria_id = c.id
      WHERE t.usuario_id = ? AND t.tipo = 'saida'${filtroPeriodo}
      GROUP BY c.id, c.nome
      ORDER BY total DESC
    `;

    const categorias = await query(sql, parametros);
    
    // Calcular total de saídas para determinar porcentagens
    const totalSql = `
      SELECT SUM(valor) as total_saidas
      FROM transacoes
      WHERE usuario_id = ? AND tipo = 'saida'${filtroPeriodo}
    `;
    
    const totalResult = await query(totalSql, parametros);
    const totalSaidas = parseFloat(totalResult[0].total_saidas || 0);
    
    // Calcular porcentagem para cada categoria
    const resultado = categorias.map(cat => ({
      id: cat.id,
      nome: cat.nome,
      total: parseFloat(cat.total),
      quantidade: parseInt(cat.quantidade),
      porcentagem: totalSaidas ? (parseFloat(cat.total) / totalSaidas) * 100 : 0
    }));

    res.status(200).json({
      status: 'success',
      data: {
        categorias: resultado,
        totalSaidas
      }
    });
  } catch (error) {
    console.error('Erro ao obter gastos por categoria:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao obter gastos por categoria'
    });
  }
};

export {registrarTransacao, listarTransacoes, obterTransacao, atualizarTransacaoController, excluirTransacao, obterSaldo, obterSaldoMensal, obterGastosPorCategoria}; 