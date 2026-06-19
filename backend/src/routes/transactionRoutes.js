const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { protect } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Transações financeiras (ganhos e gastos avulsos)
 */

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Listar todas as transações do usuário (exceto itens de fatura)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de transações
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *   post:
 *     summary: Criar nova transação
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransactionInput'
 *     responses:
 *       201:
 *         description: Transação criada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Dados inválidos
 */
router.get('/', protect, transactionController.getAll);
router.post('/', protect, transactionController.create);

/**
 * @swagger
 * /api/transactions/{id}:
 *   delete:
 *     summary: Remover uma transação
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da transação
 *     responses:
 *       200:
 *         description: Transação removida
 *       404:
 *         description: Transação não encontrada
 */
router.delete('/:id', protect, transactionController.delete);
router.put('/:id', protect, transactionController.update);

/**
 * @swagger
 * /api/transactions/import-batch:
 *   post:
 *     summary: Importar transações em lote (de CSV parseado no front-end)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BatchImportInput'
 *     responses:
 *       201:
 *         description: Transações importadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: 15 transações importadas com sucesso.
 *                 data:
 *                   type: object
 *                   properties:
 *                     importadas:
 *                       type: integer
 *                       example: 15
 *       400:
 *         description: Array de transações vazio ou ausente
 */
router.post('/import-batch', protect, transactionController.importBatch);

module.exports = router;
