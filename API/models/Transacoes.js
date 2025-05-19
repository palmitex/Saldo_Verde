import { create, read, readAll, update, deleteRecord } from "../config/database.js";

const criarTransacao = async (dados) => {
   try {
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

const listarTransacoes = async () => {
  try {
    return await readAll('transacoes');
  } catch (err) {
    console.error('Erro ao listar transações: ', err);
    throw err;
  }
};

const buscarTransacaoPorId = async (id) => {
  try {
    return await read('transacoes', `id = ${id}`);
  } catch (err) {
    console.error('Erro ao buscar transação: ', err);
    throw err;
  }
};

const buscarTransacoesPorUsuario = async (usuarioId) => {
  try {
    return await read('transacoes', `usuario_id = ${usuarioId}`);
  } catch (err) {
    console.error('Erro ao buscar transações do usuário: ', err);
    throw err;
  }
};

const buscarTransacoesPorCategoria = async (categoriaId) => {
  try {
    return await read('transacoes', `categoria_id = ${categoriaId}`);
  } catch (err) {
    console.error('Erro ao buscar transações por categoria: ', err);
    throw err;
  }
};

const buscarTransacoesPorTipo = async (tipo) => {
  try {
    return await read('transacoes', `tipo = '${tipo}'`);
  } catch (err) {
    console.error('Erro ao buscar transações por tipo: ', err);
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
  buscarTransacoesPorUsuario,
  buscarTransacoesPorCategoria,
  buscarTransacoesPorTipo,
  atualizarTransacao,
  excluirTransacao,
  calcularSaldo,
  obterGastosPorCategoria
};