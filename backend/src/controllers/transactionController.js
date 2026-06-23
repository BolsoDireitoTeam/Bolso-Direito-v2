const Transaction = require('../models/transactionModel');
const User = require('../models/userModel');

// Helpers internos para gerenciar saldo e faturas

function calcularMesFatura(dataBase, offsetMeses) {
  const d = new Date(dataBase + 'T00:00:00');
  d.setMonth(d.getMonth() + offsetMeses);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${yyyy}-${mm}`;
}

exports.getAll = async (req, res) => {
  try {
    const userId = req.user;
    // Busca transações que não são itens de fatura
    const transacoes = await Transaction.find({ userId, isInvoiceItem: { $ne: true } }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: transacoes });
  } catch (error) {
    throw error;
  }
};

exports.create = async (req, res) => {
  try {
    const userId = req.user;
    const { tipo, subtipo, nome, valor, categoria, parcelas, data } = req.body;
    
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });

    let novoSaldo = user.financeiro?.saldo || 0;
    const numParcelas = parseInt(parcelas, 10) || 1;

    // Lógica principal inspirada no BolsoDB.js
    if (tipo === 'ganho') {
      novoSaldo += valor;
      const t = await Transaction.create({ userId, tipo, nome, valor, data: data || new Date().toISOString().slice(0, 10) });
      await User.findByIdAndUpdate(userId, { 'financeiro.saldo': novoSaldo });
      return res.status(201).json({ success: true, data: t });
    }

    if (tipo === 'gasto' && subtipo === 'debito') {
      novoSaldo -= valor;
      const t = await Transaction.create({ userId, tipo, subtipo, nome, valor, categoria, data: data || new Date().toISOString().slice(0, 10) });
      await User.findByIdAndUpdate(userId, { 'financeiro.saldo': novoSaldo });
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
          isInvoiceItem: true,
          parentId
        });
        criadas.push(t);
      }
      return res.status(201).json({ success: true, data: criadas, message: 'Faturas geradas com sucesso.' });
    }

    res.status(400).json({ success: false, message: 'Tipo de transação inválido.' });
  } catch (error) {
    throw error;
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user;
    const { nome, valor, categoria, data } = req.body;

    const tx = await Transaction.findById(id);
    if (!tx || tx.userId.toString() !== userId) {
      return res.status(404).json({ success: false, message: 'Transação não encontrada.' });
    }

    // Atualiza saldo se o valor mudou (só para ganho e gasto-débito)
    if (valor !== undefined && valor !== tx.valor) {
      const user = await User.findById(userId);
      let novoSaldo = user.financeiro?.saldo || 0;

      if (tx.tipo === 'ganho') {
        novoSaldo = novoSaldo - tx.valor + valor;
      } else if (tx.tipo === 'gasto' && tx.subtipo === 'debito') {
        novoSaldo = novoSaldo + tx.valor - valor;
      }

      await User.findByIdAndUpdate(userId, { 'financeiro.saldo': novoSaldo });
    }

    const campos = {};
    if (nome !== undefined) campos.nome = nome;
    if (valor !== undefined) campos.valor = valor;
    if (categoria !== undefined) campos.categoria = categoria;
    if (data !== undefined) campos.data = data;

    const atualizada = await Transaction.findByIdAndUpdate(id, campos, { new: true });
    return res.status(200).json({ success: true, data: atualizada });
  } catch (error) {
    throw error;
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user;

    const tx = await Transaction.findById(id);
    if (!tx || tx.userId.toString() !== userId) return res.status(404).json({ success: false, message: 'Transação não encontrada.' });

    const user = await User.findById(userId);
    let novoSaldo = user.financeiro?.saldo || 0;

    // Estorno do saldo
    if (tx.tipo === 'ganho') {
      novoSaldo -= tx.valor;
    } else if (tx.tipo === 'gasto' && tx.subtipo === 'debito') {
      novoSaldo += tx.valor;
    }

    await User.findByIdAndUpdate(userId, { 'financeiro.saldo': novoSaldo });
    await Transaction.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: 'Transação removida com sucesso.' });
  } catch (error) {
    throw error;
  }
};

// ==========================================
// FATURAS (Invoices)
// ==========================================

exports.getInvoices = async (req, res) => {
  try {
    const userId = req.user;
    const invoices = await Transaction.find({ userId, isInvoiceItem: true });
    
    // Agrupa por mesFatura
    const grouped = invoices.reduce((acc, curr) => {
      const doc = curr.toObject();
      if (!acc[doc.mesFatura]) acc[doc.mesFatura] = [];
      acc[doc.mesFatura].push(doc);
      return acc;
    }, {});

    res.status(200).json({ success: true, data: grouped });
  } catch (error) {
    throw error;
  }
};

exports.getInvoiceByMonth = async (req, res) => {
  try {
    const userId = req.user;
    const { mesAno } = req.params;
    
    const invoices = await Transaction.find({ userId, isInvoiceItem: true, mesFatura: mesAno });
    res.status(200).json({ success: true, data: invoices });
  } catch (error) {
    throw error;
  }
};

// ==========================================
// IMPORTAÇÃO EM LOTE (Batch Import)
// ==========================================

exports.importBatch = async (req, res) => {
  try {
    const userId = req.user;
    const { transacoes } = req.body;

    if (!transacoes || !Array.isArray(transacoes) || transacoes.length === 0) {
      return res.status(400).json({ success: false, message: 'Nenhuma transação para importar.' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });

    let saldoDelta = 0;
    const criadas = [];

    for (const tx of transacoes) {
      try {
        const { tipo, subtipo, nome, valor, categoria, data, parcelas } = tx;
        const numParcelas = parseInt(parcelas, 10) || 1;

        if (tipo === 'ganho') {
          saldoDelta += valor;
          const t = await Transaction.create({
            userId, tipo, nome, valor,
            data: data || new Date().toISOString().slice(0, 10),
          });
          criadas.push(t);
        } else if (tipo === 'gasto' && (subtipo === 'credito')) {
          // Compras no crédito: geram parcelas na fatura
          const valorParcela = Number((valor / numParcelas).toFixed(2));
          const parentId = `parent-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

          for (let i = 1; i <= numParcelas; i++) {
            const mesFatura = calcularMesFatura(data || new Date().toISOString().slice(0, 10), i);
            const t = await Transaction.create({
              userId, tipo, subtipo, nome,
              valor: valorParcela, categoria,
              parcela: i, totalParcelas: numParcelas,
              dataCompra: data, mesFatura,
              isInvoiceItem: true, parentId,
            });
            criadas.push(t);
          }
        } else {
          // Débito ou default
          saldoDelta -= valor;
          const t = await Transaction.create({
            userId, tipo: 'gasto', subtipo: subtipo || 'debito',
            nome, valor, categoria,
            data: data || new Date().toISOString().slice(0, 10),
          });
          criadas.push(t);
        }
      } catch (err) {
        console.warn('[ImportBatch] Item ignorado:', tx.nome, err.message);
      }
    }

    // Atualiza saldo de uma vez
    if (saldoDelta !== 0) {
      const saldoAtual = user.financeiro?.saldo || 0;
      await User.findByIdAndUpdate(userId, { 'financeiro.saldo': saldoAtual + saldoDelta });
    }

    res.status(201).json({
      success: true,
      message: `${criadas.length} transações importadas com sucesso.`,
      data: { importadas: criadas.length },
    });
  } catch (error) {
    throw error;
  }
};

