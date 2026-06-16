const Category = require('../models/categoryModel');
const Transaction = require('../models/transactionModel');

// Categorias padrão que o sistema gera caso o usuário não tenha nenhuma
const DEFAULT_CATEGORIES = [
  { nome: 'Alimentação', cor: '#4ee3c4', icone: 'bi-basket' },
  { nome: 'Moradia', cor: '#ACB6E5', icone: 'bi-house' },
  { nome: 'Transporte', cor: '#f4c864', icone: 'bi-car-front' },
  { nome: 'Saúde', cor: '#f06a6a', icone: 'bi-heart-pulse' },
  { nome: 'Educação', cor: '#74b9ff', icone: 'bi-book' },
  { nome: 'Lazer', cor: '#4ee3a0', icone: 'bi-controller' },
  { nome: 'Compras', cor: '#a29bfe', icone: 'bi-bag' },
  { nome: 'Mercado', cor: '#00cec9', icone: 'bi-cart' },
  { nome: 'Roupas', cor: '#fd79a8', icone: 'bi-shop' },
  { nome: 'Outros', cor: '#b2bec3', icone: 'bi-tag' },
];

exports.getAll = async (req, res) => {
  try {
    const userId = req.user;
    let categories = await Category.find({ userId });

    // Seed default categories se o usuário não tiver nenhuma
    if (categories.length === 0) {
      const defaultDocs = DEFAULT_CATEGORIES.map(c => ({
        ...c,
        userId,
        isDefault: true,
      }));
      categories = await Category.insertMany(defaultDocs);
    }

    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    throw error;
  }
};

exports.create = async (req, res) => {
  try {
    const userId = req.user;
    const { nome, cor, icone } = req.body;

    const existing = await Category.findOne({ userId, nome: { $regex: new RegExp(`^${nome}$`, 'i') } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Você já possui uma categoria com esse nome.' });
    }

    const newCat = await Category.create({ userId, nome, cor, icone, isDefault: false });
    res.status(201).json({ success: true, data: newCat });
  } catch (error) {
    throw error;
  }
};

exports.update = async (req, res) => {
  try {
    const userId = req.user;
    const { id } = req.params;

    const oldCat = await Category.findOne({ _id: id, userId });
    if (!oldCat) return res.status(404).json({ success: false, message: 'Categoria não encontrada.' });

    const updated = await Category.findOneAndUpdate({ _id: id, userId }, req.body, { new: true, runValidators: true });
    
    // NOTA: Se atualizar o nome da categoria, atualizamos as transações antigas.
    if (req.body.nome && oldCat.nome !== req.body.nome) {
      await Transaction.updateMany({ userId, categoria: oldCat.nome }, { categoria: req.body.nome });
    }

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    throw error;
  }
};

exports.delete = async (req, res) => {
  try {
    const userId = req.user;
    const { id } = req.params;

    const cat = await Category.findOne({ _id: id, userId });
    if (!cat) return res.status(404).json({ success: false, message: 'Categoria não encontrada.' });

    // Movemos as transações órfãs para 'Outros' (ou 'Outras')
    await Transaction.updateMany({ userId, categoria: cat.nome }, { categoria: 'Outros' });

    await Category.findOneAndDelete({ _id: id, userId });
    res.status(200).json({ success: true, message: 'Categoria removida. Transações movidas para "Outros".' });
  } catch (error) {
    throw error;
  }
};
