// src/models/orderModel.js
const pool = require('../config/database');

class OrderModel {
    /**
     * Cria um novo pedido com seus itens no banco de dados
     * @param {Object} orderData - Dados do pedido
     * @returns {Object} Pedido criado
     */
    static async createOrder(orderData) {
        const client = await pool.connect();
        try {
            // Inicia uma transação (tudo ou nada)
            await client.query('BEGIN');
            
            // SQL para inserir na tabela Order
            const orderQuery = `
                INSERT INTO "Order" (orderId, value, "creationDate")
                VALUES ($1, $2, $3)
                RETURNING *
            `;
            
            // Executa a inserção do pedido
            const orderResult = await client.query(orderQuery, [
                orderData.orderId,
                orderData.value,
                orderData.creationDate
            ]);
            
            const orderId = orderData.orderId;
            
            // Se tem itens, insere cada um
            if (orderData.items && orderData.items.length > 0) {
                const itemsQuery = `
                    INSERT INTO "Items" (orderId, productId, quantity, price)
                    VALUES ($1, $2, $3, $4)
                `;
                
                for (const item of orderData.items) {
                    await client.query(itemsQuery, [
                        orderId,
                        item.productId,
                        item.quantity,
                        item.price
                    ]);
                }
            }
            
            // Confirma a transação
            await client.query('COMMIT');
            console.log(`✅ Pedido ${orderId} criado com sucesso`);
            return orderResult.rows[0];
            
        } catch (error) {
            // Se houver erro, desfaz tudo (ROLLBACK)
            await client.query('ROLLBACK');
            console.error('❌ Erro ao criar pedido:', error.message);
            throw error;
        } finally {
            // Sempre libera a conexão
            client.release();
        }
    }

    /**
     * Busca um pedido pelo ID
     * @param {String} orderId - ID do pedido
     * @returns {Object} Pedido com seus itens
     */
    static async getOrderById(orderId) {
        const query = `
            SELECT o.*, 
                   json_agg(json_build_object(
                       'productId', i.productId,
                       'quantity', i.quantity,
                       'price', i.price
                   )) FILTER (WHERE i.id IS NOT NULL) as items
            FROM "Order" o
            LEFT JOIN "Items" i ON o.orderId = i.orderId
            WHERE o.orderId = $1
            GROUP BY o.orderId
        `;
        
        const result = await pool.query(query, [orderId]);
        return result.rows[0];
    }

    /**
     * Lista todos os pedidos
     * @returns {Array} Array com todos os pedidos
     */
    static async getAllOrders() {
        const query = `
            SELECT o.*, 
                   json_agg(json_build_object(
                       'productId', i.productId,
                       'quantity', i.quantity,
                       'price', i.price
                   )) FILTER (WHERE i.id IS NOT NULL) as items
            FROM "Order" o
            LEFT JOIN "Items" i ON o.orderId = i.orderId
            GROUP BY o.orderId
            ORDER BY o."creationDate" DESC
        `;
        
        const result = await pool.query(query);
        return result.rows;
    }

    /**
     * Atualiza um pedido existente
     * @param {String} orderId - ID do pedido
     * @param {Object} orderData - Novos dados
     * @returns {Object} Pedido atualizado
     */
    static async updateOrder(orderId, orderData) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            const updateQuery = `
                UPDATE "Order"
                SET value = $1, "creationDate" = $2
                WHERE orderId = $3
                RETURNING *
            `;
            
            const result = await client.query(updateQuery, [
                orderData.value,
                orderData.creationDate,
                orderId
            ]);
            
            if (!result.rows[0]) {
                throw new Error('Pedido não encontrado');
            }
            
            // Deleta os itens antigos
            if (orderData.items && orderData.items.length > 0) {
                await client.query('DELETE FROM "Items" WHERE orderId = $1', [orderId]);
                
                // Insere os novos itens
                const itemsQuery = `
                    INSERT INTO "Items" (orderId, productId, quantity, price)
                    VALUES ($1, $2, $3, $4)
                `;
                
                for (const item of orderData.items) {
                    await client.query(itemsQuery, [
                        orderId,
                        item.productId,
                        item.quantity,
                        item.price
                    ]);
                }
            }
            
            await client.query('COMMIT');
            console.log(`✅ Pedido ${orderId} atualizado`);
            return result.rows[0];
            
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('❌ Erro ao atualizar pedido:', error.message);
            throw error;
        } finally {
            client.release();
        }
    }

    /**
     * Deleta um pedido e seus itens
     * @param {String} orderId - ID do pedido
     * @returns {Object} Pedido deletado
     */
    static async deleteOrder(orderId) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            // Deleta os itens primeiro (por causa da chave estrangeira)
            await client.query('DELETE FROM "Items" WHERE orderId = $1', [orderId]);
            
            // Depois deleta o pedido
            const result = await client.query(
                'DELETE FROM "Order" WHERE orderId = $1 RETURNING *',
                [orderId]
            );
            
            if (!result.rows[0]) {
                throw new Error('Pedido não encontrado');
            }
            
            await client.query('COMMIT');
            console.log(`✅ Pedido ${orderId} deletado`);
            return result.rows[0];
            
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('❌ Erro ao deletar pedido:', error.message);
            throw error;
        } finally {
            client.release();
        }
    }
}

module.exports = OrderModel;
