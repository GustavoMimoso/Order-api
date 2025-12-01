// src/controllers/authController.js
const AuthService = require('../services/authService');

class AuthController {
    /**
     * POST /auth/register
     * Registra um novo usuário
     */
    static async register(req, res) {
        try {
            console.log('=== REGISTER ===');
            console.log('Dados recebidos:', { email: req.body.email, name: req.body.name });
            
            const result = await AuthService.register({
                email: req.body.email,
                name: req.body.name,
                password: req.body.password
            });
            
            res.status(201).json(result);
            
        } catch (error) {
            console.error('❌ Erro no registro:', error.message);
            res.status(400).json({
                success: false,
                message: 'Erro ao registrar usuário',
                error: error.message
            });
        }
    }

    /**
     * POST /auth/login
     * Faz login de um usuário
     */
    static async login(req, res) {
        try {
            console.log('=== LOGIN ===');
            console.log('Email:', req.body.email);
            
            const result = await AuthService.login({
                email: req.body.email,
                password: req.body.password
            });
            
            res.status(200).json(result);
            
        } catch (error) {
            console.error('❌ Erro no login:', error.message);
            res.status(401).json({
                success: false,
                message: 'Erro ao fazer login',
                error: error.message
            });
        }
    }

    /**
     * GET /auth/me
     * Retorna dados do usuário autenticado
     * Usa o middleware authMiddleware que adiciona req.user
     */
    static async getProfile(req, res) {
        try {
            console.log('=== GET PROFILE ===');
            console.log('Usuário:', req.user.email);
            
            res.status(200).json({
                success: true,
                user: req.user,
                message: 'Dados do usuário autenticado'
            });
            
        } catch (error) {
            console.error('❌ Erro ao buscar perfil:', error.message);
            res.status(500).json({
                success: false,
                message: 'Erro ao buscar perfil',
                error: error.message
            });
        }
    }
}

module.exports = AuthController;
