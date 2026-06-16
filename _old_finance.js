import { createSlice, createAsyncThunk, createSelector, createEntityAdapter } from '@reduxjs/toolkit'
import { BolsoDB } from '../../services/BolsoDB'
import { BolsoEngine } from '../../services/BolsoEngine'

// ─────────────────────────────────────────────────────────────
//  Async Thunks — Chamam os Services e retornam dados pro Redux
// ─────────────────────────────────────────────────────────────

export const initFinance = createAsyncThunk(
  'finance/init',
  async () => {
    return await BolsoDB.init()
  }
)

export const adicionarGanho = createAsyncThunk(
  'finance/adicionarGanho',
  async (params) => {
    const ganho = await BolsoDB.adicionarGanho(params)
    const snapshot = await BolsoDB.getFullState()
    return { ganho, ...snapshot }
  }
)

export const removerGanho = createAsyncThunk(
  'finance/removerGanho',
  async (id) => {
    const ok = await BolsoDB.removerGanho(id)
    const snapshot = await BolsoDB.getFullState()
    return { ok, ...snapshot }
  }
)

export const adicionarGanhoMensal = createAsyncThunk(
  'finance/adicionarGanhoMensal',
  async (params) => {
    const ganho = await BolsoDB.adicionarGanhoMensal(params)
    const snapshot = await BolsoDB.getFullState()
    return { ganho, ...snapshot }
  }
)

export const removerGanhoMensal = createAsyncThunk(
  'finance/removerGanhoMensal',
  async (id) => {
    const ok = await BolsoDB.removerGanhoMensal(id)
    const snapshot = await BolsoDB.getFullState()
    return { ok, ...snapshot }
  }
)

export const adicionarGasto = createAsyncThunk(
  'finance/adicionarGasto',
  async (params) => {
    const gasto = await BolsoDB.adicionarGasto(params)
    const snapshot = await BolsoDB.getFullState()
    return { gasto, ...snapshot }
  }
)

export const removerGastoDebito = createAsyncThunk(
  'finance/removerGastoDebito',
  async (id) => {
    const ok = await BolsoDB.removerGastoDebito(id)
    const snapshot = await BolsoDB.getFullState()
    return { ok, ...snapshot }
  }
)

export const removerGastoCredito = createAsyncThunk(
  'finance/removerGastoCredito',
  async (gastoId) => {
    const ok = await BolsoDB.removerGastoCredito(gastoId)
    const snapshot = await BolsoDB.getFullState()
    return { ok, ...snapshot }
  }
)

export const editarTransacao = createAsyncThunk(
  'finance/editarTransacao',
  async ({ id, dadosAtualizados }) => {
    const ok = await BolsoDB.editarTransacao(id, dadosAtualizados)
    const snapshot = await BolsoDB.getFullState()
    return { ok, ...snapshot }
  }
)

export const adicionarGastoMensal = createAsyncThunk(
  'finance/adicionarGastoMensal',
  async (params) => {
    const gasto = await BolsoDB.adicionarGastoMensal(params)
    const snapshot = await BolsoDB.getFullState()
    return { gasto, ...snapshot }
  }
)

export const removerGastoMensal = createAsyncThunk(
  'finance/removerGastoMensal',
  async (id) => {
    const ok = await BolsoDB.removerGastoMensal(id)
    const snapshot = await BolsoDB.getFullState()
    return { ok, ...snapshot }
  }
)

export const virarMes = createAsyncThunk(
  'finance/virarMes',
  async (opcoes) => {
    const resultado = await BolsoEngine.virar_mes(opcoes)
    const snapshot = await BolsoDB.getFullState()
    return { resultado, ...snapshot }
  }
)



export const resetarDados = createAsyncThunk(
  'finance/resetarDados',
  async () => {
    await BolsoDB.reset()
    return await BolsoDB.getFullState()
  }
)

export const salvarConfiguracoes = createAsyncThunk(
  'finance/salvarConfiguracoes',
  async (patch) => {
    const configuracoes = await BolsoDB.salvarConfiguracoes(patch)
    return { configuracoes }
  }
)

// ─────────────────────────────────────────────────────────────
//  Slice
// ─────────────────────────────────────────────────────────────

export const transacoesAdapter = createEntityAdapter({
  selectId: (tx) => tx.id,
  sortComparer: (a, b) => new Date(b.data) - new Date(a.data),
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
  if (transacoes) transacoesAdapter.setAll(state, transacoes)
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

const transacoesSelectors = transacoesAdapter.getSelectors((state) => state.finance)

export const selectSaldo = (state) => state.finance.saldo
export const selectTransacoes = transacoesSelectors.selectAll
export const selectTransacaoById = transacoesSelectors.selectById
export const selectTotalTransacoes = transacoesSelectors.selectTotal
export const selectFaturas = (state) => state.finance.faturas
export const selectGanhosMensais = (state) => state.finance.ganhosMensais
export const selectGastosMensais = (state) => state.finance.gastosMensais
export const selectConfiguracoes = (state) => state.finance.configuracoes
export const selectFinanceInitialized = (state) => state.finance.initialized
export const selectFinanceStatus = (state) => state.finance.status
export const selectFinanceError = (state) => state.finance.error

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

export const CATEGORIAS = BolsoDB.CATEGORIAS
export const TIPOS_GASTO = BolsoDB.TIPOS_GASTO

// Substitutos paras as queries diretas que agora não funcionam síncronas:
export const getTotalFatura = (state, mesAnoFiltro) => selectTotalFatura(state, mesAnoFiltro)
