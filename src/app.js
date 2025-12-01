// src/app.js
const express = require('express');
require('dotenv').config();

// Importa as rotas
const OrderRoutes = require('./routes/orderRoutes');
const AuthRoutes = require('./routes/authRoutes');

// Cria a aplicação Express
const app = express();

// ===== MIDDLEWARES =====
app.use(express.json());

app.use((req, res, next) => {
    console.log(`\n📤 ${req.method} ${req.path}`);
    next();
});

// ===== ROTAS =====

// Rota raiz
app.get('/', (req, res) => {
    res.json({
        message: '✅ Order API com JWT está funcionando!',
        version: '1.0.0',
        autenticacao: {
            registrar: 'POST /auth/register',
            login: 'POST /auth/login',
            perfil: 'GET /auth/me (com token)'
        },
        pedidos: {
            criarPedido: 'POST /order (requer autenticação)',
            buscarPedido: 'GET /order/:orderId (requer autenticação)',
            listarPedidos: 'GET /order/list (requer autenticação)',
            atualizarPedido: 'PUT /order/:orderId (requer autenticação)',
            deletarPedido: 'DELETE /order/:orderId (requer autenticação)'
        }
    });
});

// Usa as rotas de autenticação
app.use('/', AuthRoutes);

// Usa as rotas de pedidos
app.use('/', OrderRoutes);

// ===== TRATAMENTO DE ERROS =====
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Rota não encontrada'
    });
});

app.use((err, req, res, next) => {
    console.error('❌ Erro não tratado:', err);
    res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Erro desconhecido'
    });
});

// ===== INICIAR SERVIDOR =====
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════╗
║  🚀 Servidor iniciado com sucesso!      ║
║  📍 http://localhost:${PORT}              ║
║  🔐 Com autenticação JWT ativada!       ║
║  📚 Documentação: http://localhost:${PORT} ║
╚══════════════════════════════════════════╝
    `);
});

module.exports = app;
