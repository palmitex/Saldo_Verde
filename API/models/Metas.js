import { create, read, readAll, update, deleteRecord, query } from '../config/database.js';

const criarMeta = async (metaDados) => {
  try {
    console.log('Dados recebidos no modelo para criar meta:', metaDados);

    // Validar dados obrigatórios
    if (!metaDados.usuario_id || !metaDados.nome || !metaDados.valor_objetivo || !metaDados.valor_inicial || !metaDados.prazo) {
      throw new Error('Dados obrigatórios não fornecidos');
    }

    // Validar tipos de dados
    if (typeof metaDados.nome !== 'string' || metaDados.nome.trim() === '') {
      throw new Error('Nome inválido');
    }

    if (isNaN(metaDados.valor_objetivo) || metaDados.valor_objetivo <= 0) {
      throw new Error('Valor objetivo inválido');
    }

    if (isNaN(metaDados.valor_inicial) || metaDados.valor_inicial < 0) {
      throw new Error('Valor inicial inválido');
    }

    if (isNaN(new Date(metaDados.prazo).getTime())) {
      throw new Error('Data de prazo inválida');
    }

    const dadosCompletos = {
      usuario_id: metaDados.usuario_id,
      nome: metaDados.nome.trim(),
      valor_objetivo: metaDados.valor_objetivo,
      valor_inicial: metaDados.valor_inicial,
      prazo: metaDados.prazo,
      criado_em: metaDados.criado_em
    };

    console.log('Dados completos para inserção:', dadosCompletos);

    const result = await create('metas', dadosCompletos);
    console.log('Resultado da criação:', result);
    return result;
  } catch (err) {
    console.error('Erro detalhado ao criar meta: ', err);
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
    console.log('Buscando meta por ID:', id);
    const sql = `
      SELECT * FROM metas 
      WHERE id = ? 
      LIMIT 1
    `;
    
    const resultado = await query(sql, [id]);
    console.log('Resultado da busca:', resultado);
    
    // Retorna o primeiro objeto ou null se não encontrar
    return resultado[0] || null;
  } catch (error) {
    console.error('Erro ao buscar meta por ID:', error);
    throw error;
  }
};

const buscarMetasPorUsuario = async (userId) => {
  try {
    console.log('Buscando metas para usuário:', userId);
    
    const sql = `
      SELECT * FROM metas 
      WHERE usuario_id = ? 
      ORDER BY criado_em DESC
    `;
    
    const metas = await query(sql, [userId]);
    console.log('Metas encontradas no banco:', metas);
    
    return metas;
  } catch (error) {
    console.error('Erro ao buscar metas por usuário:', error);
    throw error;
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