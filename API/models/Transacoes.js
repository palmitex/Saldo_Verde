import { create, read, update, deleteRecord, query } from "../config/database.js";

const criarTransacao = async (dados) => {
   try {
    // Garantir que os dados incluam meta_id (opcional)
    const dadosCompletos = {
      ...dados,
      meta_id: dados.meta_id || null
    };
    return await create('transacoes', dadosCompletos);
   } catch(err) {
    console.error('Erro ao criar uma transação: ', err)
    throw err;
   }
};

const listarTransacoes = async (usuarioId, filtros = {}) => {
  try {
    let condicao = `t.usuario_id = ?`;
    const parametros = [usuarioId];

    // Adicionar filtros
    if (filtros.tipo) {
      condicao += ` AND t.tipo = ?`;
      parametros.push(filtros.tipo);
    }

    if (filtros.categoria_id) {
      condicao += ` AND t.categoria_id = ?`;
      parametros.push(filtros.categoria_id);
    }
    
    if (filtros.meta_id) {
      condicao += ` AND t.meta_id = ?`;
      parametros.push(filtros.meta_id);
    }

    if (filtros.data_inicio) {
      condicao += ` AND t.data >= ?`;
      parametros.push(filtros.data_inicio);
    }

    if (filtros.data_fim) {
      condicao += ` AND t.data <= ?`;
      parametros.push(filtros.data_fim);
    }

    // Consulta com joins para categorias e metas
    const sql = `
      SELECT 
        t.*,
        c.nome as categoria_nome,
        m.nome as meta_nome
      FROM transacoes t
      LEFT JOIN categorias c ON t.categoria_id = c.id
      LEFT JOIN metas m ON t.meta_id = m.id
      WHERE ${condicao}
      ORDER BY t.data DESC, t.id DESC
    `;

    return await query(sql, parametros);
  } catch (err) {
    console.error('Erro ao listar transações: ', err);
    throw err;
  }
};

const buscarTransacaoPorId = async (id) => {
  try {
    const sql = `
      SELECT 
        t.*,
        c.nome as categoria_nome,
        m.nome as meta_nome
      FROM transacoes t
      LEFT JOIN categorias c ON t.categoria_id = c.id
      LEFT JOIN metas m ON t.meta_id = m.id
      WHERE t.id = ?
    `;
    const transacoes = await query(sql, [id]);
    return transacoes[0] || null;
  } catch (err) {
    console.error('Erro ao buscar transação: ', err);
    throw err;
  }
};

const atualizarTransacao = async (id, dados) => {
    try {
        return await update('transacoes', dados, `id = ${id}`);
    } catch(err) {
        console.error('Erro ao atualizar uma transação: ', err)
        throw err;
    }
};

const excluirTransacao = async (id) => {
  try {
    return await deleteRecord('transacoes', `id = ${id}`);
  } catch (err) {
    console.error('Erro ao excluir transação: ', err);
    throw err;
  }
};

const calcularSaldo = async (usuarioId, periodo = {}) => {
  try {
    let condicao = `usuario_id = ?`;
    const parametros = [usuarioId];
    
    if (periodo.data_inicio) {
      condicao += ` AND data >= ?`;
      parametros.push(periodo.data_inicio);
    }
    
    if (periodo.data_fim) {
      condicao += ` AND data <= ?`;
      parametros.push(periodo.data_fim);
    }
    
    const sql = `
      SELECT 
        SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE 0 END) as total_entradas,
        SUM(CASE WHEN tipo = 'saida' THEN valor ELSE 0 END) as total_saidas,
        SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE -valor END) as saldo
      FROM transacoes
      WHERE ${condicao}
    `;
    
    const resultado = await query(sql, parametros);
    return {
      totalEntradas: parseFloat(resultado[0].total_entradas || 0),
      totalSaidas: parseFloat(resultado[0].total_saidas || 0),
      saldo: parseFloat(resultado[0].saldo || 0)
    };
  } catch (err) {
    console.error('Erro ao calcular saldo: ', err);
    throw err;
  }
};

const obterGastosPorCategoria = async (usuarioId, periodo = {}) => {
  try {
    let condicao = `t.usuario_id = ? AND t.tipo = 'saida'`;
    const parametros = [usuarioId];
    
    if (periodo.data_inicio) {
      condicao += ` AND t.data >= ?`;
      parametros.push(periodo.data_inicio);
    }
    
    if (periodo.data_fim) {
      condicao += ` AND t.data <= ?`;
      parametros.push(periodo.data_fim);
    }
    
    const sql = `
      SELECT 
        c.id,
        c.nome,
        SUM(t.valor) as total,
        COUNT(t.id) as quantidade
      FROM transacoes t
      JOIN categorias c ON t.categoria_id = c.id
      WHERE ${condicao}
      GROUP BY c.id, c.nome
      ORDER BY total DESC
    `;
    
    return await query(sql, parametros);
  } catch (err) {
    console.error('Erro ao obter gastos por categoria: ', err);
    throw err;
  }
};

export {
  criarTransacao,
  listarTransacoes,
  buscarTransacaoPorId,
  atualizarTransacao,
  excluirTransacao,
  calcularSaldo,
  obterGastosPorCategoria
};