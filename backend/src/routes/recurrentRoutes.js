const express = require('express');
const router = express.Router();
const recurrentController = require('../controllers/recurrentController');
const { protect } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Recurrent
 *   description: Transações recorrentes mensais (ganhos e gastos fixos)
 */

/**
 * @swagger
 * /api/recurrent:
 *   get:
 *     summary: Listar transações recorrentes do usuário
 *     tags: [Recurrent]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de recorrentes
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
 *                     $ref: '#/components/schemas/Recurrent'
 *   post:
 *     summary: Criar transação recorrente
 *     tags: [Recurrent]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecurrentInput'
 *     responses:
 *       201:
 *         description: Recorrente criada
 */
router.get('/', protect, recurrentController.getAll);
router.post('/', protect, recurrentController.create);

/**
 * @swagger
 * /api/recurrent/{id}:
 *   delete:
 *     summary: Remover transação recorrente
 *     tags: [Recurrent]
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
 *         description: Recorrente removida
 *       404:
 *         description: Não encontrada
 */
router.delete('/:id', protect, recurrentController.delete);

module.exports = router;
