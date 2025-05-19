import { query } from '../config/database.js';

class Categorias {
  static async criarCategoria(categoria) {
    try {
      console.log('Dados recebidos para criar categoria:', categoria);
      const sql = 'INSERT INTO categorias (usuario_id, nome) VALUES (?, ?)';
      const [result] = await query(sql, [categoria.usuario_id, categoria.nome]);
      console.log('Resultado da criação:', result);
      return result.insertId;
    } catch (error) {
      console.error('Erro detalhado ao criar categoria:', error);
      throw error;
    }
  }

  static async listarCategoriasPorUsuario(usuarioId) {
    try {
      const sql = 'SELECT * FROM categorias WHERE usuario_id = ?';
      const [rows] = await query(sql, [usuarioId]);
      return rows;
    } catch (error) {
      console.error('Erro ao listar categorias:', error);
      throw error;
    }
  }

  static async buscarCategoriaPorId(id) {
    try {
      const sql = 'SELECT * FROM categorias WHERE id = ?';
      const [rows] = await query(sql, [id]);
      return rows[0];
    } catch (error) {
      console.error('Erro ao buscar categoria:', error);
      throw error;
    }
}

  static async atualizarCategoria(id, categoria) {
    try {
      const sql = 'UPDATE categorias SET nome = ? WHERE id = ?';
      await query(sql, [categoria.nome, id]);
      return true;
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      throw error;
    }
}

  static async excluirCategoria(id) {
    try {
      const sql = 'DELETE FROM categorias WHERE id = ?';
      await query(sql, [id]);
      return true;
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      throw error;
    }
    }
}

export default Categorias;