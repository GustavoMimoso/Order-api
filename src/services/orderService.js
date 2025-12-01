// src/services/orderService.js
const OrderModel = require('../models/orderModel');

class OrderService {
    /**
     * Transforma dados de entrada para o formato do banco
     * Entrada: numeroPedido, valorTotal, dataCriacao, items com idItem
     * Saída: orderId, value, creationDate, items com productId
     */
   static mapInputToOrder(inputData) {
    console.log('📝 Transformando dados de entrada...');
    console.log('Dados recebidos:', inputData); // DEBUG
    
    // Garante que items existe e é um array
    const items = inputData.items && Array.isArray(inputData.items) 
        ? inputData.items.map(item => ({
            productId: parseInt(item.idItem),
            quantity: item.quantidadeItem,
            price: item.valorItem
        }))
        : [];
    
    console.log('Items mapeados:', items); // DEBUG
    
    return {
        orderId: inputData.numeroPedido,
        value: inputData.valorTotal,
        creationDate: new Date(inputData.dataCriacao).toISOString(),
        items: items
    };
}


    /**
     * Transforma dados do banco para formato de saída
     * Saída: numeroPedido, valorTotal, dataCriacao, items com idItem
     */
    static mapOrderToOutput(orderData) {
        if (!orderData) return null;
        
        return {
            numeroPedido: orderData.orderid,
            valorTotal: orderData.value,
            dataCriacao: orderData.creationdate,
            items: (orderData.items || []).map(item => ({
                idItem: item.productid ? item.productid.toString() : '0',
                quantidadeItem: item.quantity,
                valorItem: item.price
            }))
        };
    }

    /**
     * Cria um novo pedido
     */
    static async createOrder(inputData) {
        console.log('🆕 Criando novo pedido...');
        
        // Transforma os dados
        const orderData = this.mapInputToOrder(inputData);
        
        // Salva no banco
        const result = await OrderModel.createOrder(orderData);
        
        // Transforma a resposta para o formato esperado
        return this.mapOrderToOutput(result);
    }

    /**
     * Busca um pedido pelo ID
     */
    static async getOrderById(orderId) {
        console.log(`🔍 Buscando pedido ${orderId}...`);
        
        const result = await OrderModel.getOrderById(orderId);
        return this.mapOrderToOutput(result);
    }

    /**
     * Lista todos os pedidos
     */
    static async getAllOrders() {
        console.log('📋 Listando todos os pedidos...');
        
        const results = await OrderModel.getAllOrders();
        return results.map(order => this.mapOrderToOutput(order));
    }

    /**
     * Atualiza um pedido
     */
    static async updateOrder(orderId, inputData) {
        console.log(`✏️ Atualizando pedido ${orderId}...`);
        
        const orderData = this.mapInputToOrder(inputData);
        const result = await OrderModel.updateOrder(orderId, orderData);
        
        if (!result) return null;
        return this.mapOrderToOutput(result);
    }

    /**
     * Deleta um pedido
     */
    static async deleteOrder(orderId) {
        console.log(`🗑️ Deletando pedido ${orderId}...`);
        
        const result = await OrderModel.deleteOrder(orderId);
        return this.mapOrderToOutput(result);
    }
}

module.exports = OrderService;
