/**
 * Tratamento centralizado de erros do Express.
 * Assegura que todas as respostas de erro sigam o mesmo padrão JSON.
 */
function errorHandler(err, req, res, next) {
  console.error('[Error]', err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erro interno do servidor';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

module.exports = { errorHandler };
