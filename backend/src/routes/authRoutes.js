const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Autenticação e perfil do usuário
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Criar nova conta
 *     tags: [Users]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, email, senha]
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Pedro Silva
 *               email:
 *                 type: string
 *                 format: email
 *                 example: pedro@email.com
 *               senha:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: minhaSenha123
 *     responses:
 *       201:
 *         description: Conta criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Email já cadastrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Fazer login
 *     tags: [Users]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, senha]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: pedro@email.com
 *               senha:
 *                 type: string
 *                 format: password
 *                 example: minhaSenha123
 *     responses:
 *       200:
 *         description: Login realizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Obter perfil do usuário logado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do perfil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Não autenticado
 *   put:
 *     summary: Atualizar dados cadastrais
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               celular:
 *                 type: string
 *               avatar:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil atualizado
 */
router.get('/profile', protect, authController.getProfile);
router.put('/profile', protect, authController.updateProfile);

/**
 * @swagger
 * /api/users/full-state:
 *   get:
 *     summary: Obter estado financeiro completo (saldo, transações, faturas, recorrentes)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Snapshot completo do estado financeiro
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
 *                     saldo:
 *                       type: number
 *                     transacoes:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Transaction'
 *                     estado:
 *                       type: object
 *                       properties:
 *                         faturas:
 *                           type: object
 *                         ganhosMensais:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Recurrent'
 *                         gastosMensais:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Recurrent'
 *                     configuracoes:
 *                       $ref: '#/components/schemas/Financeiro'
 */
router.get('/full-state', protect, authController.getFullState);

/**
 * @swagger
 * /api/users/finance:
 *   put:
 *     summary: Atualizar dados financeiros (saldo, limite, vencimento cartão, plano)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Financeiro'
 *     responses:
 *       200:
 *         description: Dados financeiros atualizados
 */
router.put('/finance', protect, authController.updateFinance);

module.exports = router;
