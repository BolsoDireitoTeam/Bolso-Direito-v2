const Goal = require('../models/goalModel');
const User = require('../models/userModel');

// Helper para atualizar saldo do usuário
async function _atualizarSaldo(userId, delta) {
  if (!userId || delta === 0) return;
  const user = await User.findById(userId);
  if (!user) return;
  const saldoAtual = user.financeiro?.saldo || 0;
  await User.findByIdAndUpdate(userId, {
    financeiro: { ...user.financeiro, saldo: Number((saldoAtual + delta).toFixed(2)) }
  });
}

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
    const { aporteInicial, ...resto } = req.body;

    const newGoal = await Goal.create({ ...resto, userId, valorAtual: 0, aportes: [] });

    // Se houver aporte inicial, desconta do saldo e registra no histórico da meta
    if (aporteInicial && aporteInicial > 0) {
      await _atualizarSaldo(userId, -aporteInicial);
      const novoAporte = {
        id: `ap-${Date.now()}`,
        valor: aporteInicial,
        data: new Date().toISOString().split('T')[0],
        tipo: 'aporte'
      };
      await Goal.findByIdAndUpdate(newGoal.id, {
        valorAtual: aporteInicial,
        aportes: [novoAporte]
      });
    }

    const goalAtualizada = await Goal.findById(newGoal.id);
    res.status(201).json({ success: true, data: goalAtualizada });
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
    const userId = req.headers['x-user-id'];
    const { id } = req.params;
    const goal = await Goal.findById(id);
    if (!goal) return res.status(404).json({ success: false, message: 'Não encontrado.' });

    // Se a meta tinha saldo acumulado, resgata de volta ao saldo do usuário
    if (goal.valorAtual > 0) {
      await _atualizarSaldo(userId, +goal.valorAtual);
    }

    await Goal.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Meta excluída e saldo resgatado.' });
  } catch (error) {
    next(error);
  }
};

exports.contribute = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'];
    const { id } = req.params;
    const { valor, tipo } = req.body;

    const goal = await Goal.findById(id);
    if (!goal) return res.status(404).json({ success: false, message: 'Não encontrado.' });

    // Debita do saldo do usuário
    await _atualizarSaldo(userId, -valor);

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
    const userId = req.headers['x-user-id'];
    const { id } = req.params;
    const { valor } = req.body;

    const goal = await Goal.findById(id);
    if (!goal) return res.status(404).json({ success: false, message: 'Não encontrado.' });

    if (valor > goal.valorAtual) {
      return res.status(400).json({ success: false, message: 'Valor excede o disponível na meta.' });
    }

    // Credita de volta ao saldo do usuário
    await _atualizarSaldo(userId, +valor);

    const novoValor = Number((goal.valorAtual - valor).toFixed(2));
    const novoAporte = {
      id: `ap-${Date.now()}`,
      valor,
      data: new Date().toISOString().split('T')[0],
      tipo: 'resgate'
    };

    const aportesAtualizados = [...goal.aportes, novoAporte];
    const updated = await Goal.findByIdAndUpdate(id, { valorAtual: novoValor, aportes: aportesAtualizados });

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};
