import { createSlice, createAsyncThunk, createSelector, createEntityAdapter } from '@reduxjs/toolkit'
import { api } from '../../services/api'

// ─────────────────────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────────────────────

async function _snapshotFinance() {
  const res = await api.get('/users/full-state');
  return res.data.data || res.data;
}

// ─────────────────────────────────────────────────────────────
//  Async Thunks — Chamam os Services e retornam dados pro Redux
// ─────────────────────────────────────────────────────────────

export const initFinance = createAsyncThunk('finance/init', async () => {
  return await _snapshotFinance()
})

export const adicionarGanho = createAsyncThunk('finance/adicionarGanho', async (params) => {
  await api.post('/transactions', { ...params, tipo: 'ganho' })
  const snapshot = await _snapshotFinance()
  return { ...snapshot }
})

export const removerGanho = createAsyncThunk('finance/removerGanho', async (id) => {
  await api.delete(`/transactions/${id}`)
  const snapshot = await _snapshotFinance()
  return { ...snapshot }
})

export const adicionarGanhoMensal = createAsyncThunk('finance/adicionarGanhoMensal', async (params) => {
  await api.post('/recurrent', { ...params, tipo: 'ganho' })
  const snapshot = await _snapshotFinance()
  return { ...snapshot }
})

export const removerGanhoMensal = createAsyncThunk('finance/removerGanhoMensal', async (id) => {
  await api.delete(`/recurrent/${id}`)
  const snapshot = await _snapshotFinance()
  return { ...snapshot }
})

export const adicionarGasto = createAsyncThunk('finance/adicionarGasto', async (params) => {
  await api.post('/transactions', { ...params, tipo: 'gasto' })
  const snapshot = await _snapshotFinance()
  return { ...snapshot }
})

export const removerGastoDebito = createAsyncThunk('finance/removerGastoDebito', async (id) => {
  await api.delete(`/transactions/${id}`)
  const snapshot = await _snapshotFinance()
  return { ...snapshot }
})

export const removerGastoCredito = createAsyncThunk('finance/removerGastoCredito', async (gastoId) => {
  await api.delete(`/transactions/${gastoId}`)
  const snapshot = await _snapshotFinance()
  return { ...snapshot }
})

export const editarTransacao = createAsyncThunk('finance/editarTransacao', async ({ id, dadosAtualizados }) => {
  await api.put(`/transactions/${id}`, dadosAtualizados)
  const snapshot = await _snapshotFinance()
  return { ...snapshot }
})

export const adicionarGastoMensal = createAsyncThunk('finance/adicionarGastoMensal', async (params) => {
  await api.post('/recurrent', { ...params, tipo: 'gasto' })
  const snapshot = await _snapshotFinance()
  return { ...snapshot }
})

export const removerGastoMensal = createAsyncThunk('finance/removerGastoMensal', async (id) => {
  await api.delete(`/recurrent/${id}`)
  const snapshot = await _snapshotFinance()
  return { ...snapshot }
})

export const virarMes = createAsyncThunk('finance/virarMes', async (opcoes) => {
  const res = await api.post('/engine/virar-mes', opcoes)
  const snapshot = await _snapshotFinance()
  return { resultado: res.data, ...snapshot }
})

export const resetarDados = createAsyncThunk('finance/resetarDados', async () => {
  // await api.post('/engine/reset', {}) // Not implemented in backend yet, ignore for now
  return await _snapshotFinance()
})

export const salvarConfiguracoes = createAsyncThunk('finance/salvarConfiguracoes', async (patch) => {
  const res = await api.put('/users/finance', patch)
  return { configuracoes: res.data.data?.financeiro || res.data.financeiro }
})

// ─────────────────────────────────────────────────────────────
//  Slice
// ─────────────────────────────────────────────────────────────

export const transacoesAdapter = createEntityAdapter({
  selectId: (tx) => tx.id ?? tx._id,
  sortComparer: (a, b) => new Date(b.data || b.createdAt) - new Date(a.data || a.createdAt),
})

const initialState = transacoesAdapter.getInitialState({
  saldo: 0,
  faturas: {},
  ganhosMensais: [],
  gastosMensais: [],
  configuracoes: {},
  initialized: false,
  status: 'idle',
  error: null,
})

function applySnapshot(state, action) {
  const { saldo, transacoes, estado, configuracoes } = action.payload
  if (saldo !== undefined) state.saldo = saldo
  if (transacoes) {
    // Normaliza _id → id para que todo o front-end use tx.id de forma consistente
    const normalized = transacoes.map(tx => ({
      ...tx,
      id: tx.id || tx._id,
    }))
    transacoesAdapter.setAll(state, normalized)
  }
  if (estado) {
    state.faturas = estado.faturas ?? {}
    state.ganhosMensais = estado.ganhosMensais ?? []
    state.gastosMensais = estado.gastosMensais ?? []
  }
  if (configuracoes) state.configuracoes = configuracoes
}

const financeSlice = createSlice({
  name: 'finance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(initFinance.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(initFinance.fulfilled, (state, action) => {
        applySnapshot(state, action)
        state.initialized = true
        state.status = 'succeeded'
      })
      .addCase(initFinance.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(salvarConfiguracoes.fulfilled, (state, action) => {
        state.configuracoes = action.payload.configuracoes
      })
      .addMatcher(
        (action) => action.type === 'finance/crossSync',
        applySnapshot
      )
      .addMatcher(
        (a) => a.type.startsWith('finance/') && a.type.endsWith('/pending') && a.type !== 'finance/init/pending',
        (state) => { state.status = 'loading' }
      )
      .addMatcher(
        (action) => action.type.startsWith('finance/') && action.type.endsWith('/fulfilled') && action.type !== 'finance/init/fulfilled' && action.type !== 'finance/salvarConfiguracoes/fulfilled',
        (state, action) => {
          applySnapshot(state, action)
          state.status = 'succeeded'
        }
      )
      .addMatcher(
        (a) => a.type.startsWith('finance/') && a.type.endsWith('/rejected'),
        (state, action) => {
          state.status = 'failed'
          state.error = action.error?.message ?? 'Erro desconhecido'
        }
      )
  },
})

export default financeSlice.reducer

// ─────────────────────────────────────────────────────────────
//  Selectors
// ─────────────────────────────────────────────────────────────

const financeSelectors = transacoesAdapter.getSelectors((state) => state.finance)

export const selectTransacoes = financeSelectors.selectAll
export const selectTransacaoById = financeSelectors.selectById

export const selectSaldo = (state) => state.finance.saldo
export const selectFaturas = (state) => state.finance.faturas
export const selectGanhosMensais = (state) => state.finance.ganhosMensais
export const selectGastosMensais = (state) => state.finance.gastosMensais
export const selectConfiguracoes = (state) => state.finance.configuracoes
export const selectFinanceInitialized = (state) => state.finance.initialized
export const selectFinanceStatus = (state) => state.finance.status
export const selectFinanceError = (state) => state.finance.error

// Utilitários
export const TIPOS_GASTO = ['debito', 'credito', 'fixo_mensal']

export const selectDespesasPorCategoria = createSelector(
  [selectTransacoes],
  (transacoes) => {
    const despesas = transacoes.filter((t) => t.tipo === 'gasto' && !t.isInvoiceItem)
    const mapa = {}
    despesas.forEach((d) => {
      const cat = d.categoria || 'Outros'
      mapa[cat] = (mapa[cat] || 0) + d.valor
    })
    return Object.entries(mapa)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }
)

export const selectTransacoesMesAtual = createSelector(
  [selectTransacoes, (_state, mesAnoFiltro) => mesAnoFiltro],
  (transacoes, mesAnoFiltro) => transacoes.filter(tx => tx.data && tx.data.startsWith(mesAnoFiltro))
)

export const selectReceitasMes = createSelector(
  [selectTransacoesMesAtual],
  (txMes) => txMes.filter(tx => tx.tipo === 'ganho').reduce((acc, tx) => acc + tx.valor, 0)
)

export const selectDespesasMes = createSelector(
  [selectTransacoesMesAtual],
  (txMes) => txMes.filter(tx => tx.tipo === 'gasto').reduce((acc, tx) => acc + tx.valor, 0)
)

export const selectTotalFatura = createSelector(
  [selectFaturas, (_state, mesAnoFiltro) => mesAnoFiltro],
  (faturas, mesAnoFiltro) => {
    const itens = faturas[mesAnoFiltro] ?? []
    return Number(itens.reduce((acc, p) => acc + (p.valorParcela || p.valor), 0).toFixed(2))
  }
)

export const selectAlertas = createSelector(
  [selectSaldo, selectGanhosMensais, selectFaturas],
  (saldo, ganhosMensais, faturas) => {
    const LIMITE_ATENCAO_PCT = 0.70;
    const LIMITE_RISCO_PCT = 1.00;
    
    const totalGanhosMensais = ganhosMensais.reduce((acc, g) => acc + g.valor, 0);
    const capacidade = Number((saldo + totalGanhosMensais).toFixed(2));
    const alertas = [];
    
    const meses = Object.keys(faturas).sort();
    
    for (const mes of meses) {
        const itens = faturas[mes] ?? [];
        const totalFatura = Number(itens.reduce((acc, p) => acc + (p.valorParcela || p.valor), 0).toFixed(2));
        const percentual = capacidade > 0 ? totalFatura / capacidade : Infinity;

        let nivel, mensagem;
        if (percentual >= LIMITE_RISCO_PCT) {
            nivel = 'risco';
            mensagem = `🔴 RISCO: A fatura de ${mes} (R$ ${totalFatura.toFixed(2)}) supera ${(percentual * 100).toFixed(0)}% da sua capacidade (${capacidade}).`;
        } else if (percentual >= LIMITE_ATENCAO_PCT) {
            nivel = 'atencao';
            mensagem = `🟡 ATENÇÃO: A fatura de ${mes} (R$ ${totalFatura.toFixed(2)}) representa ${(percentual * 100).toFixed(0)}% da sua capacidade.`;
        } else {
            nivel = 'ok';
            mensagem = `🟢 OK: Fatura de ${mes} (R$ ${totalFatura.toFixed(2)}) segura.`;
        }
        alertas.push({ mesAno: mes, totalFatura, capacidade, percentual, nivel, mensagem });
    }
    return alertas;
  }
)

export const getTotalFatura = (state, mesAnoFiltro) => selectTotalFatura(state, mesAnoFiltro)

export const selectGastosPorCategoria = createSelector(
  [selectTransacoesMesAtual],
  (txMes) => {
    const mapa = {}
    txMes.filter(tx => tx.tipo === 'gasto' && tx.categoria).forEach(tx => {
      mapa[tx.categoria] = (mapa[tx.categoria] || 0) + tx.valor
    })
    return mapa
  }
)

