const users = [
  {
    id: 'demo-user-123',
    nome: 'Usuário Demo',
    email: 'demo@bolsodireito.com.br',
    senha: '123',
    financeiro: { saldo: 0, diaVencimentoCartao: null, limiteCartao: 0, plano: 'gratuito' },
    createdAt: new Date(),
  }
]; // Simula a collection do MongoDB

const User = {
  find: async () => users,
  findById: async (id) => users.find(u => u.id === id) || null,
  findOne: async (query) => {
    // Simples simulação do findOne do mongoose (ex: por username ou email)
    return users.find(u => {
      let match = true;
      for (const key in query) {
        if (u[key] !== query[key]) match = false;
      }
      return match;
    }) || null;
  },
  create: async (data) => {
    const newUser = {
      id: `usr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      ...data,
      financeiro: data.financeiro || null,
      createdAt: new Date(),
    };
    users.push(newUser);
    return newUser;
  },
  findByIdAndUpdate: async (id, updateData, options = {}) => {
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return null;

    users[idx] = { ...users[idx], ...updateData, updatedAt: new Date() };
    return users[idx];
  }
};

module.exports = User;
