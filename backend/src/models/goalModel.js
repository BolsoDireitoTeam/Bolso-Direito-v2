const mongoose = require('mongoose');

const aporteSchema = new mongoose.Schema({
  valor: { type: Number, required: true },
  data: { type: String, required: true },
  tipo: { type: String, enum: ['aporte', 'resgate', 'autopilot'], default: 'aporte' },
}, { _id: true });

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  nome: {
    type: String,
    required: [true, 'O nome da meta é obrigatório.'],
    trim: true,
  },
  valorAlvo: {
    type: Number,
    required: [true, 'O valor alvo é obrigatório.'],
  },
  valorAtual: {
    type: Number,
    default: 0,
  },
  prazo: {
    type: String,
    default: null,
  },
  icone: {
    type: String,
    default: null,
  },
  cor: {
    type: String,
    default: null,
  },
  agendamento: {
    ativo: { type: Boolean, default: false },
    valor: { type: Number, default: 0 },
  },
  aportes: {
    type: [aporteSchema],
    default: [],
  },
}, {
  timestamps: true,
});

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal;
