// src/middlewares/authMiddleware.js
const { validateAuthToken } = require('../config/auth');

/**
 * Middleware que verifica se o token JWT é válido
 * Se válido, adiciona os dados do usuário em req.user
 * Se inválido, retorna erro 401
 */
function authMiddleware(req, res, next) {
    try {
        console.log('🔐 Verificando autenticação...');
        
        // Pega o header Authorization
        const authHeader = req.headers.authorization;
        
        // Verifica se existe
        if (!authHeader) {
            console.error('❌ Header Authorization não fornecido');
            return res.status(401).json({
                success: false,
                message: 'Token não fornecido',
                error: 'Adicione o header: Authorization: Bearer seuTokenAqui'
            });
        }
        
        // Extrai o token do formato "Bearer eyJ..."
        const parts = authHeader.split(' ');
        
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            console.error('❌ Formato de token inválido');
            return res.status(401).json({
                success: false,
                message: 'Formato de token inválido',
                error: 'Use o formato: Authorization: Bearer seuTokenAqui'
            });
        }
        
        const token = parts[1];
        
        // Valida o token
        const decoded = validateAuthToken(token);
        
        // Adiciona os dados do usuário à requisição
        req.user = decoded;
        
        console.log(`✅ Autenticado como: ${decoded.email}`);
        next();
        
    } catch (error) {
        console.error('❌ Erro de autenticação:', error.message);
        res.status(401).json({
            success: false,
            message: 'Autenticação falhou',
            error: error.message
        });
    }
}

module.exports = authMiddleware;
