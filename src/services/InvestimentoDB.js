import { api } from './api';

export const InvestimentoDB = {
  init: async () => {
    // A inicialização pode apenas garantir conexão, se quisermos.
    // O getTotais agora vêm com a lista
  },
  
  listar: async () => {
    const res = await api.get('/investments');
    return { investimentos: res.data, totais: res.totais };
  },

  adicionar: async (params) => {
    const res = await api.post('/investments', params);
    return res.data;
  },

  remover: async (id) => {
    const res = await api.delete(`/investments/${id}`);
    return res.success;
  },

  editar: async (id, patch) => {
    const res = await api.put(`/investments/${id}`, patch);
    return res.data;
  },

  aportar: async (id, valor) => {
    const res = await api.post(`/investments/${id}/aportes`, { valor });
    return res.data;
  },

  // O cálculo ainda pode ser exposto aqui pra ser usado pela UI de previsão sem salvar
  calcularValorAcumulado: (inv, ateData) => {
    const dataFim = ateData ? new Date(ateData + 'T12:00:00') : new Date();
    const dataIni = new Date(inv.dataInicio + 'T12:00:00');
    const taxa = inv.taxaMensal || 0;

    function _diffMeses(d1, d2) {
      const anos = d2.getFullYear() - d1.getFullYear();
      const meses = d2.getMonth() - d1.getMonth();
      const dias = d2.getDate() - d1.getDate();
      return anos * 12 + meses + (dias / 30);
    }

    const mesesTotal = _diffMeses(dataIni, dataFim);
    let montante = inv.valorInicial * Math.pow(1 + taxa, Math.max(0, mesesTotal));
    let totalAportado = inv.valorInicial;

    if (inv.aportes && inv.aportes.length > 0) {
      inv.aportes.forEach(ap => {
        const dataAporte = new Date(ap.data + 'T12:00:00');
        const mesesAporte = _diffMeses(dataAporte, dataFim);
        montante += ap.valor * Math.pow(1 + taxa, Math.max(0, mesesAporte));
        totalAportado += ap.valor;
      });
    }

    return {
      montante: Number(montante.toFixed(2)),
      rendimento: Number((montante - totalAportado).toFixed(2)),
      totalAportado: Number(totalAportado.toFixed(2))
    };
  }
};
