const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// FATURAS
router.get('/', transactionController.getInvoices);
router.get('/:mesAno', transactionController.getInvoiceByMonth);

module.exports = router;
