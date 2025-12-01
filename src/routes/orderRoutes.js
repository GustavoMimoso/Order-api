// src/routes/orderRoutes.js
const express = require('express');
const OrderController = require('../controllers/orderController');

const router = express.Router();

/**
 * IMPORTANTE: Rotas mais específicas PRIMEIRO!
 * /order/list deve vir ANTES de /order/:orderId
 */

// ✅ Esta DEVE vir ANTES da com parâmetro
router.get('/order/list', OrderController.getAllOrders);

// Depois as genéricas
router.post('/order', OrderController.createOrder);
router.get('/order/:orderId', OrderController.getOrderById);
router.put('/order/:orderId', OrderController.updateOrder);
router.delete('/order/:orderId', OrderController.deleteOrder);

module.exports = router;
