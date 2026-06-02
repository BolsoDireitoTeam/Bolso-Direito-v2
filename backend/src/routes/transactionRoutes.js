const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// TRANSAÇÕES (Débito e Ganhos Avulsos)
router.get('/', transactionController.getAll);
router.post('/', transactionController.create);
router.delete('/:id', transactionController.delete);

module.exports = router;
