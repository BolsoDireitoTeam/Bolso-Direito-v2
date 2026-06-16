const Goal = require('../models/goalModel');
const User = require('../models/userModel');

// Helper para atualizar saldo do usuário
async function _atualizarSaldo(userId, delta) {
  if (!userId || delta === 0) return;
  const user = await User.findById(userId);
  if (!user) return;
  const saldoAtual = user.financeiro?.saldo || 0;
  await User.findByIdAndUpdate(userId, {
    'financeiro.saldo': Number((saldoAtual + delta).toFixed(2))
  });
}

exports.getAll = async (req, res) => {
  try {
    const userId = req.user;
    const goals = await Goal.find({ userId });
    res.status(200).json({ success: true, data: goals });
  } catch (error) {
    throw error;
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user;
    const goal = await Goal.findOne({ _id: id, userId });
    if (!goal) return res.status(404).json({ success: false, message: 'Meta não encontrada.' });
    res.status(200).json({ success: true, data: goal });
  } catch (error) {
    throw error;
  }
};

exports.create = async (req, res) => {
  try {
    const userId = req.user;
    const { aporteInicial, ...resto } = req.body;

    const newGoal = await Goal.create({ ...resto, userId, valorAtual: 0, aportes: [] });

    // Se houver aporte inicial, desconta do saldo e registra no histórico da meta
    if (aporteInicial && aporteInicial > 0) {
      await _atualizarSaldo(userId, -aporteInicial);
      const novoAporte = {
        valor: aporteInicial,
        data: new Date().toISOString().split('T')[0],
        tipo: 'aporte'
      };
      await Goal.findByIdAndUpdate(newGoal._id, {
        valorAtual: aporteInicial,
        $push: { aportes: novoAporte }
      });
    }

    const goalAtualizada = await Goal.findById(newGoal._id);
    res.status(201).json({ success: true, data: goalAtualizada });
  } catch (error) {
    throw error;
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user;
    const updated = await Goal.findOneAndUpdate({ _id: id, userId }, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Não encontrado.' });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    throw error;
  }
};

exports.delete = async (req, res) => {
  try {
    const userId = req.user;
    const { id } = req.params;
    const goal = await Goal.findOne({ _id: id, userId });
    if (!goal) return res.status(404).json({ success: false, message: 'Não encontrado.' });

    // Se a meta tinha saldo acumulado, resgata de volta ao saldo do usuário
    if (goal.valorAtual > 0) {
      await _atualizarSaldo(userId, +goal.valorAtual);
    }

    await Goal.findOneAndDelete({ _id: id, userId });
    res.status(200).json({ success: true, message: 'Meta excluída e saldo resgatado.' });
  } catch (error) {
    throw error;
  }
};

exports.contribute = async (req, res) => {
  try {
    const userId = req.user;
    const { id } = req.params;
    const { valor, tipo } = req.body;

    const goal = await Goal.findOne({ _id: id, userId });
    if (!goal) return res.status(404).json({ success: false, message: 'Não encontrado.' });

    // Debita do saldo do usuário
    await _atualizarSaldo(userId, -valor);

    const novoValor = Number((goal.valorAtual + valor).toFixed(2));
    const novoAporte = {
      valor,
      data: new Date().toISOString().split('T')[0],
      tipo: tipo || 'aporte'
    };

    const updated = await Goal.findOneAndUpdate({ _id: id, userId }, { valorAtual: novoValor, $push: { aportes: novoAporte } }, { new: true });

    res.status(201).json({ success: true, data: updated });
  } catch (error) {
    throw error;
  }
};

exports.redeem = async (req, res) => {
  try {
    const userId = req.user;
    const { id } = req.params;
    const { valor } = req.body;

    const goal = await Goal.findOne({ _id: id, userId });
    if (!goal) return res.status(404).json({ success: false, message: 'Não encontrado.' });

    if (valor > goal.valorAtual) {
      return res.status(400).json({ success: false, message: 'Valor excede o disponível na meta.' });
    }

    // Credita de volta ao saldo do usuário
    await _atualizarSaldo(userId, +valor);

    const novoValor = Number((goal.valorAtual - valor).toFixed(2));
    const novoAporte = {
      valor,
      data: new Date().toISOString().split('T')[0],
      tipo: 'resgate'
    };

    const updated = await Goal.findOneAndUpdate({ _id: id, userId }, { valorAtual: novoValor, $push: { aportes: novoAporte } }, { new: true });

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    throw error;
  }
};
