import { create, read, update, deleteRecord, query } from "../config/database.js";

const criarTransacao = async (dados) => {
  try {
    return await create('transacoes', dados);
  } catch (err) {
    console.error('Erro ao criar transação:', err);
    throw err;
  }
};

const listarTransacoes = async (filtros = {}) => {
  try {
    const { usuario_id, tipo, categoria_id, data_inicio, data_fim, meta_id } = filtros;
    
    let condicao = '1=1';
    const parametros = [];

    if (usuario_id) {
      condicao += ' AND t.usuario_id = ?';
      parametros.push(parseInt(usuario_id));
    }

    if (tipo) {
      condicao += ' AND t.tipo = ?';
      parametros.push(tipo);
    }

    if (categoria_id) {
      condicao += ' AND t.categoria_id = ?';
      parametros.push(parseInt(categoria_id));
    }
    
    if (meta_id) {
      condicao += ' AND t.meta_id = ?';
      parametros.push(parseInt(meta_id));
    }

    if (data_inicio) {
      condicao += ' AND DATE(t.data) >= ?';
      parametros.push(data_inicio);
    }

    if (data_fim) {
      condicao += ' AND DATE(t.data) <= ?';
      parametros.push(data_fim);
    }

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

    const resultado = await query(sql, parametros);
    return resultado;
  } catch (err) {
    console.error('Erro detalhado ao listar transações:', err);
    throw new Error(`Erro ao listar transações: ${err.message}`);
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

export {
  criarTransacao,
  listarTransacoes,
  buscarTransacoesPorUsuario,
  buscarTransacoesPorCategoria,
  buscarTransacoesPorTipo
};