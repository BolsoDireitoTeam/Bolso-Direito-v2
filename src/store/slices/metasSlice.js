// ============================================================
//  Bolso Direito v2 — metasSlice.js
//  Estado de metas financeiras. Integra com MetaDB e,
//  para ações cruzadas (aporte/resgate), despacha para
//  o financeSlice também.
// ============================================================

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { MetaDB } from '../../services/MetaDB'
import { BolsoDB } from '../../services/BolsoDB'
import { mostrarToastTemporario } from './uiSlice'

// ─────────────────────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────────────────────

function _snapshotMetas() {
  return { metas: MetaDB.listar() }
}

/** Recarrega o financeSlice após side-effects no BolsoDB */
function _snapshotFinance() {
  return {
    saldo: BolsoDB.getSaldo(),
    transacoes: BolsoDB.getTransacoes(),
    estado: BolsoDB.getEstado(),
    configuracoes: BolsoDB.getConfiguracoes(),
  }
}

// ─────────────────────────────────────────────────────────────
//  Thunks
// ─────────────────────────────────────────────────────────────

export const initMetas = createAsyncThunk(
  'metas/init',
  () => {
    MetaDB.init()
    return _snapshotMetas()
  }
)

export const adicionarMeta = createAsyncThunk(
  'metas/adicionar',
  (params, { dispatch }) => {
    const nova = MetaDB.adicionar(params)

    // Side-effect: se houver aporte inicial, debita do saldo
    if (params.aporteInicial && params.aporteInicial > 0) {
      BolsoDB.adicionarGasto({
        nome: `Aporte inicial: ${params.nome}`,
        valor: params.aporteInicial,
        categoria: 'Poupança',
        tipo: 'debito',
      })
      MetaDB.contribuir(nova.id, params.aporteInicial, 'aporte')
    }

    dispatch(mostrarToastTemporario('Meta criada com sucesso! 🎯', 'success'))
    return { ..._snapshotMetas(), finance: _snapshotFinance() }
  }
)

export const removerMeta = createAsyncThunk(
  'metas/remover',
  (id, { dispatch }) => {
    const meta = MetaDB.listar().find(m => m.id === id)

    // Side-effect: se a meta tinha saldo acumulado, resgata ao saldo
    if (meta && meta.valorAtual > 0) {
      BolsoDB.adicionarGanho({
        nome: `Resgate [Meta excluída]: ${meta.nome}`,
        valor: meta.valorAtual,
      })
    }

    MetaDB.remover(id)
    dispatch(mostrarToastTemporario('Meta excluída.', 'success'))
    return { ..._snapshotMetas(), finance: _snapshotFinance() }
  }
)

export const contribuirMetaSaldo = createAsyncThunk(
  'metas/contribuir',
  ({ id, valor }, { dispatch, rejectWithValue }) => {
    try {
      BolsoDB.adicionarGasto({
        nome: `Aporte: ${MetaDB.listar().find(m => m.id === id)?.nome || 'Meta'}`,
        valor,
        categoria: 'Poupança',
        tipo: 'debito',
      })
      MetaDB.contribuir(id, valor, 'aporte')
      dispatch(mostrarToastTemporario('Aporte realizado com sucesso!', 'success'))
      return { ..._snapshotMetas(), finance: _snapshotFinance() }
    } catch (err) {
      console.error('[metasSlice] Erro no aporte:', err)
      dispatch(mostrarToastTemporario(err.message, 'error'))
      return rejectWithValue(err.message)
    }
  }
)

export const resgatarMetaSaldo = createAsyncThunk(
  'metas/resgatar',
  ({ id, valor }, { dispatch, rejectWithValue }) => {
    try {
      const meta = MetaDB.listar().find(m => m.id === id)
      if (!meta) throw new Error('Meta não encontrada')
      if (valor > meta.valorAtual) throw new Error('Valor excede o disponível na meta')

      BolsoDB.adicionarGanho({
        nome: `Resgate: ${meta.nome}`,
        valor,
      })
      MetaDB.resgatar(id, valor)
      dispatch(mostrarToastTemporario('Resgate realizado com sucesso!', 'success'))
      return { ..._snapshotMetas(), finance: _snapshotFinance() }
    } catch (err) {
      console.error('[metasSlice] Erro no resgate:', err)
      dispatch(mostrarToastTemporario(err.message, 'error'))
      return rejectWithValue(err.message)
    }
  }
)

export const editarMeta = createAsyncThunk(
  'metas/editar',
  ({ id, patch }, { dispatch }) => {
    MetaDB.editar(id, patch)
    dispatch(mostrarToastTemporario('Meta atualizada!', 'success'))
    return _snapshotMetas()
  }
)

export const agendarMeta = createAsyncThunk(
  'metas/agendar',
  ({ id, agendamento }, { dispatch }) => {
    MetaDB.editar(id, { agendamento })
    dispatch(mostrarToastTemporario('Agendamento salvo!', 'success'))
    return _snapshotMetas()
  }
)

// ─────────────────────────────────────────────────────────────
//  Slice
// ─────────────────────────────────────────────────────────────

const initialState = {
  metas: [],
  initialized: false,
}

/**
 * Aplica snapshot de metas e, se presente, despacha os dados
 * financeiros atualizados para o financeSlice via extraReducers.
 */
function applyMetasSnapshot(state, action) {
  const { metas } = action.payload
  if (metas) state.metas = metas
}

const metasSlice = createSlice({
  name: 'metas',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(initMetas.fulfilled, (state, action) => {
        applyMetasSnapshot(state, action)
        state.initialized = true
      })
      .addMatcher(
        (action) =>
          action.type.startsWith('metas/') &&
          action.type.endsWith('/fulfilled') &&
          action.type !== 'metas/init/fulfilled',
        applyMetasSnapshot
      )
  },
})

export default metasSlice.reducer

// ─────────────────────────────────────────────────────────────
//  Selectors
// ─────────────────────────────────────────────────────────────

export const selectMetas = (state) => state.metas.metas
export const selectMetasInitialized = (state) => state.metas.initialized
