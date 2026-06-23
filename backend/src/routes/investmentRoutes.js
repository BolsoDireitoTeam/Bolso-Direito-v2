const express = require('express');
const router = express.Router();
const investmentController = require('../controllers/investmentController');
const { protect } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Investments
 *   description: Investimentos e aportes
 */

/**
 * @swagger
 * /api/investments:
 *   get:
 *     summary: Listar todos os investimentos do usuário
 *     tags: [Investments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de investimentos
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
 *                     $ref: '#/components/schemas/Investment'
 *   post:
 *     summary: Criar novo investimento
 *     tags: [Investments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InvestmentInput'
 *     responses:
 *       201:
 *         description: Investimento criado
 */
router.get('/', protect, investmentController.getAll);
router.post('/', protect, investmentController.create);

/**
 * @swagger
 * /api/investments/{id}:
 *   get:
 *     summary: Obter investimento por ID
 *     tags: [Investments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dados do investimento
 *       404:
 *         description: Investimento não encontrado
 *   put:
 *     summary: Atualizar investimento
 *     tags: [Investments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InvestmentInput'
 *     responses:
 *       200:
 *         description: Investimento atualizado
 *   delete:
 *     summary: Remover investimento
 *     tags: [Investments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Investimento removido
 */
router.get('/:id', protect, investmentController.getById);
router.put('/:id', protect, investmentController.update);
router.delete('/:id', protect, investmentController.delete);

/**
 * @swagger
 * /api/investments/{id}/aportes:
 *   post:
 *     summary: Adicionar aporte a um investimento
 *     tags: [Investments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [valor]
 *             properties:
 *               valor:
 *                 type: number
 *                 example: 500
 *               data:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Aporte adicionado
 */
router.post('/:id/aportes', protect, investmentController.addAporte);

module.exports = router;
