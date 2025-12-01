// src/routes/orderRoutes.js
const express = require('express');
const OrderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * Todas as rotas de pedidos agora requerem autenticação
 * Adicione o token no header: Authorization: Bearer seu_token_aqui
 */

// POST - Criar novo pedido (PROTEGIDO)
router.post('/order', authMiddleware, OrderController.createOrder);

// GET - Buscar pedido por ID (PROTEGIDO)
router.get('/order/:orderId', authMiddleware, OrderController.getOrderById);

// GET - Listar todos os pedidos (PROTEGIDO)
router.get('/order/list', authMiddleware, OrderController.getAllOrders);

// PUT - Atualizar pedido (PROTEGIDO)
router.put('/order/:orderId', authMiddleware, OrderController.updateOrder);

// DELETE - Deletar pedido (PROTEGIDO)
router.delete('/order/:orderId', authMiddleware, OrderController.deleteOrder);

module.exports = router;
