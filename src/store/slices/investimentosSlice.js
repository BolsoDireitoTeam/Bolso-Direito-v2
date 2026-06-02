import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'
import { InvestimentoDB } from '../../services/InvestimentoDB'
import { BolsoDB } from '../../services/BolsoDB'
import { mostrarToastTemporario } from './uiSlice'

// ─────────────────────────────────────────────────────────────
//  Entity Adapter
// ─────────────────────────────────────────────────────────────

export const investimentosAdapter = createEntityAdapter({
  selectId: (investimento) => investimento.id,
})

// ─────────────────────────────────────────────────────────────
//  Helpers de Snapshot (async)
// ─────────────────────────────────────────────────────────────

async function _snapshotInvestimentos() {
  const res = await InvestimentoDB.listar()
  return {
    investimentos: res.investimentos,
    totais: res.totais,
  }
}

// ─────────────────────────────────────────────────────────────
//  Async Thunks
// ─────────────────────────────────────────────────────────────

export const initInvestimentos = createAsyncThunk(
  'investimentos/init',
  async () => {
    await InvestimentoDB.init()
    return _snapshotInvestimentos()
  }
)

export const adicionarInvestimento = createAsyncThunk(
  'investimentos/adicionar',
  async (params, { dispatch }) => {
    await InvestimentoDB.adicionar(params)
    dispatch(mostrarToastTemporario('Investimento adicionado!', 'success'))
    return _snapshotInvestimentos()
  }
)

export const removerInvestimento = createAsyncThunk(
  'investimentos/remover',
  async (id, { dispatch }) => {
    // O backend já calcula o montante e faz o resgate ao saldo automaticamente
    await InvestimentoDB.remover(id)
    dispatch(mostrarToastTemporario('Investimento resgatado e valor devolvido ao saldo.', 'success'))
    // Recarrega o estado financeiro junto
    const [invSnapshot, financeSnapshot] = await Promise.all([
      _snapshotInvestimentos(),
      BolsoDB.getFullState(),
    ])
    return { ...invSnapshot, finance: financeSnapshot }
  }
)

export const editarInvestimento = createAsyncThunk(
  'investimentos/editar',
  async ({ id, patch }, { dispatch }) => {
    await InvestimentoDB.editar(id, patch)
    dispatch(mostrarToastTemporario('Investimento atualizado!', 'success'))
    return _snapshotInvestimentos()
  }
)

export const aportarInvestimento = createAsyncThunk(
  'investimentos/aportar',
  async ({ id, valor }, { dispatch, rejectWithValue }) => {
    try {
      // O backend já desconta o valor do saldo e registra o aporte no investimento
      await InvestimentoDB.aportar(id, valor)
      dispatch(mostrarToastTemporario('Aporte realizado com sucesso!', 'success'))
      const [invSnapshot, financeSnapshot] = await Promise.all([
        _snapshotInvestimentos(),
        BolsoDB.getFullState(),
      ])
      return { ...invSnapshot, finance: financeSnapshot }
    } catch (err) {
      console.error('[investimentosSlice] Erro no aporte:', err)
      dispatch(mostrarToastTemporario(err.message, 'error'))
      return rejectWithValue(err.message)
    }
  }
)

// ─────────────────────────────────────────────────────────────
//  Slice
// ─────────────────────────────────────────────────────────────

const initialState = investimentosAdapter.getInitialState({
  totais: { totalInvestido: 0, montanteTotal: 0, rendimentoTotal: 0 },
  initialized: false,
  status: 'idle',
  error: null,
})

function applyInvSnapshot(state, action) {
  const { investimentos, totais } = action.payload
  if (investimentos) investimentosAdapter.setAll(state, investimentos)
  if (totais) state.totais = totais
}

const investimentosSlice = createSlice({
  name: 'investimentos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(initInvestimentos.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(initInvestimentos.fulfilled, (state, action) => {
        applyInvSnapshot(state, action)
        state.initialized = true
        state.status = 'succeeded'
      })
      .addCase(initInvestimentos.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      // Genérico: pending
      .addMatcher(
        (a) => a.type.startsWith('investimentos/') && a.type.endsWith('/pending') && a.type !== 'investimentos/init/pending',
        (state) => { state.status = 'loading' }
      )
      // Genérico: fulfilled
      .addMatcher(
        (action) =>
          action.type.startsWith('investimentos/') &&
          action.type.endsWith('/fulfilled') &&
          action.type !== 'investimentos/init/fulfilled',
        (state, action) => {
          applyInvSnapshot(state, action)
          state.status = 'succeeded'
        }
      )
      // Genérico: rejected
      .addMatcher(
        (a) => a.type.startsWith('investimentos/') && a.type.endsWith('/rejected'),
        (state, action) => {
          state.status = 'failed'
          state.error = action.error?.message ?? 'Erro desconhecido'
        }
      )
  },
})

export default investimentosSlice.reducer

// ─────────────────────────────────────────────────────────────
//  Selectors
// ─────────────────────────────────────────────────────────────

const investimentosSelectors = investimentosAdapter.getSelectors(
  (state) => state.investimentos
)

export const selectInvestimentos = investimentosSelectors.selectAll
export const selectInvestimentoById = investimentosSelectors.selectById
export const selectInvestimentosTotais = (state) => state.investimentos.totais
export const selectInvestimentosInitialized = (state) => state.investimentos.initialized
export const selectInvestimentosStatus = (state) => state.investimentos.status
export const selectInvestimentosError = (state) => state.investimentos.error

// Re-exporta a função de cálculo do service para uso direto em componentes
// (cálculo local de previsão — não requer chamada à API)
export const calcularValorInvestimento = InvestimentoDB.calcularValorAcumulado
