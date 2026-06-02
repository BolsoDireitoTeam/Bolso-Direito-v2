const User = require('../models/userModel');

exports.register = async (req, res, next) => {
  try {
    const { nome, email, senha } = req.body;
    // Sem criptografia real por ora (apenas simulação)
    
    // Verifica se já existe
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Email já cadastrado.' });
    }

    const newUser = await User.create({ nome, email, senha, financeiro: { saldo: 0, diaVencimentoCartao: null, limiteCartao: 0, plano: 'gratuito' } });
    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, senha } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || user.senha !== senha) {
      return res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
    }

    // Retorna um token dummy e os dados
    res.status(200).json({ 
      success: true, 
      token: `dummy-token-${user.id}`, 
      data: user 
    });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    // Simulando que o tokenDummy foi interceptado por um authMiddleware e colocou req.userId
    const userId = req.userId || req.headers['x-user-id']; // Fallback pra simplificar requisições locais
    
    if (!userId) return res.status(401).json({ success: false, message: 'Não autorizado.' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.userId || req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ success: false, message: 'Não autorizado.' });

    const { nome, celular, avatar } = req.body;
    
    const updated = await User.findByIdAndUpdate(userId, { nome, celular, avatar });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

exports.updateFinance = async (req, res, next) => {
  try {
    const userId = req.userId || req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ success: false, message: 'Não autorizado.' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });

    const financeiroAtualizado = { ...user.financeiro, ...req.body };
    const updated = await User.findByIdAndUpdate(userId, { financeiro: financeiroAtualizado });

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};
