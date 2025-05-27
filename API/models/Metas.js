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
      categoria_id: metaDados.categoria_id || null,
      criado_em: new Date()
    };

    console.log('Dados completos para inserção:', dadosCompletos);

    // Usar query direta em vez da função create
    const keys = Object.keys(dadosCompletos);
    const values = Object.values(dadosCompletos);
    const placeholders = keys.map((_, idx) => `$${idx + 1}`).join(', ');
    
    const sql = `
      INSERT INTO metas (${keys.join(', ')})
      VALUES (${placeholders})
      RETURNING id, nome, valor_objetivo, valor_inicial, prazo, categoria_id, criado_em
    `;

    const result = await query(sql, values);
    console.log('Resultado da criação:', result);
    return result[0];
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
      SELECT m.*, c.nome as categoria_nome 
      FROM metas m
      LEFT JOIN categorias c ON m.categoria_id = c.id
      WHERE m.id = $1
      ORDER BY m.id
      FETCH FIRST 1 ROW ONLY
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
      SELECT m.*, c.nome as categoria_nome 
      FROM metas m
      LEFT JOIN categorias c ON m.categoria_id = c.id
      WHERE m.usuario_id = $1 
      ORDER BY m.criado_em DESC
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
    const sql = `
      SELECT m.*, c.nome as categoria_nome 
      FROM metas m
      LEFT JOIN categorias c ON m.categoria_id = c.id
      WHERE m.categoria_id = $1
      ORDER BY m.criado_em DESC
    `;
    return await query(sql, [categoriaId]);
  } catch (err) {
    console.error('Erro ao buscar metas por categoria: ', err);
    throw err;
  }
};

const atualizarMeta = async (id, dadosAtualizados) => {
  try {
    const keys = Object.keys(dadosAtualizados);
    const values = Object.values(dadosAtualizados);
    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
    
    const sql = `
      UPDATE metas 
      SET ${setClause} 
      WHERE id = $${keys.length + 1}
      RETURNING *
    `;
    
    const result = await query(sql, [...values, id]);
    return result[0];
  } catch (err) {
    console.error('Erro ao atualizar meta: ', err);
    throw err;
  }
};

const excluirMeta = async (id) => {
  try {
    // Primeiro, atualizar as transações relacionadas
    await query('UPDATE transacoes SET meta_id = NULL WHERE meta_id = $1', [id]);
    
    // Depois, excluir a meta
    const sql = 'DELETE FROM metas WHERE id = $1 RETURNING *';
    const result = await query(sql, [id]);
    return result[0];
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