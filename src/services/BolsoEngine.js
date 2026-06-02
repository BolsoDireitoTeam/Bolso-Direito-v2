import { api } from './api';
import { BolsoDB } from './BolsoDB';

export const BolsoEngine = {
  virar_mes: async ({ mesAlvo, dataRef } = {}) => {
    // Agora o motor financeiro roda no backend
    const res = await api.post('/engine/virar-mes', { mesAlvo, dataRef });
    return res.data; // Retorna o relatório { saldoAntes, totalGanhos, ... }
  },

  calcularAlertas: async () => {
    // O cálculo de alertas poderia virar um endpoint, mas para manter rápido
    // e já que temos os dados locais do BolsoDB via Redux state:
    // Redux selectors (financeSlice) já fazem isso hoje usando o BolsoEngine antigo.
    // Para simplificar, como o state Redux já pega faturas e ganhosMensais, 
    // farei o cálculo aqui recebendo esses dados se não for um endpoint.
    // Mas wait, BolsoEngine original chamava BolsoDB síncrono.
    // Se BolsoDB agora é async, calcularAlertas que era síncrono no selector 
    // (createSelector no financeSlice) vai quebrar!
    // A melhor saída: não exportar `calcularAlertas` e colocar a lógica direto no selector.
  }
};
