// src/routes/orderRoutes.js
const express = require('express');
const OrderController = require('../controllers/orderController');

const router = express.Router();

/**
 * @swagger
 * /order/list:
 *   get:
 *     tags:
 *       - Pedidos
 *     summary: Listar todos os pedidos
 *     description: Retorna uma lista de todos os pedidos cadastrados no sistema
 *     responses:
 *       200:
 *         description: Lista de pedidos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *                 total:
 *                   type: integer
 *                   example: 5
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/order/list', OrderController.getAllOrders);

/**
 * @swagger
 * /order:
 *   post:
 *     tags:
 *       - Pedidos
 *     summary: Criar novo pedido
 *     description: Cria um novo pedido no sistema com seus itens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *           example:
 *             numeroPedido: "v10089015vdb-01"
 *             valorTotal: 10000
 *             dataCriacao: "2023-07-19T12:24:11.5299601+00:00"
 *             items:
 *               - idItem: "2434"
 *                 quantidadeItem: 1
 *                 valorItem: 1000
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       400:
 *         description: Dados inválidos ou incompletos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/order', OrderController.createOrder);

/**
 * @swagger
 * /order/{orderId}:
 *   get:
 *     tags:
 *       - Pedidos
 *     summary: Buscar pedido por ID
 *     description: Retorna os detalhes de um pedido específico
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único do pedido
 *         example: "v10089015vdb-01"
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       404:
 *         description: Pedido não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/order/:orderId', OrderController.getOrderById);

/**
 * @swagger
 * /order/{orderId}:
 *   put:
 *     tags:
 *       - Pedidos
 *     summary: Atualizar pedido
 *     description: Atualiza os dados de um pedido existente
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único do pedido
 *         example: "v10089015vdb-01"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *           example:
 *             numeroPedido: "v10089015vdb-01"
 *             valorTotal: 15000
 *             dataCriacao: "2023-07-20T12:24:11.5299601+00:00"
 *             items:
 *               - idItem: "2435"
 *                 quantidadeItem: 2
 *                 valorItem: 7500
 *     responses:
 *       200:
 *         description: Pedido atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       404:
 *         description: Pedido não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/order/:orderId', OrderController.updateOrder);

/**
 * @swagger
 * /order/{orderId}:
 *   delete:
 *     tags:
 *       - Pedidos
 *     summary: Deletar pedido
 *     description: Remove um pedido do sistema
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único do pedido
 *         example: "v10089015vdb-01"
 *     responses:
 *       200:
 *         description: Pedido deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Pedido deletado com sucesso"
 *       404:
 *         description: Pedido não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/order/:orderId', OrderController.deleteOrder);

module.exports = router;
