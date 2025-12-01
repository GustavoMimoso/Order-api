// src/config/database.js
const { Pool } = require('pg');
require('dotenv').config();

console.log('Conectando ao banco de dados...');
console.log(`Host: ${process.env.DB_HOST}`);
console.log(`Banco: ${process.env.DB_NAME}`);

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

// Testa a conexão
pool.on('error', (err) => {
    console.error('Erro inesperado no pool:', err);
});

module.exports = pool;
