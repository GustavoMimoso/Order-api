// src/app.js
const express = require('express');
require('dotenv').config();

// Importa as rotas
const OrderRoutes = require('./routes/orderRoutes');

// Cria a aplicação Express
const app = express();

// ===== MIDDLEWARES =====
// Middleware para aceitar JSON no corpo das requisições
app.use(express.json());

// Middleware para logs de requisições
app.use((req, res, next) => {
    console.log(`\n📤 ${req.method} ${req.path}`);
    next();
});

// ===== ROTAS =====

// Rota raiz (para verificar se a API está funcionando)
app.get('/', (req, res) => {
    res.json({
        message: '✅ Order API está funcionando!',
        version: '1.0.0',
        endpoints: {
            criarPedido: 'POST /order',
            buscarPedido: 'GET /order/:orderId',
            listarPedidos: 'GET /order/list',
            atualizarPedido: 'PUT /order/:orderId',
            deletarPedido: 'DELETE /order/:orderId'
        }
    });
});

// Usa as rotas de pedidos
app.use('/', OrderRoutes);

// ===== TRATAMENTO DE ERROS =====
// Rota 404 (não encontrada)
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Rota não encontrada'
    });
});

// Middleware de erro global
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
║  📚 Documentação: http://localhost:${PORT} ║
╚══════════════════════════════════════════╝
    `);
});

module.exports = app;
