const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  nome: {
    type: String,
    required: [true, 'O nome da categoria é obrigatório.'],
    trim: true,
  },
  cor: {
    type: String,
    default: '#ACB6E5', // Cor padrão
  },
  icone: {
    type: String,
    default: 'bi-tag', // Ícone padrão
  },
  isDefault: {
    type: Boolean,
    default: false, // Serve para indicar que é uma daquelas categorias base que o sistema gerou
  },
  orcamento: {
    type: Number,
    default: 0, // Orçamento mensal por categoria (0 = sem limite definido)
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Category', categorySchema);
