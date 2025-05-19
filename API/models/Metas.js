import { create, read, readAll, update, deleteRecord, query } from '../config/database.js';

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

const listarMetas = async () => {
  try {
    return await readAll('metas');
  } catch (err) {
    console.error('Erro ao listar todas as metas: ', err);
    throw err;
  }
};

const buscarMetaPorId = async (id) => {
  try {
    return await read('metas', `id = ${id}`);
  } catch (err) {
    console.error('Erro ao buscar meta por ID: ', err);
    throw err;
  }
};

const buscarMetasPorUsuario = async (usuarioId) => {
  try {
    return await read('metas', `usuario_id = ${usuarioId}`);
  } catch (err) {
    console.error('Erro ao buscar metas do usuário: ', err);
    throw err;
  }
};

const buscarMetasPorCategoria = async (categoriaId) => {
  try {
    return await read('metas', `categoria_id = ${categoriaId}`);
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
  listarMetas,
  buscarMetaPorId, 
  buscarMetasPorUsuario, 
  buscarMetasPorCategoria,
  atualizarMeta, 
  excluirMeta
}; 