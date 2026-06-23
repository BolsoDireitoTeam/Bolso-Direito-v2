const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bolso Direito API',
      version: '2.0.0',
      description:
        'API do Bolso Direito — controle financeiro pessoal.\n\n' +
        'Autenticação via **Bearer Token** (JWT). Obtenha o token em `/api/users/login` ou `/api/users/register`.',
      contact: {
        name: 'Bolso Direito Team',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Servidor de Desenvolvimento',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtido via login ou registro.',
        },
      },
      schemas: {
        // ─── User ─────────────────────────────────────────
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '665f1a2b3c4d5e6f7a8b9c0d' },
            nome: { type: 'string', example: 'Pedro Silva' },
            email: { type: 'string', format: 'email', example: 'pedro@email.com' },
            celular: { type: 'string', example: '11999887766' },
            avatar: { type: 'string', nullable: true },
            financeiro: { $ref: '#/components/schemas/Financeiro' },
          },
        },
        Financeiro: {
          type: 'object',
          properties: {
            saldo: { type: 'number', example: 5000.0 },
            diaVencimentoCartao: { type: 'integer', nullable: true, example: 10 },
            limiteCartao: { type: 'number', example: 3000.0 },
            plano: { type: 'string', enum: ['gratuito', 'pago'], example: 'gratuito' },
          },
        },
        // ─── Transaction ──────────────────────────────────
        Transaction: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            tipo: { type: 'string', enum: ['ganho', 'gasto'], example: 'gasto' },
            subtipo: { type: 'string', enum: ['debito', 'credito'], example: 'debito' },
            nome: { type: 'string', example: 'Supermercado Extra' },
            valor: { type: 'number', example: 150.75 },
            categoria: { type: 'string', example: 'Alimentação' },
            data: { type: 'string', format: 'date', example: '2026-06-15' },
            isInvoiceItem: { type: 'boolean', default: false },
            mesFatura: { type: 'string', example: '2026-07' },
            parcela: { type: 'integer', example: 1 },
            totalParcelas: { type: 'integer', example: 3 },
          },
        },
        TransactionInput: {
          type: 'object',
          required: ['tipo', 'nome', 'valor'],
          properties: {
            tipo: { type: 'string', enum: ['ganho', 'gasto'] },
            subtipo: { type: 'string', enum: ['debito', 'credito'], default: 'debito' },
            nome: { type: 'string', example: 'Salário' },
            valor: { type: 'number', example: 5000 },
            categoria: { type: 'string', example: 'Outros' },
            data: { type: 'string', format: 'date', example: '2026-06-15' },
            parcelas: { type: 'integer', default: 1, example: 1 },
          },
        },
        // ─── Investment ───────────────────────────────────
        Investment: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            nome: { type: 'string', example: 'Tesouro Selic 2030' },
            tipo: { type: 'string', example: 'Renda Fixa' },
            taxaMensal: { type: 'number', example: 0.8 },
            dataInicio: { type: 'string', format: 'date' },
            aportes: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  valor: { type: 'number', example: 500 },
                  data: { type: 'string', format: 'date' },
                },
              },
            },
          },
        },
        InvestmentInput: {
          type: 'object',
          required: ['nome', 'tipo', 'taxaMensal'],
          properties: {
            nome: { type: 'string', example: 'Tesouro IPCA+' },
            tipo: { type: 'string', example: 'Renda Fixa' },
            taxaMensal: { type: 'number', example: 1.2 },
            dataInicio: { type: 'string', format: 'date' },
          },
        },
        // ─── Goal ─────────────────────────────────────────
        Goal: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            nome: { type: 'string', example: 'Viagem para Europa' },
            valorAlvo: { type: 'number', example: 15000 },
            valorAtual: { type: 'number', example: 3200 },
            prazo: { type: 'string', format: 'date' },
            icone: { type: 'string', example: '✈️' },
            cor: { type: 'string', example: '#4ee3c4' },
            aportes: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  valor: { type: 'number' },
                  tipo: { type: 'string', enum: ['deposito', 'resgate'] },
                  data: { type: 'string', format: 'date' },
                },
              },
            },
          },
        },
        GoalInput: {
          type: 'object',
          required: ['nome', 'valorAlvo'],
          properties: {
            nome: { type: 'string', example: 'Reserva de Emergência' },
            valorAlvo: { type: 'number', example: 10000 },
            prazo: { type: 'string', format: 'date' },
            icone: { type: 'string', example: '🎯' },
            cor: { type: 'string', example: '#4ee3c4' },
          },
        },
        // ─── Recurrent ────────────────────────────────────
        Recurrent: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            nome: { type: 'string', example: 'Salário' },
            valor: { type: 'number', example: 5000 },
            tipo: { type: 'string', enum: ['ganho', 'gasto'] },
          },
        },
        RecurrentInput: {
          type: 'object',
          required: ['nome', 'valor', 'tipo'],
          properties: {
            nome: { type: 'string', example: 'Netflix' },
            valor: { type: 'number', example: 55.9 },
            tipo: { type: 'string', enum: ['ganho', 'gasto'] },
          },
        },
        // ─── Batch Import ─────────────────────────────────
        BatchImportInput: {
          type: 'object',
          required: ['transacoes'],
          properties: {
            transacoes: {
              type: 'array',
              items: { $ref: '#/components/schemas/TransactionInput' },
            },
          },
        },
        // ─── Generic Responses ────────────────────────────
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'object' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Erro na requisição.' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
