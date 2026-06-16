const express = require('express');
const router = express.Router();
const engineController = require('../controllers/engineController');
const { protect } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Engine
 *   description: Motor financeiro (virada de mês, recorrentes automáticos)
 */

/**
 * @swagger
 * /api/engine/virar-mes:
 *   post:
 *     summary: Executar virada de mês (processa recorrentes, fecha fatura, aplica investimentos)
 *     tags: [Engine]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mesAtual:
 *                 type: string
 *                 example: "2026-06"
 *                 description: Mês a ser processado
 *     responses:
 *       200:
 *         description: Virada de mês executada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     ganhosMensaisProcessados:
 *                       type: integer
 *                     gastosMensaisProcessados:
 *                       type: integer
 *                     faturaFechada:
 *                       type: number
 *                     investimentosAplicados:
 *                       type: integer
 *                     metasAutoContribuidas:
 *                       type: integer
 */
router.post('/virar-mes', protect, engineController.virarMes);

module.exports = router;
