import { readAll, read, update, deleteRecord, create } from "../config/database.js";

const verCategorias = async () => {
    try{
        return await readAll('categorias');
    } catch(err){
        console.error('Erro ao listar categoria: ', err)
        throw err;
    }
};

const verCategoriaEspecifica = async (nome) => {
    try{
        return await read('categorias',`nome = ${nome}` )
    } catch(err){
        console.error('Erro ao obter categoria especifica: ', err)
        throw err;
    }
};

const criarCategoria = async (metaData) =>{
    try{
        return await create('categorias', metaData);
    } catch(err){
        console.error('Erro ao criar categoria ')
    }
}

const atualizarCategoria = async(nome, nomeData) =>{
    try{
        await update('categorias', nomeData, `nome = ${nome}`)
    } catch(err){
        console.error('Erro ao atualizar uma categoria', err)
        throw err;
    }
}
const excluirCategoria = async (nome) =>{
    try{
        await deleteRecord('categorias', `nome = ${nome}`);
    } catch (err){
        console.error('Erro ao excluir uma categoria: ', err);
        throw err;
    }
}

export { excluirCategoria, atualizarCategoria, criarCategoria, verCategoriaEspecifica, verCategorias}