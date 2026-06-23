const mongoose = require('mongoose');

const recurrentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  tipo: {
    type: String,
    required: [true, 'O tipo é obrigatório.'],
    enum: ['ganho', 'gasto'],
  },
  nome: {
    type: String,
    required: [true, 'O nome é obrigatório.'],
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
}, {
  timestamps: true,
});

const RecurrentTransaction = mongoose.model('RecurrentTransaction', recurrentSchema);

module.exports = RecurrentTransaction;
