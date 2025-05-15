import {  update, create } from "../config/database.js";

const criarTransacao = async (dados) => {
   try{
    return await create('transacoes', dados);
   } catch(err){
    console.error('Erro ao criar uma transação: ', err)
    throw err;
   }
};

const atualizarTransacao = async (id, dados) => {
    try{
        return await update('transacoes', dados, `id = ${id}`);
    } catch(err){
        console.error('Erro ao atualizar uma transação: ', err)
        throw err;
    }
};

export {
    criarTransacao,
    atualizarTransacao
};