import mysql from "mysql2/promise";
import bcrypt from 'bcryptjs';

//importação do banco de dados
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'saldo_verde',
    waitForConnections: true,
    connectionLimit: 10, 
    queueLimit: 0
});

async function getConnection(){
    return pool.getConnection();
}

//Função genérica para ler todos os registros de uma tabela
async function readAll(table, where = null) {
    const connection = await getConnection();
    try {
        let sql = `SELECT * FROM ${table}`;
        if (where) {
            sql += ` WHERE ${where}`;
        }
        const [rows] = await connection.execute(sql);
        return rows;
    } catch (err) {
        console.error('Erro ao ler registros: ', err);
        throw err;
    } finally {
        connection.release();
    }
}

// Função para ler um registro específico
async function read(table, where) {
    const connection = await getConnection();
    try {
        let sql = `SELECT * FROM ${table} WHERE ${where}`;
        const [rows] = await connection.execute(sql);
        return rows[0] || null;
    } catch (err) {
        console.error('Erro ao ler registro: ', err);
        throw err;
    } finally {
        connection.release();
    }
}

// Função para inserir dados em qualquer tabela
async function create(table, data) {
    const connection = await getConnection();
    try {
        const columns = Object.keys(data).join(', ');
        const placeholders = Array(Object.keys(data).length).fill('?').join(', ');
        const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
        const values = Object.values(data);
        const [result] = await connection.execute(sql, values);
        return result.insertId;
    } catch (err) {
        console.error('Erro ao inserir registro: ', err);
        throw err;
    } finally {
        connection.release();
    }
}

// Função para atualizar dados
async function update(table, data, where) {
    const connection = await getConnection();
    try {
        const set = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = Object.values(data);
        const sql = `UPDATE ${table} SET ${set} WHERE ${where}`;
        const [result] = await connection.execute(sql, values);
        return result.affectedRows;
    } catch (err) {
        console.error('Erro ao atualizar registro: ', err);
        throw err;
    } finally {
        connection.release();
    }
}

// Função para excluir um registro
async function deleteRecord(table, where) {
    const connection = await getConnection();
    try {
        const sql = `DELETE FROM ${table} WHERE ${where}`;
        const [result] = await connection.execute(sql);
        return result.affectedRows;
    } catch (err) {
        console.error('Erro ao excluir registro: ', err);
        throw err;
    } finally {
        connection.release();
    }
}

// Função para comparar senhas com hash
async function compare(senha, hash) {
    try {
        return await bcrypt.compare(senha, hash);
    } catch (err) {
        console.error('Erro ao comparar senha: ', err);
        return false;
    }
}

// Função para registrar log de atividade
async function logActivity(userId, acao, descricao) {
    try {
        // Preparar dados para o log
        const logData = {
            usuario_id: userId,
            acao,
            descricao,
            criado_em: new Date()
        };
        
        // Inserir registro de log
        return await create('logs', logData);
    } catch (err) {
        console.error('Erro ao registrar log de atividade: ', err);
        // Não lança exceção para não interromper o fluxo principal
    }
}

// Função para executar consultas SQL personalizadas
async function query(sql, params = []) {
    const connection = await getConnection();
    try {
        const [rows] = await connection.execute(sql, params);
        return rows;
    } catch (err) {
        console.error('Erro ao executar consulta: ', err);
        throw err;
    } finally {
        connection.release();
    }
}

// Exportações
export { create, readAll, read, update, deleteRecord, compare, logActivity, query };