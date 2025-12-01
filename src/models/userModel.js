// src/models/userModel.js
const pool = require('../config/database');

class UserModel {
    /**
     * Cria um novo usuário
     * @param {Object} userData - { email, name, password (criptografada) }
     * @returns {Object} Usuário criado
     */
    static async createUser(userData) {
        const query = `
            INSERT INTO "User" (email, name, password)
            VALUES ($1, $2, $3)
            RETURNING id, email, name, "createdAt"
        `;
        
        const result = await pool.query(query, [
            userData.email,
            userData.name,
            userData.password
        ]);
        
        console.log(`✅ Usuário ${userData.email} criado`);
        return result.rows[0];
    }

    /**
     * Busca um usuário pelo email
     * @param {String} email - Email do usuário
     * @returns {Object} Usuário com senha (para comparação)
     */
    static async getUserByEmail(email) {
        const query = `
            SELECT id, email, name, password, "createdAt"
            FROM "User"
            WHERE email = $1
        `;
        
        const result = await pool.query(query, [email]);
        return result.rows[0];
    }

    /**
     * Busca um usuário pelo ID
     * @param {Number} id - ID do usuário
     * @returns {Object} Usuário sem a senha
     */
    static async getUserById(id) {
        const query = `
            SELECT id, email, name, "createdAt"
            FROM "User"
            WHERE id = $1
        `;
        
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    /**
     * Valida se um email já existe
     * @param {String} email - Email a validar
     * @returns {Boolean} true se existe, false se não
     */
    static async emailExists(email) {
        const query = `
            SELECT id FROM "User" WHERE email = $1
        `;
        
        const result = await pool.query(query, [email]);
        return result.rows.length > 0;
    }
}

module.exports = UserModel;
