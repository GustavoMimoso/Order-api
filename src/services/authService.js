// src/services/authService.js
const UserModel = require('../models/userModel');
const { hashPassword, comparePassword, createAuthToken } = require('../config/auth');

class AuthService {
    /**
     * Registra um novo usuário
     * @param {Object} data - { email, name, password }
     * @returns {Object} { user, token }
     */
    static async register(data) {
        console.log('📝 Registrando novo usuário...');
        
        // Valida dados obrigatórios
        if (!data.email || !data.name || !data.password) {
            throw new Error('Email, nome e senha são obrigatórios');
        }
        
        // Valida email
        if (!this.isValidEmail(data.email)) {
            throw new Error('Email inválido');
        }
        
        // Valida força da senha
        if (data.password.length < 6) {
            throw new Error('Senha deve ter no mínimo 6 caracteres');
        }
        
        // Verifica se email já existe
        const emailExists = await UserModel.emailExists(data.email);
        if (emailExists) {
            throw new Error('Email já cadastrado');
        }
        
        // Criptografa a senha
        const hashedPassword = await hashPassword(data.password);
        
        // Cria o usuário no banco
        const user = await UserModel.createUser({
            email: data.email,
            name: data.name,
            password: hashedPassword
        });
        
        // Gera token de autenticação
        const token = createAuthToken(user);
        
        console.log(`✅ Usuário registrado: ${user.email}`);
        
        return {
            success: true,
            user,
            token
        };
    }

    /**
     * Faz login de um usuário
     * @param {Object} data - { email, password }
     * @returns {Object} { user, token }
     */
    static async login(data) {
        console.log('🔓 Processando login...');
        
        // Valida dados obrigatórios
        if (!data.email || !data.password) {
            throw new Error('Email e senha são obrigatórios');
        }
        
        // Busca o usuário no banco
        const user = await UserModel.getUserByEmail(data.email);
        
        // Se não encontrou
        if (!user) {
            throw new Error('Email ou senha incorretos');
        }
        
        // Compara as senhas
        const passwordMatch = await comparePassword(data.password, user.password);
        
        if (!passwordMatch) {
            throw new Error('Email ou senha incorretos');
        }
        
        // Gera token de autenticação
        const token = createAuthToken(user);
        
        console.log(`✅ Login realizado: ${user.email}`);
        
        // Remove a senha do objeto que retorna
        delete user.password;
        
        return {
            success: true,
            user,
            token
        };
    }

    /**
     * Valida formato de email simples
     * @param {String} email - Email a validar
     * @returns {Boolean} true se válido
     */
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

module.exports = AuthService;
