const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'O nome é obrigatório.'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'O email é obrigatório.'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  senha: {
    type: String,
    required: [true, 'A senha é obrigatória.'],
    minlength: [6, 'A senha deve ter no mínimo 6 caracteres.'],
    select: false, // Nunca retornado por padrão nas queries
  },
  celular: {
    type: String,
    default: null,
  },
  avatar: {
    type: String,
    default: null,
  },
  financeiro: {
    saldo: { type: Number, default: 0 },
    diaVencimentoCartao: { type: Number, default: null },
    limiteCartao: { type: Number, default: 0 },
    diaViradaMes: { type: Number, default: null },
    diaRecebimentoSalario: { type: Number, default: null },
    ultimoMesProcessado: { type: String, default: null },
    plano: { type: String, default: 'gratuito', enum: ['gratuito', 'premium'] },
  },
}, {
  timestamps: true,
});

// Hook: Faz hash da senha antes de salvar (somente se foi modificada)
userSchema.pre('save', async function () {
  if (!this.isModified('senha')) return;

  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
});

// Método de instância: compara senha candidata com o hash salvo
userSchema.methods.matchPassword = async function (senhaCandidata) {
  return await bcrypt.compare(senhaCandidata, this.senha);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
