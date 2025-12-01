// src/routes/authRoutes.js
const express = require('express');
const AuthController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * Rotas de autenticação (SEM proteção)
 */

// POST - Registrar novo usuário
// Exemplo: POST http://localhost:3000/auth/register
router.post('/auth/register', AuthController.register);

// POST - Fazer login
// Exemplo: POST http://localhost:3000/auth/login
router.post('/auth/login', AuthController.login);

/**
 * Rotas protegidas (REQUEREM token)
 */

// GET - Obter perfil do usuário autenticado
// Exemplo: GET http://localhost:3000/auth/me (com Authorization header)
router.get('/auth/me', authMiddleware, AuthController.getProfile);

module.exports = router;
