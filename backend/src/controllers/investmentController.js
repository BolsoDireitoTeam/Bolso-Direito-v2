const Investment = require('../models/investmentModel');

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

exports.getAll = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'];
    const invs = await Investment.find({ userId });

    let totalInvestido = 0;
    let montanteTotal = 0;

    const data = invs.map(inv => {
      const { montante, rendimento, totalAportado } = calcularValorAcumulado(inv);
      totalInvestido += totalAportado;
      montanteTotal += montante;
      return { ...inv, montante, rendimento, totalAportado };
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
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const inv = await Investment.findById(id);
    if (!inv) return res.status(404).json({ success: false, message: 'Investimento não encontrado.' });
    
    const calculo = calcularValorAcumulado(inv);
    res.status(200).json({ success: true, data: { ...inv, ...calculo } });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'];
    const novoInv = await Investment.create({ ...req.body, userId });
    res.status(201).json({ success: true, data: novoInv });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Investment.findByIdAndUpdate(id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Não encontrado.' });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Investment.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Não encontrado.' });
    res.status(200).json({ success: true, message: 'Removido com sucesso.' });
  } catch (error) {
    next(error);
  }
};

exports.addAporte = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { valor, data } = req.body;
    
    const inv = await Investment.findById(id);
    if (!inv) return res.status(404).json({ success: false, message: 'Não encontrado.' });

    const novoAporte = {
      id: `ap-${Date.now()}`,
      valor: parseFloat(valor) || 0,
      data: data || new Date().toISOString().split('T')[0]
    };

    const aportesAtualizados = [...inv.aportes, novoAporte];
    const updated = await Investment.findByIdAndUpdate(id, { aportes: aportesAtualizados });

    res.status(201).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};
