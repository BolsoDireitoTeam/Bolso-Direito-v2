const goals = [];

const Goal = {
  find: async (query = {}) => {
    return goals.filter(g => {
      let match = true;
      for (const key in query) {
        if (g[key] !== query[key]) match = false;
      }
      return match;
    });
  },
  findById: async (id) => goals.find(g => g.id === id) || null,
  create: async (data) => {
    const newGoal = {
      id: `goal-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      ...data,
      valorAtual: data.valorAtual || 0,
      aportes: data.aportes || [],
      createdAt: new Date(),
    };
    goals.push(newGoal);
    return newGoal;
  },
  findByIdAndUpdate: async (id, updateData) => {
    const idx = goals.findIndex(g => g.id === id);
    if (idx === -1) return null;
    goals[idx] = { ...goals[idx], ...updateData, updatedAt: new Date() };
    return goals[idx];
  },
  findByIdAndDelete: async (id) => {
    const idx = goals.findIndex(g => g.id === id);
    if (idx === -1) return null;
    const [deleted] = goals.splice(idx, 1);
    return deleted;
  }
};

module.exports = Goal;
