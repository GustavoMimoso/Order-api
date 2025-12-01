// src/config/swagger.js
const swaggerJsDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Order API - Jitterbit Test',
            version: '1.0.0',
            description: 'API RESTful para gerenciamento de pedidos com documentação Swagger',
            contact: {
                name: 'Gustavo Silva',
                email: 'gustavo@example.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor de Desenvolvimento'
            },
            {
                url: 'https://api-producao.com',
                description: 'Servidor de Produção'
            }
        ],
        components: {
            schemas: {
                Order: {
                    type: 'object',
                    required: ['numeroPedido', 'valorTotal', 'dataCriacao', 'items'],
                    properties: {
                        numeroPedido: {
                            type: 'string',
                            example: 'v10089015vdb-01',
                            description: 'Número único do pedido'
                        },
                        valorTotal: {
                            type: 'number',
                            example: 10000,
                            description: 'Valor total em centavos (10000 = R$ 100,00)'
                        },
                        dataCriacao: {
                            type: 'string',
                            format: 'date-time',
                            example: '2023-07-19T12:24:11.5299601+00:00',
                            description: 'Data e hora de criação'
                        },
                        items: {
                            type: 'array',
                            description: 'Itens do pedido',
                            items: {
                                type: 'object',
                                required: ['idItem', 'quantidadeItem', 'valorItem'],
                                properties: {
                                    idItem: {
                                        type: 'string',
                                        example: '2434',
                                        description: 'ID do produto'
                                    },
                                    quantidadeItem: {
                                        type: 'integer',
                                        example: 1,
                                        description: 'Quantidade'
                                    },
                                    valorItem: {
                                        type: 'number',
                                        example: 1000,
                                        description: 'Preço unitário em centavos'
                                    }
                                }
                            }
                        }
                    }
                },
                OrderResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true
                        },
                        data: {
                            $ref: '#/components/schemas/Order'
                        },
                        message: {
                            type: 'string',
                            example: 'Pedido criado com sucesso'
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false
                        },
                        message: {
                            type: 'string',
                            example: 'Erro ao processar requisição'
                        },
                        error: {
                            type: 'string',
                            example: 'Descrição do erro'
                        }
                    }
                }
            }
        },
        tags: [
            {
                name: 'Pedidos',
                description: 'Operações relacionadas a pedidos'
            }
        ]
    },
    apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;
