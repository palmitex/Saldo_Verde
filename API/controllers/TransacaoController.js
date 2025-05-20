import { criarTransacao, listarTransacoes, buscarTransacaoPorId, atualizarTransacao, excluirTransacao, calcularSaldo, obterGastosPorCategoria } from '../models/Transacoes.js';
import { logActivity, query, read, update } from '../config/database.js';
import { buscarMetaPorId } from '../models/Metas.js';

// Criar uma nova transação
const registrarTransacao = async (req, res) => {
  try {
    const userId = req.query.userId || req.userId;
    const { tipo, valor, data, categoria_id, meta_id, descricao, forma_pagamento } = req.body;

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

    // Verificar se meta existe (se fornecida)
    let metaAtual = null;
    if (meta_id) {
      metaAtual = await buscarMetaPorId(meta_id);
      if (!metaAtual || metaAtual.usuario_id != userId) {
        return res.status(404).json({
          status: 'error',
          message: 'Meta não encontrada'
        });
      }
      
      // Verificar saldo suficiente para saídas associadas a metas
      if (tipo === 'saida') {
        const valorAtual = parseFloat(metaAtual.valor_inicial || 0);
        const valorSaida = parseFloat(valor);
        
        if (valorSaida > valorAtual) {
          return res.status(400).json({
            status: 'error',
            message: 'Saldo insuficiente na meta para realizar esta saída'
          });
        }
      }
    }

    // Dados para inserção
    const transacaoDados = {
      usuario_id: userId,
      categoria_id: categoria_id || null,
      meta_id: meta_id || null,
      tipo,
      valor,
      data,
      descricao: descricao || null,
      forma_pagamento: forma_pagamento || null
    };

    // Inserir transação usando a função do model
    const transacaoId = await criarTransacao(transacaoDados);
    
    // Atualizar progresso da meta se for uma transação associada a meta
    if (meta_id && metaAtual) {
      let valorAtual = parseFloat(metaAtual.valor_inicial || 0);
      
      if (tipo === 'entrada') {
        // Para entradas, aumentar o valor da meta
        valorAtual += parseFloat(valor);
      } else if (tipo === 'saida') {
        // Para saídas, diminuir o valor da meta
        valorAtual -= parseFloat(valor);
      }
      
      await update('metas', { valor_inicial: valorAtual }, `id = ${meta_id}`);
      
      // Registrar log de atividade específico para atualização de meta
      await logActivity(userId, 'atualizar_meta', `Usuário atualizou progresso da meta "${metaAtual.nome}" com uma ${tipo} de ${valor}`);
    }
    
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
    const { tipo, valor, data, categoria_id, meta_id, descricao, forma_pagamento } = req.body;

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

    // Se a meta está sendo alterada ou o tipo/valor da transação está mudando, precisamos ajustar os valores das metas
    let metaAntiga = null;
    let metaNova = null;
    
    // Verificar meta antiga (se existia)
    if (transacao.meta_id) {
      metaAntiga = await buscarMetaPorId(transacao.meta_id);
      
      // Se era uma transação de entrada, precisamos remover o valor da meta antiga
      if (transacao.tipo === 'entrada' && metaAntiga) {
        const valorAjustado = Math.max(0, parseFloat(metaAntiga.valor_inicial || 0) - parseFloat(transacao.valor));
        await update('metas', { valor_inicial: valorAjustado }, `id = ${transacao.meta_id}`);
      }
    }
    
    // Verificar meta nova (se fornecida)
    if (meta_id) {
      metaNova = await buscarMetaPorId(meta_id);
      if (!metaNova || metaNova.usuario_id != userId) {
        return res.status(404).json({
          status: 'error',
          message: 'Meta não encontrada'
        });
      }
    }

    // Dados para atualização
    const dadosAtualizados = {
      categoria_id: categoria_id || null,
      meta_id: meta_id || null,
      tipo,
      valor,
      data,
      descricao: descricao || null,
      forma_pagamento: forma_pagamento || null
    };

    // Atualizar transação
    await atualizarTransacao(id, dadosAtualizados);
    
    // Se a nova transação é de entrada e tem meta associada, atualizar o progresso da meta
    if (meta_id && tipo === 'entrada' && metaNova) {
      const valorAtual = parseFloat(metaNova.valor_inicial || 0) + parseFloat(valor);
      await update('metas', { valor_inicial: valorAtual }, `id = ${meta_id}`);
      
      // Registrar log de atividade
      await logActivity(userId, 'atualizar_meta', `Usuário atualizou progresso da meta "${metaNova.nome}" com uma entrada de ${valor}`);
    }
    
    // Registrar log de atividade
    await logActivity(userId, 'atualizar_transacao', `Usuário atualizou transação ${id}`);

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

    // Se a transação está associada a uma meta e é do tipo entrada, ajustar o valor da meta
    if (transacao.meta_id && transacao.tipo === 'entrada') {
      const meta = await buscarMetaPorId(transacao.meta_id);
      if (meta) {
        const valorAjustado = Math.max(0, parseFloat(meta.valor_inicial || 0) - parseFloat(transacao.valor));
        await update('metas', { valor_inicial: valorAjustado }, `id = ${transacao.meta_id}`);
        
        // Registrar log de atividade
        await logActivity(userId, 'atualizar_meta', `Valor da meta "${meta.nome}" ajustado após exclusão de transação`);
      }
    }

    // Excluir transação
    await excluirTransacao(id);
    
    // Registrar log de atividade
    await logActivity(userId, 'excluir_transacao', `Usuário excluiu transação ${id}`);

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

// Obter gastos por período e categoria
const obterGastosPorPeriodo = async (req, res) => {
  try {
    const userId = req.query.userId || req.userId;
    const { periodo, categoria_id } = req.query;

    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Usuário não autenticado'
      });
    }

    let dataInicio, dataFim;
    const hoje = new Date();
    
    // Definir período
    switch(periodo) {
      case 'semana':
        dataInicio = new Date(hoje);
        dataInicio.setDate(hoje.getDate() - 7);
        dataFim = hoje;
        break;
      case 'mes':
        dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        dataFim = hoje;
        break;
      case 'ano':
        dataInicio = new Date(hoje.getFullYear(), 0, 1);
        dataFim = hoje;
        break;
      default:
        dataInicio = new Date(hoje);
        dataInicio.setDate(hoje.getDate() - 30); // Padrão: últimos 30 dias
        dataFim = hoje;
    }

    // Formatar datas para SQL
    const dataInicioFormatada = dataInicio.toISOString().split('T')[0];
    const dataFimFormatada = dataFim.toISOString().split('T')[0];

    let sql;
    let params = [userId, dataInicioFormatada, dataFimFormatada];

    if (categoria_id) {
      // Gastos por período para uma categoria específica
      sql = `
        SELECT 
          DATE(data) as data,
          SUM(CASE WHEN tipo = 'saida' THEN valor ELSE 0 END) as total_saidas,
          SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE 0 END) as total_entradas
        FROM transacoes
        WHERE usuario_id = ? 
          AND data BETWEEN ? AND ?
          AND categoria_id = ?
        GROUP BY DATE(data)
        ORDER BY data
      `;
      params.push(categoria_id);
    } else {
      // Gastos por categoria no período
      sql = `
        SELECT 
          c.id,
          c.nome,
          SUM(CASE WHEN t.tipo = 'saida' THEN t.valor ELSE 0 END) as total_saidas,
          SUM(CASE WHEN t.tipo = 'entrada' THEN t.valor ELSE 0 END) as total_entradas,
          COUNT(t.id) as quantidade
        FROM transacoes t
        LEFT JOIN categorias c ON t.categoria_id = c.id
        WHERE t.usuario_id = ? 
          AND t.data BETWEEN ? AND ?
        GROUP BY c.id, c.nome
        ORDER BY total_saidas DESC
      `;
    }

    const resultado = await query(sql, params);

    res.status(200).json({
      status: 'success',
      data: {
        periodo: {
          inicio: dataInicioFormatada,
          fim: dataFimFormatada,
          tipo: periodo
        },
        resultados: resultado
      }
    });
  } catch (error) {
    console.error('Erro ao obter gastos por período:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao obter gastos por período'
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
  obterGastosPorPeriodo
};