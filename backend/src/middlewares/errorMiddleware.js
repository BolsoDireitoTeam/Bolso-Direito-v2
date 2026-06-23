/**
 * Tratamento centralizado de erros do Express.
 * Captura erros do Mongoose, Multer, JWT e genéricos.
 * Assegura que todas as respostas de erro sigam o mesmo padrão JSON.
 */
function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Erro interno do servidor';

  // ── Mongoose: Validation Error ─────────────────────────────
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const campos = Object.values(err.errors).map(e => e.message);
    message = `Dados inválidos: ${campos.join(', ')}`;
  }

  // ── Mongoose: Cast Error (ID inválido) ─────────────────────
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = 'ID inválido.';
  }

  // ── Mongoose: Duplicate Key ────────────────────────────────
  if (err.code === 11000) {
    statusCode = 400;
    const campo = Object.keys(err.keyValue || {})[0] || 'campo';
    message = `O ${campo} informado já está em uso.`;
  }

  // ── JWT: Token Expirado ────────────────────────────────────
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expirado. Faça login novamente.';
  }

  // ── JWT: Token Inválido ────────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token inválido.';
  }

  // ── Multer: Erros de upload ────────────────────────────────
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    message = 'O arquivo excede o limite permitido (5MB).';
  }

  // ── Log apenas em desenvolvimento ──────────────────────────
  if (process.env.NODE_ENV === 'development') {
    console.error(`[Error] ${statusCode} - ${message}`);
    if (statusCode === 500) console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && statusCode === 500 && { stack: err.stack }),
  });
}

module.exports = { errorHandler };
