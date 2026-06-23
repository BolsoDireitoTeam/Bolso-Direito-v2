const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

/**
 * Gera um JWT assinado com o ID do usuário.
 */
function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

// GET /auth/google — Inicia o fluxo OAuth
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// GET /auth/google/callback — Callback do Google
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed` }),
  (req, res) => {
    // Gera JWT para o usuário autenticado pelo Google
    const token = generateToken(req.user._id);

    // Redireciona para o front-end com o token na URL
    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendURL}/login?token=${token}&nome=${encodeURIComponent(req.user.nome)}&email=${encodeURIComponent(req.user.email)}`);
  }
);

module.exports = router;
