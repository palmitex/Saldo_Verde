import mysql from "mysql2/promise";
import bcrypt from 'bcryptjs';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'saldo_verde',
    waitForConnections: true, 
})