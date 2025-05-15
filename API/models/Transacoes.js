import {  update, create } from "../config/database.js";

const criarTransacao = async (dados) => {
    return await create('transacoes', dados);
};

const atualizarTransacao = async (id, dados) => {
    return await update('transacoes', dados, `id = ${id}`);
};

export {
    criarTransacao,
    atualizarTransacao
};