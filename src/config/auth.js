// src/config/auth.js
const bcrypt = require('bcryptjs');
const { generateToken, verifyToken } = require('./jwt');

/**
 * Criptografa uma senha
 * @param {String} password - Senha em texto plano
 * @returns {String} Senha criptografada
 */
async function hashPassword(password) {
    console.log('🔐 Criptografando senha...');
    const hashedPassword = await bcrypt.hash(password, 10); // 10 rodadas
    console.log('✅ Senha criptografada');
    return hashedPassword;
}

/**
 * Compara senha em texto plano com hash armazenado
 * @param {String} password - Senha em texto plano
 * @param {String} hashedPassword - Hash armazenado
 * @returns {Boolean} true se senhas combinam
 */
async function comparePassword(password, hashedPassword) {
    console.log('🔍 Comparando senhas...');
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
}

/**
 * Cria um token de autenticação
 * @param {Object} user - Dados do usuário { id, email, name }
 * @returns {String} Token JWT
 */
function createAuthToken(user) {
    return generateToken({
        userId: user.id,
        email: user.email,
        name: user.name
    });
}

/**
 * Valida um token de autenticação
 * @param {String} token - Token JWT
 * @returns {Object} Dados decodificados
 */
function validateAuthToken(token) {
    return verifyToken(token);
}

module.exports = {
    hashPassword,
    comparePassword,
    createAuthToken,
    validateAuthToken
};
