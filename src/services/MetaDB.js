import { api } from './api';

export const MetaDB = {
  init: async () => {},

  listar: async () => {
    const res = await api.get('/goals');
    return res.data;
  },

  adicionar: async (params) => {
    const res = await api.post('/goals', params);
    return res.data;
  },

  contribuir: async (id, valor, tipo = 'aporte') => {
    const res = await api.post(`/goals/${id}/contribute`, { valor, tipo });
    return res.data;
  },

  resgatar: async (id, valor) => {
    const res = await api.post(`/goals/${id}/redeem`, { valor });
    return res.data;
  },

  remover: async (id) => {
    const res = await api.delete(`/goals/${id}`);
    return res.success;
  },

  editar: async (id, patch) => {
    const res = await api.put(`/goals/${id}`, patch);
    return res.data;
  }
};
