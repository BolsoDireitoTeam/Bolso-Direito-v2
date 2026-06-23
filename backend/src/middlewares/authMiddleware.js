const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

/**
 * Middleware de proteção de rotas.
 * Verifica o JWT no header Authorization: Bearer <token>,
 * decodifica e injeta o ID do usuário em req.user.
 */
const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Não autorizado. Token não fornecido.',
      });
    }

    // Verificar e decodificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Confirmar que o usuário ainda existe no banco
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Não autorizado. Usuário não encontrado.',
      });
    }

    // Injetar o ID do usuário no request
    req.user = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Não autorizado. Token inválido ou expirado.',
    });
  }
};

module.exports = { protect };
