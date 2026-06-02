import { api } from './api';

const CATEGORIAS = Object.freeze([
    'Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Lazer',
    'Educação', 'Vestuário', 'Assinaturas', 'Poupança', 'Outros',
]);

const TIPOS_GASTO = Object.freeze(['debito', 'credito']);

// Utilitário para buscar todo o estado
async function getFullState() {
  const res = await api.get('/users/full-state');
  return res.data;
}

export const BolsoDB = {
    // ── Setup ──────────────────────────────────────────
    init: async () => {
      // O init apenas checa o server/auth
      return getFullState();
    },
    reset: async () => {
      // não implementado no back por segurança, mas poderíamos limpar tudo
    },
    getFullState,

    // ── Ganhos avulsos ─────────────────────────────────
    adicionarGanho: async (params) => {
      const res = await api.post('/transactions', { ...params, tipo: 'ganho' });
      return res.data;
    },
    removerGanho: async (id) => {
      const res = await api.delete(`/transactions/${id}`);
      return res.success;
    },

    // ── Gastos avulsos ─────────────────────────────────
    adicionarGasto: async (params) => {
      const res = await api.post('/transactions', { ...params, tipo: 'gasto' });
      return res.data;
    },
    removerGastoDebito: async (id) => {
      const res = await api.delete(`/transactions/${id}`);
      return res.success;
    },
    removerGastoCredito: async (gastoId) => {
      // Como o DB cria n faturas, não implementei deletar por parentId, 
      // mas podemos fazer isso futuramente.
    },
    editarTransacao: async (id, dadosAtualizados) => {
      const res = await api.put(`/transactions/${id}`, dadosAtualizados);
      return res.success;
    },

    // ── Recorrentes Mensais ────────────────────────────
    adicionarGanhoMensal: async (params) => {
      const res = await api.post('/recurrent', { ...params, tipo: 'ganho' });
      return res.data;
    },
    removerGanhoMensal: async (id) => {
      const res = await api.delete(`/recurrent/${id}`);
      return res.success;
    },
    adicionarGastoMensal: async (params) => {
      const res = await api.post('/recurrent', { ...params, tipo: 'gasto' });
      return res.data;
    },
    removerGastoMensal: async (id) => {
      const res = await api.delete(`/recurrent/${id}`);
      return res.success;
    },

    // ── Configurações do Sistema ────────────────────────
    salvarConfiguracoes: async (patch) => {
      const res = await api.put('/users/finance', patch);
      return res.data.financeiro;
    },

    // ── Constantes Úteis ───────────────────────────────
    CATEGORIAS,
    TIPOS_GASTO,
};
