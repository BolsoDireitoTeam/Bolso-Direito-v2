const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { protect } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Invoices
 *   description: Faturas do cartão de crédito
 */

/**
 * @swagger
 * /api/invoices:
 *   get:
 *     summary: Listar todas as faturas agrupadas por mês
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Faturas agrupadas por mês (ex. "2026-07" → [items])
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   additionalProperties:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Transaction'
 */
router.get('/', protect, transactionController.getInvoices);

/**
 * @swagger
 * /api/invoices/{mesAno}:
 *   get:
 *     summary: Obter itens de uma fatura específica
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: mesAno
 *         required: true
 *         schema:
 *           type: string
 *           example: "2026-07"
 *         description: Mês/ano no formato YYYY-MM
 *     responses:
 *       200:
 *         description: Itens da fatura
 */
router.get('/:mesAno', protect, transactionController.getInvoiceByMonth);

module.exports = router;
