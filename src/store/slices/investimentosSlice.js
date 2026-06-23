import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'
import { api } from '../../services/api'
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
  const res = await api.get('/investments')
  const raw = res.data.data ?? res.data
  const investimentos = raw.map(item => ({ ...item, id: item.id || item._id }))

  const totalInvestido = investimentos.reduce((acc, curr) => acc + (curr.valorInvestido ?? curr.totalAportado ?? 0), 0)
  const montanteTotal  = investimentos.reduce((acc, curr) => acc + (curr.valorAtual ?? curr.montante ?? 0), 0)
  const rendimentoTotal = montanteTotal - totalInvestido

  return {
    investimentos,
    totais: { totalInvestido, montanteTotal, rendimentoTotal },
  }
}

// ─────────────────────────────────────────────────────────────
//  Async Thunks
// ─────────────────────────────────────────────────────────────

export const initInvestimentos = createAsyncThunk(
  'investimentos/init',
  async () => _snapshotInvestimentos()
)

export const adicionarInvestimento = createAsyncThunk(
  'investimentos/adicionar',
  async (params, { dispatch }) => {
    await api.post('/investments', params)
    dispatch(mostrarToastTemporario('Investimento adicionado!', 'success'))
    return _snapshotInvestimentos()
  }
)

export const removerInvestimento = createAsyncThunk(
  'investimentos/remover',
  async (id, { dispatch }) => {
    await api.delete(`/investments/${id}`)
    dispatch(mostrarToastTemporario('Investimento resgatado e valor devolvido ao saldo.', 'success'))
    const [invSnapshot, financeSnapshot] = await Promise.all([
      _snapshotInvestimentos(),
      api.get('/users/full-state').then(r => r.data.data || r.data),
    ])
    return { ...invSnapshot, finance: financeSnapshot }
  }
)

export const editarInvestimento = createAsyncThunk(
  'investimentos/editar',
  async ({ id, patch }, { dispatch }) => {
    await api.put(`/investments/${id}`, patch)
    dispatch(mostrarToastTemporario('Investimento atualizado!', 'success'))
    return _snapshotInvestimentos()
  }
)

export const aportarInvestimento = createAsyncThunk(
  'investimentos/aportar',
  async ({ id, valor }, { dispatch, rejectWithValue }) => {
    try {
      // Rota correta: /:id/aportes com body { valor, data }
      await api.post(`/investments/${id}/aportes`, { valor, data: new Date().toISOString().slice(0, 10) })
      dispatch(mostrarToastTemporario('Aporte realizado com sucesso!', 'success'))
      const [invSnapshot, financeSnapshot] = await Promise.all([
        _snapshotInvestimentos(),
        api.get('/users/full-state').then(r => r.data.data || r.data),
      ])
      return { ...invSnapshot, finance: financeSnapshot }
    } catch (err) {
      console.error('[investimentosSlice] Erro no aporte:', err)
      dispatch(mostrarToastTemporario(err.response?.data?.message || err.message, 'error'))
      return rejectWithValue(err.response?.data?.message || err.message)
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

export const calcularValorInvestimento = (montante, taxaMensal, meses) => {
  return montante * Math.pow(1 + taxaMensal / 100, meses)
}
