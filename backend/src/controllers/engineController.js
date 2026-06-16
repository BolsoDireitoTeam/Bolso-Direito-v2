const Transaction = require('../models/transactionModel');
const RecurrentTransaction = require('../models/recurrentModel');
const Goal = require('../models/goalModel');
const User = require('../models/userModel');

exports.virarMes = async (req, res) => {
  try {
    const userId = req.user;
    const { mesAlvo, dataRef } = req.body;
    
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });

    let saldoAtual = user.financeiro?.saldo || 0;
    const saldoAntes = saldoAtual;

    const data = dataRef || new Date().toISOString().slice(0, 10);
    const mesVirada = mesAlvo || data.slice(0, 7);

    // 1. Ganhos Mensais
    const ganhos = await RecurrentTransaction.find({ userId, tipo: 'ganho' });
    let totalGanhos = 0;
    for (const g of ganhos) {
      saldoAtual += g.valor;
      totalGanhos += g.valor;
      await Transaction.create({ userId, tipo: 'ganho', origem: 'mensal', nome: g.nome, data, valor: g.valor, mesVirada });
    }

    // 2. Gastos Mensais
    const gastos = await RecurrentTransaction.find({ userId, tipo: 'gasto' });
    let totalGastos = 0;
    for (const g of gastos) {
      saldoAtual -= g.valor;
      totalGastos += g.valor;
      await Transaction.create({ userId, tipo: 'gasto', subtipo: 'debito', origem: 'mensal', nome: g.nome, data, valor: g.valor, categoria: g.categoria, mesVirada });
    }

    // 3. Faturas
    const faturas = await Transaction.find({ userId, isInvoiceItem: true, mesFatura: mesVirada });
    let totalFatura = 0;
    if (faturas.length > 0) {
      totalFatura = faturas.reduce((acc, p) => acc + p.valor, 0);
      saldoAtual -= totalFatura;
      await Transaction.create({
        userId, tipo: 'gasto', subtipo: 'credito', origem: 'fatura', nome: `Fatura ${mesVirada}`, data, valor: totalFatura, categoria: 'Outros', mesVirada
      });
      // Deletar as parcelas que já viraram transação consolidada
      for (const f of faturas) {
        await Transaction.findByIdAndDelete(f._id);
      }
    }

    // 4. Metas (Autopilot)
    const metas = await Goal.find({ userId });
    const agendamentosAtivos = metas.filter(m => m.agendamento && m.agendamento.ativo);
    let totalMetas = 0;

    for (const m of agendamentosAtivos) {
      const valorAporte = m.agendamento.valor;
      if (valorAporte <= 0) continue;
      saldoAtual -= valorAporte;
      totalMetas += valorAporte;
      await Transaction.create({ userId, tipo: 'gasto', subtipo: 'debito', origem: 'meta', nome: `Aporte: ${m.nome}`, data, valor: valorAporte, categoria: 'Poupança', metaId: m._id.toString(), mesVirada });
      
      const novoValor = Number((m.valorAtual + valorAporte).toFixed(2));
      const novoAporte = { valor: valorAporte, data, tipo: 'autopilot' };
      await Goal.findByIdAndUpdate(m._id, { valorAtual: novoValor, $push: { aportes: novoAporte } });
    }

    // 5. Commit
    await User.findByIdAndUpdate(userId, { 'financeiro.saldo': saldoAtual });

    res.status(200).json({
      success: true,
      data: {
        mesAlvo: mesVirada,
        saldoAntes,
        totalGanhos,
        totalGastos,
        totalFatura,
        totalMetas,
        saldoDepois: saldoAtual
      }
    });

  } catch (error) {
    throw error;
  }
};
