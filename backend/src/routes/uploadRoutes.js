const express = require('express');
const router = express.Router();
const upload = require('../config/uploadConfig');
const uploadController = require('../controllers/uploadController');
const { protect } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: Upload de arquivos CSV (extratos e faturas)
 */

// Middleware para tratar erros do Multer
const handleMulterError = (err, req, res, next) => {
  if (err) {
    const message = err.code === 'LIMIT_FILE_SIZE'
      ? 'O arquivo excede o limite de 5MB.'
      : err.message || 'Erro no upload do arquivo.';
    return res.status(400).json({ success: false, message });
  }
  next();
};

/**
 * @swagger
 * /api/upload/extrato:
 *   post:
 *     summary: Upload de extrato bancário em CSV
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               arquivo:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo CSV do extrato bancário (máx 5MB)
 *     responses:
 *       200:
 *         description: Extrato recebido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     filename:
 *                       type: string
 *                     originalname:
 *                       type: string
 *                     size:
 *                       type: integer
 *       400:
 *         description: Arquivo inválido ou ausente
 */
router.post(
  '/extrato',
  protect,
  upload.single('arquivo'),
  handleMulterError,
  uploadController.uploadExtrato
);

/**
 * @swagger
 * /api/upload/fatura:
 *   post:
 *     summary: Upload de fatura do cartão em CSV
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               arquivo:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo CSV da fatura do cartão (máx 5MB)
 *     responses:
 *       200:
 *         description: Fatura recebida com sucesso
 *       400:
 *         description: Arquivo inválido ou ausente
 */
router.post(
  '/fatura',
  protect,
  upload.single('arquivo'),
  handleMulterError,
  uploadController.uploadFatura
);

module.exports = router;
