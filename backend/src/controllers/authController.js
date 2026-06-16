const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

/**
 * Gera um JWT assinado com o ID do usuário.
 */
function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

exports.register = async (req, res) => {
  const { nome, email, senha } = req.body;

  // Verifica se já existe
  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ success: false, message: 'Email já cadastrado.' });
  }

  // A senha será hasheada automaticamente pelo hook pre('save') do model
  const newUser = await User.create({
    nome,
    email,
    senha,
    financeiro: { saldo: 0, diaVencimentoCartao: null, limiteCartao: 0, plano: 'gratuito' },
  });

  // Gera token real
  const token = generateToken(newUser._id);

  // Retorna sem o campo senha
  const userData = newUser.toObject();
  delete userData.senha;

  res.status(201).json({ success: true, token, data: userData });
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ success: false, message: 'Email e senha são obrigatórios.' });
  }

  // Busca o usuário incluindo o campo senha (que é select: false por padrão)
  const user = await User.findOne({ email }).select('+senha');

  if (!user || !(await user.matchPassword(senha))) {
    return res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
  }

  // Gera token real
  const token = generateToken(user._id);

  // Retorna sem o campo senha
  const userData = user.toObject();
  delete userData.senha;

  res.status(200).json({ success: true, token, data: userData });
};

exports.getProfile = async (req, res) => {
  const userId = req.user;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });

  res.status(200).json({ success: true, data: user });
};

exports.getFullState = async (req, res) => {
  const userId = req.user;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });

  const Transaction = require('../models/transactionModel');
  const RecurrentTransaction = require('../models/recurrentModel');

  const transacoes = await Transaction.find({ userId, isInvoiceItem: { $ne: true } });
  const invoices = await Transaction.find({ userId, isInvoiceItem: true });
  
  const faturas = invoices.reduce((acc, curr) => {
    const doc = curr.toObject();
    if (!acc[doc.mesFatura]) acc[doc.mesFatura] = [];
    acc[doc.mesFatura].push(doc);
    return acc;
  }, {});

  const recorrentes = await RecurrentTransaction.find({ userId });
  const ganhosMensais = recorrentes.filter(r => r.tipo === 'ganho');
  const gastosMensais = recorrentes.filter(r => r.tipo === 'gasto');

  res.status(200).json({ 
    success: true, 
    data: {
      saldo: user.financeiro?.saldo || 0,
      transacoes: transacoes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
      estado: {
        faturas,
        ganhosMensais,
        gastosMensais
      },
      configuracoes: user.financeiro || {}
    }
  });
};

exports.updateProfile = async (req, res) => {
  const userId = req.user;

  const { nome, celular, avatar } = req.body;
  
  const updated = await User.findByIdAndUpdate(userId, { nome, celular, avatar }, { new: true, runValidators: true });
  res.status(200).json({ success: true, data: updated });
};

exports.updateFinance = async (req, res) => {
  const userId = req.user;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });

  const financeiroAtualizado = { ...user.financeiro.toObject(), ...req.body };
  const updated = await User.findByIdAndUpdate(userId, { financeiro: financeiroAtualizado }, { new: true, runValidators: true });

  res.status(200).json({ success: true, data: updated });
};
