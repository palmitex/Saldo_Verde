import pg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    ssl: {
        rejectUnauthorized: false
    }
});

async function readAll(table, where = null) {
    const client = await pool.connect();
    try {
        let sql = `SELECT * FROM ${table}`;
        if (where) {
            sql += ` WHERE ${where}`;
        }
        const result = await client.query(sql);
        return result.rows;
    } catch (err) {
        console.error('Erro ao ler registros: ', err);
        throw err;
    } finally {
        client.release();
    }
}

async function read(table, where, params = []) {
    const client = await pool.connect();
    try {
        const sql = `SELECT * FROM ${table} WHERE ${where}`;
        const result = await client.query(sql, params);
        return result.rows[0] || null;
    } catch (err) {
        console.error('Erro ao ler registro: ', err);
        throw err;
    } finally {
        client.release();
    }
}

async function create(table, data) {
    const client = await pool.connect();
    try {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const placeholders = keys.map((_, idx) => `$${idx + 1}`).join(', ');
        const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING id`;
        const result = await client.query(sql, values);
        return result.rows[0].id;
    } catch (err) {
        console.error('Erro ao inserir registro: ', err);
        throw err;
    } finally {
        client.release();
    }
}

async function update(table, data, where, whereParams = []) {
    const client = await pool.connect();
    try {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const setClause = keys.map((key, idx) => `${key} = $${idx + 1}`).join(', ');
        const sql = `UPDATE ${table} SET ${setClause} WHERE ${where}`;
        const result = await client.query(sql, [...values, ...whereParams]);
        return result.rowCount;
    } catch (err) {
        console.error('Erro ao atualizar registro: ', err);
        throw err;
    } finally {
        client.release();
    }
}

async function deleteRecord(table, where) {
    const client = await pool.connect();
    try {
        const sql = `DELETE FROM ${table} WHERE ${where}`;
        const result = await client.query(sql);
        return result.rowCount;
    } catch (err) {
        console.error('Erro ao excluir registro: ', err);
        throw err;
    } finally {
        client.release();
    }
}

async function compare(senha, hash) {
    try {
        return await bcrypt.compare(senha, hash);
    } catch (err) {
        console.error('Erro ao comparar senha: ', err);
        return false;
    }
}

async function logActivity(userId, acao, descricao) {
    try {
        const logData = {
            usuario_id: userId ?? null,
            acao: acao ?? null,
            descricao: descricao ?? null,
            criado_em: new Date()
        };
        return await create('logs', logData);
    } catch (err) {
        console.error('Erro ao registrar log de atividade: ', err);
    }
}

async function query(sql, params = []) {
    const client = await pool.connect();
    try {
        const result = await client.query(sql, params);
        return result.rows;
    } catch (err) {
        console.error('Erro ao executar consulta: ', err);
        throw err;
    } finally {
        client.release();
    }
}

export { create, readAll, read, update, deleteRecord, compare, logActivity, query };