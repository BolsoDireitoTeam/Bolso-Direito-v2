const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');

router.get('/', goalController.getAll);
router.get('/:id', goalController.getById);
router.post('/', goalController.create);
router.put('/:id', goalController.update);
router.delete('/:id', goalController.delete);
router.post('/:id/contribute', goalController.contribute);
router.post('/:id/redeem', goalController.redeem);

module.exports = router;
