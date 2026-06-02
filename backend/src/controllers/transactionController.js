const Transaction = require('../models/transactionModel');
const User = require('../models/userModel');

// Helpers internos para gerenciar saldo e faturas
// Em uma aplicação real no Mongoose, usaríamos Sessions e Transactions para atomicidade.

function calcularMesFatura(dataBase, offsetMeses) {
  const d = new Date(dataBase + 'T00:00:00');
  d.setMonth(d.getMonth() + offsetMeses);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${yyyy}-${mm}`;
}

exports.getAll = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'];
    // Busca transações que não são parcelas futuras de faturas pendentes, 
    // ou apenas lista todas que pertencem ao usuário.
    const transacoes = await Transaction.find({ userId, isInvoiceItem: undefined });
    res.status(200).json({ success: true, data: transacoes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'];
    const { tipo, subtipo, nome, valor, categoria, parcelas, data } = req.body;
    
    if (!userId) return res.status(401).json({ success: false, message: 'Usuário não informado.' });
    
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });

    let novoSaldo = user.financeiro?.saldo || 0;
    const numParcelas = parseInt(parcelas, 10) || 1;

    // Lógica principal inspirada no BolsoDB.js
    if (tipo === 'ganho') {
      novoSaldo += valor;
      const t = await Transaction.create({ userId, tipo, nome, valor, data: data || new Date().toISOString().slice(0, 10) });
      await User.findByIdAndUpdate(userId, { financeiro: { ...user.financeiro, saldo: novoSaldo } });
      return res.status(201).json({ success: true, data: t });
    }

    if (tipo === 'gasto' && subtipo === 'debito') {
      novoSaldo -= valor;
      const t = await Transaction.create({ userId, tipo, subtipo, nome, valor, categoria, data: data || new Date().toISOString().slice(0, 10) });
      await User.findByIdAndUpdate(userId, { financeiro: { ...user.financeiro, saldo: novoSaldo } });
      return res.status(201).json({ success: true, data: t });
    }

    if (tipo === 'gasto' && subtipo === 'credito') {
      // Saldo não muda agora.
      const valorParcela = Number((valor / numParcelas).toFixed(2));
      const parentId = `parent-${Date.now()}`;
      
      const criadas = [];
      for (let i = 1; i <= numParcelas; i++) {
        const mesFatura = calcularMesFatura(data || new Date().toISOString().slice(0, 10), i);
        const t = await Transaction.create({
          userId,
          tipo,
          subtipo,
          nome,
          valor: valorParcela,
          categoria,
          parcela: i,
          totalParcelas: numParcelas,
          dataCompra: data,
          mesFatura,
          isInvoiceItem: true, // Flag para não misturar com as transações diárias normais até a virada de mês
          parentId
        });
        criadas.push(t);
      }
      return res.status(201).json({ success: true, data: criadas, message: 'Faturas geradas com sucesso.' });
    }

    res.status(400).json({ success: false, message: 'Tipo de transação inválido.' });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.headers['x-user-id'];

    const tx = await Transaction.findById(id);
    if (!tx || tx.userId !== userId) return res.status(404).json({ success: false, message: 'Transação não encontrada.' });

    const user = await User.findById(userId);
    let novoSaldo = user.financeiro?.saldo || 0;

    // Estorno do saldo
    if (tx.tipo === 'ganho') {
      novoSaldo -= tx.valor;
    } else if (tx.tipo === 'gasto' && tx.subtipo === 'debito') {
      novoSaldo += tx.valor;
    }

    await User.findByIdAndUpdate(userId, { financeiro: { ...user.financeiro, saldo: novoSaldo } });
    await Transaction.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: 'Transação removida com sucesso.' });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// FATURAS (Invoices)
// ==========================================

exports.getInvoices = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'];
    const invoices = await Transaction.find({ userId, isInvoiceItem: true });
    
    // Agrupa por mesFatura
    const grouped = invoices.reduce((acc, curr) => {
      if (!acc[curr.mesFatura]) acc[curr.mesFatura] = [];
      acc[curr.mesFatura].push(curr);
      return acc;
    }, {});

    res.status(200).json({ success: true, data: grouped });
  } catch (error) {
    next(error);
  }
};

exports.getInvoiceByMonth = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'];
    const { mesAno } = req.params;
    
    const invoices = await Transaction.find({ userId, isInvoiceItem: true, mesFatura: mesAno });
    res.status(200).json({ success: true, data: invoices });
  } catch (error) {
    next(error);
  }
};
