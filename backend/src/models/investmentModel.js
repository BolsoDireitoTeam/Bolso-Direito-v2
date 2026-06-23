const mongoose = require('mongoose');

const aporteSchema = new mongoose.Schema({
  valor: { type: Number, required: true },
  data: { type: String, required: true },
}, { _id: true });

const investmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  nome: {
    type: String,
    required: [true, 'O nome do investimento é obrigatório.'],
    trim: true,
  },
  tipo: {
    type: String,
    default: null, // 'CDB', 'Tesouro', 'Ações', etc.
  },
  valorInicial: {
    type: Number,
    required: [true, 'O valor inicial é obrigatório.'],
  },
  taxaMensal: {
    type: Number,
    default: 0,
  },
  dataInicio: {
    type: String,
    required: [true, 'A data de início é obrigatória.'],
  },
  aportes: {
    type: [aporteSchema],
    default: [],
  },
}, {
  timestamps: true,
});

const Investment = mongoose.model('Investment', investmentSchema);

module.exports = Investment;
