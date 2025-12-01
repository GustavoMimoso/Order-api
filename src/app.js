// src/app.js
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
require('dotenv').config();

// Importa as rotas
const OrderRoutes = require('./routes/orderRoutes');

// Cria a aplicação Express
const app = express();

// ===== MIDDLEWARES =====
app.use(express.json());

app.use((req, res, next) => {
    console.log(`\n📤 ${req.method} ${req.path}`);
    next();
});

// ===== SWAGGER =====
// Serve a UI do Swagger em /docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rota para ver o JSON do Swagger
app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// ===== ROTAS =====

// Rota raiz
app.get('/', (req, res) => {
    res.json({
        message: '✅ Order API está funcionando!',
        version: '1.0.0',
        documentacao: 'http://localhost:3000/docs',
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
║  📚 Swagger: http://localhost:${PORT}/docs ║
╚══════════════════════════════════════════╝
    `);
});

module.exports = app;
