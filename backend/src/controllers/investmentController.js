const Investment = require('../models/investmentModel');
const User = require('../models/userModel');

// Calculo centralizado no backend (Service)
function calcularValorAcumulado(inv, ateData) {
  const dataFim = ateData ? new Date(ateData + 'T12:00:00') : new Date();
  const dataIni = new Date(inv.dataInicio + 'T12:00:00');
  const taxa = inv.taxaMensal || 0;

  function diffMeses(d1, d2) {
    const anos = d2.getFullYear() - d1.getFullYear();
    const meses = d2.getMonth() - d1.getMonth();
    const dias = d2.getDate() - d1.getDate();
    return anos * 12 + meses + (dias / 30);
  }

  const mesesTotal = diffMeses(dataIni, dataFim);
  let montante = inv.valorInicial * Math.pow(1 + taxa, Math.max(0, mesesTotal));
  let totalAportado = inv.valorInicial;

  if (inv.aportes && inv.aportes.length > 0) {
    inv.aportes.forEach(ap => {
      const dataAporte = new Date(ap.data + 'T12:00:00');
      const mesesAporte = diffMeses(dataAporte, dataFim);
      montante += ap.valor * Math.pow(1 + taxa, Math.max(0, mesesAporte));
      totalAportado += ap.valor;
    });
  }

  return {
    montante: Number(montante.toFixed(2)),
    rendimento: Number((montante - totalAportado).toFixed(2)),
    totalAportado: Number(totalAportado.toFixed(2))
  };
}

exports.getAll = async (req, res) => {
  try {
    const userId = req.user;
    const invs = await Investment.find({ userId });

    let totalInvestido = 0;
    let montanteTotal = 0;

    const data = invs.map(inv => {
      const invObj = inv.toObject();
      const { montante, rendimento, totalAportado } = calcularValorAcumulado(invObj);
      totalInvestido += totalAportado;
      montanteTotal += montante;
      return { ...invObj, montante, rendimento, totalAportado };
    });

    res.status(200).json({ 
      success: true, 
      data,
      totais: {
        totalInvestido: Number(totalInvestido.toFixed(2)),
        montanteTotal: Number(montanteTotal.toFixed(2)),
        rendimentoTotal: Number((montanteTotal - totalInvestido).toFixed(2))
      }
    });
  } catch (error) {
    throw error;
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user;
    const inv = await Investment.findOne({ _id: id, userId });
    if (!inv) return res.status(404).json({ success: false, message: 'Investimento não encontrado.' });
    
    const invObj = inv.toObject();
    const calculo = calcularValorAcumulado(invObj);
    res.status(200).json({ success: true, data: { ...invObj, ...calculo } });
  } catch (error) {
    throw error;
  }
};

exports.create = async (req, res) => {
  try {
    const userId = req.user;
    const { valorInicial } = req.body;
    
    if (valorInicial && userId) {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
      
      const saldoAtual = user.financeiro?.saldo || 0;
      if (saldoAtual < valorInicial) {
        return res.status(400).json({ success: false, message: 'Saldo insuficiente para este investimento inicial.' });
      }
      
      await User.findByIdAndUpdate(userId, { 'financeiro.saldo': Number((saldoAtual - valorInicial).toFixed(2)) });
    }

    const novoInv = await Investment.create({ ...req.body, userId });
    res.status(201).json({ success: true, data: novoInv });
  } catch (error) {
    throw error;
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user;
    const updated = await Investment.findOneAndUpdate({ _id: id, userId }, req.body, { returnDocument: 'after', runValidators: true });
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
    const inv = await Investment.findOne({ _id: id, userId });
    if (!inv) return res.status(404).json({ success: false, message: 'Não encontrado.' });

    // Calcula o montante acumulado e credita de volta ao saldo do usuário
    const invObj = inv.toObject();
    const { montante } = calcularValorAcumulado(invObj);
    if (montante > 0 && userId) {
      const user = await User.findById(userId);
      if (user) {
        const saldoAtual = user.financeiro?.saldo || 0;
        await User.findByIdAndUpdate(userId, { 'financeiro.saldo': Number((saldoAtual + montante).toFixed(2)) });
      }
    }

    await Investment.findOneAndDelete({ _id: id, userId });
    res.status(200).json({ success: true, message: 'Investimento resgatado com sucesso.', montanteResgatado: montante });
  } catch (error) {
    throw error;
  }
};

exports.addAporte = async (req, res) => {
  try {
    const userId = req.user;
    const { id } = req.params;
    const { valor, data } = req.body;
    const valorNum = parseFloat(valor) || 0;
    
    const inv = await Investment.findOne({ _id: id, userId });
    if (!inv) return res.status(404).json({ success: false, message: 'Não encontrado.' });

    // Debita o valor do saldo do usuário
    if (valorNum > 0 && userId) {
      const user = await User.findById(userId);
      if (user) {
        const saldoAtual = user.financeiro?.saldo || 0;
        if (saldoAtual < valorNum) {
          return res.status(400).json({ success: false, message: 'Saldo insuficiente para este aporte.' });
        }
        await User.findByIdAndUpdate(userId, { 'financeiro.saldo': Number((saldoAtual - valorNum).toFixed(2)) });
      }
    }

    // Adiciona o aporte ao array usando $push do Mongoose
    const updated = await Investment.findOneAndUpdate(
      { _id: id, userId }, 
      { $push: { aportes: { valor: valorNum, data: data || new Date().toISOString().split('T')[0] } } },
      { returnDocument: 'after' }
    );

    res.status(201).json({ success: true, data: updated });
  } catch (error) {
    throw error;
  }
};
