const express = require('express');
const router = express.Router();
const investmentController = require('../controllers/investmentController');

router.get('/', investmentController.getAll);
router.get('/:id', investmentController.getById);
router.post('/', investmentController.create);
router.put('/:id', investmentController.update);
router.delete('/:id', investmentController.delete);
router.post('/:id/aportes', investmentController.addAporte);

module.exports = router;
