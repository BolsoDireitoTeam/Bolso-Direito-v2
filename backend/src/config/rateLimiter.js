const rateLimit = require('express-rate-limit');

/**
 * Rate Limiter global para toda a /api.
 * 100 requisições por IP a cada 15 minutos.
 */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Muitas requisições deste IP. Tente novamente em 15 minutos.',
  },
});

/**
 * Rate Limiter restrito para rotas de autenticação.
 * 7 tentativas por IP a cada 15 minutos.
 * Previne ataques de força bruta em login/register.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 7,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Muitas tentativas de autenticação. Tente novamente em 15 minutos.',
  },
});

module.exports = { globalLimiter, authLimiter };
