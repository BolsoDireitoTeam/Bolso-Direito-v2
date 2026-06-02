const Goal = require('../models/goalModel');

exports.getAll = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'];
    const goals = await Goal.find({ userId });
    res.status(200).json({ success: true, data: goals });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const goal = await Goal.findById(id);
    if (!goal) return res.status(404).json({ success: false, message: 'Meta não encontrada.' });
    res.status(200).json({ success: true, data: goal });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'];
    const newGoal = await Goal.create({ ...req.body, userId });
    res.status(201).json({ success: true, data: newGoal });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Goal.findByIdAndUpdate(id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Não encontrado.' });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Goal.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Não encontrado.' });
    res.status(200).json({ success: true, message: 'Removido com sucesso.' });
  } catch (error) {
    next(error);
  }
};

exports.contribute = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { valor, tipo } = req.body;
    
    const goal = await Goal.findById(id);
    if (!goal) return res.status(404).json({ success: false, message: 'Não encontrado.' });

    const novoValor = Number((goal.valorAtual + valor).toFixed(2));
    const novoAporte = {
      id: `ap-${Date.now()}`,
      valor,
      data: new Date().toISOString().split('T')[0],
      tipo: tipo || 'aporte'
    };

    const aportesAtualizados = [...goal.aportes, novoAporte];
    const updated = await Goal.findByIdAndUpdate(id, { valorAtual: novoValor, aportes: aportesAtualizados });

    res.status(201).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

exports.redeem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { valor } = req.body;
    
    const goal = await Goal.findById(id);
    if (!goal) return res.status(404).json({ success: false, message: 'Não encontrado.' });

    const novoValor = Math.max(0, Number((goal.valorAtual - valor).toFixed(2)));
    const novoAporte = {
      id: `ap-${Date.now()}`,
      valor,
      data: new Date().toISOString().split('T')[0],
      tipo: 'resgate'
    };

    const aportesAtualizados = [...goal.aportes, novoAporte];
    const updated = await Goal.findByIdAndUpdate(id, { valorAtual: novoValor, aportes: aportesAtualizados });

    res.status(201).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};
