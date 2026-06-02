const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authController.getProfile);
router.get('/full-state', authController.getFullState);
router.put('/profile', authController.updateProfile);
router.put('/finance', authController.updateFinance);

module.exports = router;
