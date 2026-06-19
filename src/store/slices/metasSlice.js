import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'
import { api } from '../../services/api'

import { mostrarToastTemporario } from './uiSlice'

// ─────────────────────────────────────────────────────────────
//  Entity Adapter
// ─────────────────────────────────────────────────────────────

export const metasAdapter = createEntityAdapter({
  selectId: (meta) => meta.id,
})

// ─────────────────────────────────────────────────────────────
//  Helpers de Snapshot (async)
// ─────────────────────────────────────────────────────────────

async function _snapshotMetas() {
  const res = await api.get('/goals');
  const metas = res.data.data ? res.data.data.map(item => ({ ...item, id: item._id })) : res.data.map(item => ({ ...item, id: item._id }));
  return { metas };
}

async function _snapshotFinance() {
  const res = await api.get('/users/full-state');
  return res.data.data || res.data;
}

// ─────────────────────────────────────────────────────────────
//  Async Thunks
// ─────────────────────────────────────────────────────────────

export const initMetas = createAsyncThunk(
  'metas/init',
  async () => {
    // init removido, não é mais mock local
    return _snapshotMetas()
  }
)

export const adicionarMeta = createAsyncThunk(
  'metas/adicionar',
  async (params, { dispatch }) => {
    // O backend cria a meta e faz o aporte inicial descontando do saldo, se houver
    await api.post('/goals', params)
    dispatch(mostrarToastTemporario('Meta criada com sucesso! 🎯', 'success'))
    const [metasSnapshot, financeSnapshot] = await Promise.all([
      _snapshotMetas(),
      _snapshotFinance(),
    ])
    return { ...metasSnapshot, finance: financeSnapshot }
  }
)

export const removerMeta = createAsyncThunk(
  'metas/remover',
  async (id, { dispatch }) => {
    // O backend resgata o saldo restante automaticamente ao remover a meta
    await api.delete(`/goals/${id}`)
    dispatch(mostrarToastTemporario('Meta excluída.', 'success'))
    const [metasSnapshot, financeSnapshot] = await Promise.all([
      _snapshotMetas(),
      _snapshotFinance(),
    ])
    return { ...metasSnapshot, finance: financeSnapshot }
  }
)

export const contribuirMetaSaldo = createAsyncThunk(
  'metas/contribuir',
  async ({ id, valor }, { dispatch, rejectWithValue }) => {
    try {
      await api.post(`/goals/${id}/contribute`, { valor })
      dispatch(mostrarToastTemporario('Aporte realizado com sucesso!', 'success'))
      const [metasSnapshot, financeSnapshot] = await Promise.all([
        _snapshotMetas(),
        _snapshotFinance(),
      ])
      return { ...metasSnapshot, finance: financeSnapshot }
    } catch (err) {
      console.error('[metasSlice] Erro no aporte:', err)
      dispatch(mostrarToastTemporario(err.response?.data?.message || err.message, 'error'))
      return rejectWithValue(err.response?.data?.message || err.message)
    }
  }
)

export const resgatarMetaSaldo = createAsyncThunk(
  'metas/resgatar',
  async ({ id, valor }, { dispatch, rejectWithValue }) => {
    try {
      await api.post(`/goals/${id}/redeem`, { valor })
      dispatch(mostrarToastTemporario('Resgate realizado com sucesso!', 'success'))
      const [metasSnapshot, financeSnapshot] = await Promise.all([
        _snapshotMetas(),
        _snapshotFinance(),
      ])
      return { ...metasSnapshot, finance: financeSnapshot }
    } catch (err) {
      console.error('[metasSlice] Erro no resgate:', err)
      dispatch(mostrarToastTemporario(err.response?.data?.message || err.message, 'error'))
      return rejectWithValue(err.response?.data?.message || err.message)
    }
  }
)

export const editarMeta = createAsyncThunk(
  'metas/editar',
  async ({ id, patch }, { dispatch }) => {
    await api.put(`/goals/${id}`, patch)
    dispatch(mostrarToastTemporario('Meta atualizada!', 'success'))
    return _snapshotMetas()
  }
)

export const agendarMeta = createAsyncThunk(
  'metas/agendar',
  async ({ id, agendamento }, { dispatch }) => {
    await api.put(`/goals/${id}`, { agendamento })
    dispatch(mostrarToastTemporario('Agendamento salvo!', 'success'))
    return _snapshotMetas()
  }
)

// ─────────────────────────────────────────────────────────────
//  Slice
// ─────────────────────────────────────────────────────────────

const initialState = metasAdapter.getInitialState({
  initialized: false,
  status: 'idle',
  error: null,
})

function applyMetasSnapshot(state, action) {
  const { metas } = action.payload
  if (metas) metasAdapter.setAll(state, metas)
}

const metasSlice = createSlice({
  name: 'metas',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(initMetas.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(initMetas.fulfilled, (state, action) => {
        applyMetasSnapshot(state, action)
        state.initialized = true
        state.status = 'succeeded'
      })
      .addCase(initMetas.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      // Genérico: pending
      .addMatcher(
        (a) => a.type.startsWith('metas/') && a.type.endsWith('/pending') && a.type !== 'metas/init/pending',
        (state) => { state.status = 'loading' }
      )
      // Genérico: fulfilled
      .addMatcher(
        (action) =>
          action.type.startsWith('metas/') &&
          action.type.endsWith('/fulfilled') &&
          action.type !== 'metas/init/fulfilled',
        (state, action) => {
          applyMetasSnapshot(state, action)
          state.status = 'succeeded'
        }
      )
      // Genérico: rejected
      .addMatcher(
        (a) => a.type.startsWith('metas/') && a.type.endsWith('/rejected'),
        (state, action) => {
          state.status = 'failed'
          state.error = action.error?.message ?? 'Erro desconhecido'
        }
      )
  },
})

export default metasSlice.reducer

// ─────────────────────────────────────────────────────────────
//  Selectors
// ─────────────────────────────────────────────────────────────

const metasSelectors = metasAdapter.getSelectors((state) => state.metas)

export const selectMetas = metasSelectors.selectAll
export const selectMetaById = metasSelectors.selectById
export const selectMetasInitialized = (state) => state.metas.initialized
export const selectMetasStatus = (state) => state.metas.status
export const selectMetasError = (state) => state.metas.error
