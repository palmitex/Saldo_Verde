import { create, read, readAll, update, deleteRecord } from "../config/database.js";

const criarCategoria = async (dadosCategoria) => {
  try {
    return await create('categorias', dadosCategoria);
  } catch (err) {
    console.error('Erro ao criar categoria: ', err);
    throw err;
  }
};

const buscarCategoriaPorId = async (id) => {
  try {
    return await read('categorias', `id = ${id}`);
  } catch (err) {
    console.error('Erro ao buscar categoria por ID: ', err);
    throw err;
  }
};

const listarCategoriasPorUsuario = async (usuarioId) => {
  try {
    return await readAll('categorias', `usuario_id = ${usuarioId}`);
  } catch (err) {
    console.error('Erro ao listar categorias do usuário: ', err);
    throw err;
  }
};

const atualizarCategoria = async (id, dadosAtualizados) => {
  try {
    return await update('categorias', dadosAtualizados, `id = ${id}`);
  } catch (err) {
    console.error('Erro ao atualizar categoria: ', err);
    throw err;
  }
};

const excluirCategoria = async (id) => {
  try {
    return await deleteRecord('categorias', `id = ${id}`);
  } catch (err) {
    console.error('Erro ao excluir categoria: ', err);
    throw err;
  }
};

export { 
  criarCategoria, 
  buscarCategoriaPorId, 
  listarCategoriasPorUsuario, 
  atualizarCategoria, 
  excluirCategoria
};