import { read, create, update, deleteRecord } from '../config/database.js';

const criarUsuario = async (dadosUsuario) => {
  try {
    return await create('usuarios', dadosUsuario);
  } catch (err) {
    console.error('Erro ao criar usuário: ', err);
    throw err;
  }
};

const buscarUsuarioPorEmail = async (email) => {
  try {
    return await read('usuarios', `email = '${email}'`);
  } catch (err) {
    console.error('Erro ao buscar usuário por email: ', err);
    throw err;
  }
};

const buscarUsuarioPorCPF = async (cpf) => {
  try {
    return await read('usuarios', `cpf = '${cpf}'`);
  } catch (err) {
    console.error('Erro ao buscar usuário por CPF: ', err);
    throw err;
  }
};

const buscarUsuarioPorId = async (id) => {
  try {
    return await read('usuarios', `id = ${id}`);
  } catch (err) {
    console.error('Erro ao buscar usuário por ID: ', err);
    throw err;
  }
};

const atualizarUsuario = async (id, dadosAtualizados) => {
  try {
    return await update('usuarios', dadosAtualizados, `id = ${id}`);
  } catch (err) {
    console.error('Erro ao atualizar usuário: ', err);
    throw err;
  }
};

const excluirUsuario = async (id) => {
  try {
    return await deleteRecord('usuarios', `id = ${id}`);
  } catch (err) {
    console.error('Erro ao excluir usuário: ', err);
    throw err;
  }
};

export { criarUsuario, buscarUsuarioPorEmail, buscarUsuarioPorCPF, buscarUsuarioPorId, atualizarUsuario, excluirUsuario}; 