// source/database/connection.js

const mysql = require('mysql2');
require('dotenv').config();

// Cria o pool de conexões
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log("✅ Pool de conexões com o banco de dados criado.");

// Exporta a versão do pool que suporta Promises (async/await)
module.exports = pool.promise();