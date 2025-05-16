import { readAll, read  } from "../config/database.js";

const verHistorico = async () => {
    try{
        return await readAll('relatorios');
    } catch(err){
        console.error('Erro ao mostrar historico: ', err)
        throw err;
    }
};

const verHistoricoEspecifico = async (resumo) => {
    try{
        return await read('relatorios',`resumo = ${resumo}` )
    } catch(err){
        console.error('Erro ao obter historico especifico: ', err)
        throw err;
    }
};

export {verHistorico, verHistoricoEspecifico}