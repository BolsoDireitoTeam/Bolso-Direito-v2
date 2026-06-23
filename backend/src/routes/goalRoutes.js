const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');
const { protect } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Goals
 *   description: Metas financeiras
 */

/**
 * @swagger
 * /api/goals:
 *   get:
 *     summary: Listar todas as metas do usuário
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de metas
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
 *                     $ref: '#/components/schemas/Goal'
 *   post:
 *     summary: Criar nova meta
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GoalInput'
 *     responses:
 *       201:
 *         description: Meta criada
 */
router.get('/', protect, goalController.getAll);
router.post('/', protect, goalController.create);

/**
 * @swagger
 * /api/goals/{id}:
 *   get:
 *     summary: Obter meta por ID
 *     tags: [Goals]
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
 *         description: Dados da meta
 *       404:
 *         description: Meta não encontrada
 *   put:
 *     summary: Atualizar meta
 *     tags: [Goals]
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
 *             $ref: '#/components/schemas/GoalInput'
 *     responses:
 *       200:
 *         description: Meta atualizada
 *   delete:
 *     summary: Remover meta
 *     tags: [Goals]
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
 *         description: Meta removida
 */
router.get('/:id', protect, goalController.getById);
router.put('/:id', protect, goalController.update);
router.delete('/:id', protect, goalController.delete);

/**
 * @swagger
 * /api/goals/{id}/contribute:
 *   post:
 *     summary: Depositar valor na meta
 *     tags: [Goals]
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
 *     responses:
 *       200:
 *         description: Depósito realizado
 */
router.post('/:id/contribute', protect, goalController.contribute);

/**
 * @swagger
 * /api/goals/{id}/redeem:
 *   post:
 *     summary: Resgatar valor da meta
 *     tags: [Goals]
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
 *                 example: 200
 *     responses:
 *       200:
 *         description: Resgate realizado
 */
router.post('/:id/redeem', protect, goalController.redeem);

module.exports = router;
