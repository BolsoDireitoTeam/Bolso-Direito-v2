const express = require('express');
const router = express.Router();
const recurrentController = require('../controllers/recurrentController');

router.get('/', recurrentController.getAll);
router.post('/', recurrentController.create);
router.delete('/:id', recurrentController.delete);

module.exports = router;
