// src/controllers/orderController.js
const OrderService = require('../services/orderService');

class OrderController {
    /**
     * POST /order
     * Cria um novo pedido
     */
    static async createOrder(req, res) {
        try {
            console.log('=== CREATE ORDER ===');
            console.log('Dados recebidos:', req.body);
            
            // Valida os dados obrigatórios
            if (!req.body.numeroPedido || !req.body.valorTotal || !req.body.items) {
                return res.status(400).json({
                    success: false,
                    message: "Faltam campos obrigatórios: numeroPedido, valorTotal, items"
                });
            }
            
            if (req.body.items.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Pedido deve ter pelo menos um item"
                });
            }
            
            // Chama o serviço para criar o pedido
            const order = await OrderService.createOrder(req.body);
            
            res.status(201).json({
                success: true,
                data: order,
                message: "Pedido criado com sucesso"
            });
            
        } catch (error) {
            console.error('❌ Erro:', error);
            res.status(500).json({
                success: false,
                message: "Erro ao criar pedido",
                error: error.message
            });
        }
    }

    /**
     * GET /order/:orderId
     * Busca um pedido específico
     */
    static async getOrderById(req, res) {
        try {
            console.log('=== GET ORDER BY ID ===');
            console.log('ID do pedido:', req.params.orderId);
            
            const { orderId } = req.params;
            
            // Busca o pedido
            const order = await OrderService.getOrderById(orderId);
            
            // Se não encontrou
            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: `Pedido ${orderId} não encontrado`
                });
            }
            
            res.status(200).json({
                success: true,
                data: order
            });
            
        } catch (error) {
            console.error('❌ Erro:', error);
            res.status(500).json({
                success: false,
                message: "Erro ao buscar pedido",
                error: error.message
            });
        }
    }

    /**
     * GET /order/list
     * Lista todos os pedidos
     */
    static async getAllOrders(req, res) {
        try {
            console.log('=== LIST ALL ORDERS ===');
            
            const orders = await OrderService.getAllOrders();
            
            res.status(200).json({
                success: true,
                data: orders,
                total: orders.length,
                message: `Total de ${orders.length} pedidos encontrados`
            });
            
        } catch (error) {
            console.error('❌ Erro:', error);
            res.status(500).json({
                success: false,
                message: "Erro ao listar pedidos",
                error: error.message
            });
        }
    }

    /**
     * PUT /order/:orderId
     * Atualiza um pedido existente
     */
    static async updateOrder(req, res) {
        try {
            console.log('=== UPDATE ORDER ===');
            console.log('ID do pedido:', req.params.orderId);
            console.log('Novos dados:', req.body);
            
            const { orderId } = req.params;
            
            // Valida os dados
            if (!req.body.numeroPedido || !req.body.valorTotal || !req.body.items) {
                return res.status(400).json({
                    success: false,
                    message: "Faltam campos obrigatórios: numeroPedido, valorTotal, items"
                });
            }
            
            // Atualiza o pedido
            const order = await OrderService.updateOrder(orderId, req.body);
            
            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: `Pedido ${orderId} não encontrado`
                });
            }
            
            res.status(200).json({
                success: true,
                data: order,
                message: "Pedido atualizado com sucesso"
            });
            
        } catch (error) {
            console.error('❌ Erro:', error);
            res.status(500).json({
                success: false,
                message: "Erro ao atualizar pedido",
                error: error.message
            });
        }
    }

    /**
     * DELETE /order/:orderId
     * Deleta um pedido
     */
    static async deleteOrder(req, res) {
        try {
            console.log('=== DELETE ORDER ===');
            console.log('ID do pedido:', req.params.orderId);
            
            const { orderId } = req.params;
            
            // Deleta o pedido
            const result = await OrderService.deleteOrder(orderId);
            
            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: `Pedido ${orderId} não encontrado`
                });
            }
            
            res.status(200).json({
                success: true,
                message: `Pedido ${orderId} deletado com sucesso`,
                data: result
            });
            
        } catch (error) {
            console.error('❌ Erro:', error);
            res.status(500).json({
                success: false,
                message: "Erro ao deletar pedido",
                error: error.message
            });
        }
    }
}

module.exports = OrderController;
