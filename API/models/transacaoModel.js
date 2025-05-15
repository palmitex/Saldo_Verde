import { read, readAll, update, deleteRecord, create } from "../config/database.js";

const listarTransacoes = async () => {
    try{
        return await readAll('transacoes');
    } catch(err){
        console.error('Erro ao listar transações: ', )
        throw err;
    }
};

const listarTransacoesPorUsuario = async (usuarioId) => {
    return await readAll('transacoes', `usuario_id = ${usuarioId}`);
};

const obterTransacaoPorId = async (id) => {
    return await read('transacoes', `id = ${id}`);
};

const criarTransacao = async (dados) => {
    return await create('transacoes', dados);
};

const atualizarTransacao = async (id, dados) => {
    return await update('transacoes', dados, `id = ${id}`);
};

const excluirTransacao = async (id) => {
    return await deleteRecord('transacoes', `id = ${id}`);
};

export {
    listarTransacoes,
    listarTransacoesPorUsuario,
    obterTransacaoPorId,
    criarTransacao,
    atualizarTransacao,
    excluirTransacao
};