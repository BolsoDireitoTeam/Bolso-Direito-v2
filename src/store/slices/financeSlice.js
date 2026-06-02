// ============================================================
//  Bolso Direito v2 — financeSlice.js
//  Coração financeiro: saldo, transações, faturas, recorrentes,
//  configurações do sistema. Integra com BolsoDB e BolsoEngine.
// ============================================================

import { createSlice, createAsyncThunk, createSelector, createEntityAdapter } from '@reduxjs/toolkit'
import { BolsoDB } from '../../services/BolsoDB'
import { BolsoEngine } from '../../services/BolsoEngine'

// ─────────────────────────────────────────────────────────────
//  Async Thunks — Chamam os Services e retornam dados pro Redux
// ─────────────────────────────────────────────────────────────

/**
 * Inicializa BolsoDB e hidrata o state do Redux com os dados do localStorage.
 */
export const initFinance = createAsyncThunk(
  'finance/init',
  () => {
    BolsoDB.init()
    return {
      saldo: BolsoDB.getSaldo(),
      transacoes: BolsoDB.getTransacoes(),
      estado: BolsoDB.getEstado(),
      configuracoes: BolsoDB.getConfiguracoes(),
    }
  }
)

/**
 * Recarrega todo o estado financeiro do BolsoDB para o Redux.
 * Deve ser chamado após qualquer mutação no BolsoDB.
 */
function _snapshot() {
  return {
    saldo: BolsoDB.getSaldo(),
    transacoes: BolsoDB.getTransacoes(),
    estado: BolsoDB.getEstado(),
    configuracoes: BolsoDB.getConfiguracoes(),
  }
}

export const adicionarGanho = createAsyncThunk(
  'finance/adicionarGanho',
  (params) => {
    const ganho = BolsoDB.adicionarGanho(params)
    return { ganho, ..._snapshot() }
  }
)

export const removerGanho = createAsyncThunk(
  'finance/removerGanho',
  (id) => {
    const ok = BolsoDB.removerGanho(id)
    return { ok, ..._snapshot() }
  }
)

export const adicionarGanhoMensal = createAsyncThunk(
  'finance/adicionarGanhoMensal',
  (params) => {
    const ganho = BolsoDB.adicionarGanhoMensal(params)
    return { ganho, ..._snapshot() }
  }
)

export const removerGanhoMensal = createAsyncThunk(
  'finance/removerGanhoMensal',
  (id) => {
    const ok = BolsoDB.removerGanhoMensal(id)
    return { ok, ..._snapshot() }
  }
)

export const adicionarGasto = createAsyncThunk(
  'finance/adicionarGasto',
  (params) => {
    const gasto = BolsoDB.adicionarGasto(params)
    return { gasto, ..._snapshot() }
  }
)

export const removerGastoDebito = createAsyncThunk(
  'finance/removerGastoDebito',
  (id) => {
    const ok = BolsoDB.removerGastoDebito(id)
    return { ok, ..._snapshot() }
  }
)

export const removerGastoCredito = createAsyncThunk(
  'finance/removerGastoCredito',
  (gastoId) => {
    const ok = BolsoDB.removerGastoCredito(gastoId)
    return { ok, ..._snapshot() }
  }
)

export const editarTransacao = createAsyncThunk(
  'finance/editarTransacao',
  ({ id, dadosAtualizados }) => {
    const ok = BolsoDB.editarTransacao(id, dadosAtualizados)
    return { ok, ..._snapshot() }
  }
)

export const adicionarGastoMensal = createAsyncThunk(
  'finance/adicionarGastoMensal',
  (params) => {
    const gasto = BolsoDB.adicionarGastoMensal(params)
    return { gasto, ..._snapshot() }
  }
)

export const removerGastoMensal = createAsyncThunk(
  'finance/removerGastoMensal',
  (id) => {
    const ok = BolsoDB.removerGastoMensal(id)
    return { ok, ..._snapshot() }
  }
)

export const virarMes = createAsyncThunk(
  'finance/virarMes',
  (opcoes, { getState }) => {
    // Importamos MetaDB aqui para não criar import circular no topo
    const resultado = BolsoEngine.virar_mes(opcoes)
    return { resultado, ..._snapshot() }
  }
)

export const resetarDados = createAsyncThunk(
  'finance/resetarDados',
  () => {
    BolsoDB.reset()
    return _snapshot()
  }
)

export const importarTransacoes = createAsyncThunk(
  'finance/importarTransacoes',
  (lista) => {
    lista.forEach(tx => {
      try {
        if (tx.tipo === 'ganho') {
          BolsoDB.adicionarGanho({ nome: tx.nome, valor: tx.valor, data: tx.data })
        } else {
          BolsoDB.adicionarGasto({
            nome: tx.nome,
            valor: tx.valor,
            categoria: tx.categoria || 'Outros',
            tipo: tx.subtipo || 'debito',
            parcelas: tx.parcelas || 1,
            data: tx.data,
          })
        }
      } catch (err) {
        console.warn('[Importar] Item ignorado:', tx, err.message)
      }
    })
    return _snapshot()
  }
)

export const salvarConfiguracoes = createAsyncThunk(
  'finance/salvarConfiguracoes',
  (patch) => {
    BolsoDB.salvarConfiguracoes(patch)
    return { configuracoes: BolsoDB.getConfiguracoes() }
  }
)

// ─────────────────────────────────────────────────────────────
//  Slice
// ─────────────────────────────────────────────────────────────

// ── EntityAdapter para transações (normalização { ids, entities }) ──
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
  status: 'idle',     // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,        // string | null
})

/**
 * Reducer helper: aplica o snapshot retornado pelos thunks.
 */
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
      // ── Init ──
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
      // ── Configurações ──
      .addCase(salvarConfiguracoes.fulfilled, (state, action) => {
        state.configuracoes = action.payload.configuracoes
      })
      // ── Cross-slice sync ──
      .addMatcher(
        (action) => action.type === 'finance/crossSync',
        applySnapshot
      )
      // ── Genérico: pending para qualquer thunk finance/* ──
      .addMatcher(
        (a) =>
          a.type.startsWith('finance/') &&
          a.type.endsWith('/pending') &&
          a.type !== 'finance/init/pending',
        (state) => { state.status = 'loading' }
      )
      // ── Genérico: fulfilled para qualquer thunk finance/* ──
      .addMatcher(
        (action) =>
          action.type.startsWith('finance/') &&
          action.type.endsWith('/fulfilled') &&
          action.type !== 'finance/init/fulfilled' &&
          action.type !== 'finance/salvarConfiguracoes/fulfilled',
        (state, action) => {
          applySnapshot(state, action)
          state.status = 'succeeded'
        }
      )
      // ── Genérico: rejected para qualquer thunk finance/* ──
      .addMatcher(
        (a) =>
          a.type.startsWith('finance/') &&
          a.type.endsWith('/rejected'),
        (state, action) => {
          state.status = 'failed'
          state.error = action.error?.message ?? 'Erro desconhecido'
        }
      )
  },
})

export default financeSlice.reducer

// ─────────────────────────────────────────────────────────────
//  Selectors Básicos
// ─────────────────────────────────────────────────────────────

// ── Selectors via EntityAdapter ──
const transacoesSelectors = transacoesAdapter.getSelectors(
  (state) => state.finance
)

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

// ─────────────────────────────────────────────────────────────
//  Selectors Derivados (Memoized via createSelector)
// ─────────────────────────────────────────────────────────────

/**
 * Transações filtradas pelo mês/ano selecionado no UI.
 * Recebe o mesAnoFiltro como input selector cruzando slices.
 */
export const selectTransacoesMesAtual = createSelector(
  [selectTransacoes, (_state, mesAnoFiltro) => mesAnoFiltro],
  (transacoes, mesAnoFiltro) =>
    transacoes.filter(tx => tx.data && tx.data.startsWith(mesAnoFiltro))
)

export const selectReceitasMes = createSelector(
  [selectTransacoesMesAtual],
  (txMes) =>
    txMes
      .filter(tx => tx.tipo === 'ganho')
      .reduce((acc, tx) => acc + tx.valor, 0)
)

export const selectDespesasMes = createSelector(
  [selectTransacoesMesAtual],
  (txMes) =>
    txMes
      .filter(tx => tx.tipo === 'gasto')
      .reduce((acc, tx) => acc + tx.valor, 0)
)

export const selectTotalFatura = createSelector(
  [selectFaturas, (_state, mesAnoFiltro) => mesAnoFiltro],
  (faturas, mesAnoFiltro) => {
    const itens = faturas[mesAnoFiltro] ?? []
    return Number(itens.reduce((acc, p) => acc + p.valorParcela, 0).toFixed(2))
  }
)

export const selectGastosPorCategoria = createSelector(
  [selectTransacoesMesAtual],
  (txMes) => {
    const mapa = {}
    txMes
      .filter(tx => tx.tipo === 'gasto' && tx.categoria)
      .forEach(tx => {
        mapa[tx.categoria] = (mapa[tx.categoria] || 0) + tx.valor
      })
    return mapa
  }
)

export const selectAlertas = createSelector(
  [selectSaldo, selectGanhosMensais, selectFaturas],
  () => {
    // Delegamos ao BolsoEngine que lê direto do BolsoDB
    // Os input selectors garantem que o selector re-executa quando
    // saldo/ganhosMensais/faturas mudam
    return BolsoEngine.calcularAlertas()
  }
)

// ── Constantes expostas (não são state, mas conveniência) ────
export const CATEGORIAS = BolsoDB.CATEGORIAS
export const TIPOS_GASTO = BolsoDB.TIPOS_GASTO

// ── Queries diretas ao BolsoDB (thin wrappers) ──────────────
export const getFatura = BolsoDB.getFatura
export const getTotalFatura = BolsoDB.getTotalFatura
export const getFaturasMeses = BolsoDB.getFaturasMeses
