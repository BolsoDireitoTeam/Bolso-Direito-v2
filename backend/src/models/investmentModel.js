const investments = [];

const Investment = {
  find: async (query = {}) => {
    return investments.filter(i => {
      let match = true;
      for (const key in query) {
        if (i[key] !== query[key]) match = false;
      }
      return match;
    });
  },
  findById: async (id) => investments.find(i => i.id === id) || null,
  create: async (data) => {
    const newInv = {
      id: `inv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      ...data,
      aportes: data.aportes || [],
      createdAt: new Date(),
    };
    investments.push(newInv);
    return newInv;
  },
  findByIdAndUpdate: async (id, updateData) => {
    const idx = investments.findIndex(i => i.id === id);
    if (idx === -1) return null;
    investments[idx] = { ...investments[idx], ...updateData, updatedAt: new Date() };
    return investments[idx];
  },
  findByIdAndDelete: async (id) => {
    const idx = investments.findIndex(i => i.id === id);
    if (idx === -1) return null;
    const [deleted] = investments.splice(idx, 1);
    return deleted;
  }
};

module.exports = Investment;
