import { create, read, update, deleteRecord, query } from '../config/database.js';

const criarMeta = async (metaDados) => {
  try {
    const dadosCompletos = {
      ...metaDados,
      categoria_id: metaDados.categoria_id || null
    };
    return await create('metas', dadosCompletos);
  } catch (err) {
    console.error('Erro ao criar meta: ', err);
    throw err;
  }
};

const listarMetasPorUsuario = async (usuarioId) => {
  try {
    const sql = `
      SELECT m.*, c.nome as categoria_nome
      FROM metas m
      LEFT JOIN categorias c ON m.categoria_id = c.id
      WHERE m.usuario_id = ?
      ORDER BY m.prazo ASC
    `;
    return await query(sql, [usuarioId]);
  } catch (err) {
    console.error('Erro ao listar metas: ', err);
    throw err;
  }
};

const buscarMetaPorId = async (id) => {
  try {
    const sql = `
      SELECT m.*, c.nome as categoria_nome
      FROM metas m
      LEFT JOIN categorias c ON m.categoria_id = c.id
      WHERE m.id = ?
    `;
    const metas = await query(sql, [id]);
    return metas[0] || null;
  } catch (err) {
    console.error('Erro ao buscar meta por ID: ', err);
    throw err;
  }
};

const buscarMetasPorUsuario = async (usuarioId, filtros = {}) => {
  try {
    let condicao = `m.usuario_id = ${usuarioId}`;
    const parametros = [usuarioId];
    
    if (filtros.prazoMinimo) {
      condicao += ` AND m.prazo >= ?`;
      parametros.push(filtros.prazoMinimo);
    }
    
    if (filtros.categoria_id) {
      condicao += ` AND m.categoria_id = ?`;
      parametros.push(filtros.categoria_id);
    }
    
    const sql = `
      SELECT m.*, c.nome as categoria_nome
      FROM metas m
      LEFT JOIN categorias c ON m.categoria_id = c.id
      WHERE ${condicao}
      ORDER BY m.prazo ASC
    `;
    
    return await query(sql, parametros);
  } catch (err) {
    console.error('Erro ao buscar metas do usuário: ', err);
    throw err;
  }
};

const buscarMetasPorCategoria = async (usuarioId, categoriaId) => {
  try {
    const sql = `
      SELECT m.*, c.nome as categoria_nome
      FROM metas m
      JOIN categorias c ON m.categoria_id = c.id
      WHERE m.usuario_id = ? AND m.categoria_id = ?
      ORDER BY m.prazo ASC
    `;
    return await query(sql, [usuarioId, categoriaId]);
  } catch (err) {
    console.error('Erro ao buscar metas por categoria: ', err);
    throw err;
  }
};

const atualizarMeta = async (id, dadosAtualizados) => {
  try {
    return await update('metas', dadosAtualizados, `id = ${id}`);
  } catch (err) {
    console.error('Erro ao atualizar meta: ', err);
    throw err;
  }
};

const excluirMeta = async (id) => {
  try {
    return await deleteRecord('metas', `id = ${id}`);
  } catch (err) {
    console.error('Erro ao excluir meta: ', err);
    throw err;
  }
};

export { 
  criarMeta, 
  listarMetasPorUsuario, 
  buscarMetaPorId, 
  buscarMetasPorUsuario, 
  buscarMetasPorCategoria,
  atualizarMeta, 
  excluirMeta
}; 