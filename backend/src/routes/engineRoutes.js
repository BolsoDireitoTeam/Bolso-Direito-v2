const express = require('express');
const router = express.Router();
const engineController = require('../controllers/engineController');

router.post('/virar-mes', engineController.virarMes);

module.exports = router;
