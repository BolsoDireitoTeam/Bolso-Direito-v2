const transactions = []; // Collection

const Transaction = {
  find: async (query = {}) => {
    return transactions.filter(t => {
      let match = true;
      for (const key in query) {
        if (t[key] !== query[key]) match = false;
      }
      return match;
    });
  },
  findById: async (id) => transactions.find(t => t.id === id) || null,
  create: async (data) => {
    const newTx = {
      id: `txn-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      ...data,
      createdAt: new Date(),
    };
    transactions.push(newTx);
    return newTx;
  },
  findByIdAndUpdate: async (id, updateData) => {
    const idx = transactions.findIndex(t => t.id === id);
    if (idx === -1) return null;
    transactions[idx] = { ...transactions[idx], ...updateData, updatedAt: new Date() };
    return transactions[idx];
  },
  findByIdAndDelete: async (id) => {
    const idx = transactions.findIndex(t => t.id === id);
    if (idx === -1) return null;
    const [deleted] = transactions.splice(idx, 1);
    return deleted;
  }
};

module.exports = Transaction;
