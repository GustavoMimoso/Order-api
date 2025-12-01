// src/config/jwt.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Chave secreta para assinar tokens (você vai adicionar ao .env)
const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_super_secreta_aqui';

/**
 * Gera um token JWT válido por 24 horas
 * @param {Object} payload - Dados a codificar no token (ex: { id, email })
 * @returns {String} Token JWT
 */
function generateToken(payload) {
    console.log('🔑 Gerando novo token JWT...');
    
    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: '24h' // Token válido por 24 horas
    });
    
    console.log('✅ Token gerado com sucesso');
    return token;
}

/**
 * Valida um token JWT
 * @param {String} token - Token a validar
 * @returns {Object} Dados decodificados do token
 * @throws {Error} Se token inválido ou expirado
 */
function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('✅ Token válido');
        return decoded;
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            console.error('❌ Token expirado');
            throw new Error('Token expirado. Faça login novamente.');
        } else if (error.name === 'JsonWebTokenError') {
            console.error('❌ Token inválido');
            throw new Error('Token inválido.');
        }
        throw error;
    }
}

module.exports = {
    generateToken,
    verifyToken,
    JWT_SECRET
};
