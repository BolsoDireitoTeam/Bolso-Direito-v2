const recurrentTransactions = [];

const RecurrentTransaction = {
  find: async (query = {}) => {
    return recurrentTransactions.filter(r => {
      let match = true;
      for (const key in query) {
        if (r[key] !== query[key]) match = false;
      }
      return match;
    });
  },
  findById: async (id) => recurrentTransactions.find(r => r.id === id) || null,
  create: async (data) => {
    const newRecurrent = {
      id: `rec-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      ...data,
      createdAt: new Date(),
    };
    recurrentTransactions.push(newRecurrent);
    return newRecurrent;
  },
  findByIdAndDelete: async (id) => {
    const idx = recurrentTransactions.findIndex(r => r.id === id);
    if (idx === -1) return null;
    const [deleted] = recurrentTransactions.splice(idx, 1);
    return deleted;
  }
};

module.exports = RecurrentTransaction;
