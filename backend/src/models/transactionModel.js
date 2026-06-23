const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  tipo: {
    type: String,
    required: [true, 'O tipo da transação é obrigatório.'],
    enum: ['ganho', 'gasto'],
  },
  subtipo: {
    type: String,
    enum: ['debito', 'credito'],
    default: undefined,
  },
  nome: {
    type: String,
    required: [true, 'O nome da transação é obrigatório.'],
    trim: true,
  },
  valor: {
    type: Number,
    required: [true, 'O valor é obrigatório.'],
  },
  categoria: {
    type: String,
    default: null,
  },
  data: {
    type: String,
    default: null,
  },
  parcela: {
    type: Number,
    default: undefined,
  },
  totalParcelas: {
    type: Number,
    default: undefined,
  },
  dataCompra: {
    type: String,
    default: undefined,
  },
  mesFatura: {
    type: String,
    default: undefined,
    index: true,
  },
  isInvoiceItem: {
    type: Boolean,
    default: false,
  },
  parentId: {
    type: String,
    default: undefined,
  },
  origem: {
    type: String,
    default: undefined, // 'mensal', 'fatura', 'meta'
  },
  metaId: {
    type: String,
    default: undefined,
  },
  mesVirada: {
    type: String,
    default: undefined,
  },
}, {
  timestamps: true,
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
