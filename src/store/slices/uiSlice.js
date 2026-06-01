// ============================================================
//  Bolso Direito v2 — uiSlice.js
//  Estado de interface: toast, filtro mensal, transação pendente,
//  action sheet, alerta de configuração.
// ============================================================

import { createSlice } from '@reduxjs/toolkit'
import { mesAtual } from '../../utils/format'

const initialState = {
  toast: null,              // { mensagem: string, tipo: 'success'|'error' } | null
  mesAnoFiltro: mesAtual(), // "YYYY-MM"
  transacaoPendente: null,  // objeto temporário do fluxo Teclado → Categoria → Tipo
  actionSheetOpen: false,
  alertaConfigurar: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    mostrarToast(state, action) {
      const { mensagem, tipo = 'success' } = action.payload
      state.toast = { mensagem, tipo }
    },
    limparToast(state) {
      state.toast = null
    },
    setMesAnoFiltro(state, action) {
      state.mesAnoFiltro = action.payload
    },
    setTransacaoPendente(state, action) {
      state.transacaoPendente = action.payload
    },
    toggleActionSheet(state) {
      state.actionSheetOpen = !state.actionSheetOpen
    },
    setActionSheetOpen(state, action) {
      state.actionSheetOpen = action.payload
    },
    setAlertaConfigurar(state, action) {
      state.alertaConfigurar = action.payload
    },
  },
})

export const {
  mostrarToast,
  limparToast,
  setMesAnoFiltro,
  setTransacaoPendente,
  toggleActionSheet,
  setActionSheetOpen,
  setAlertaConfigurar,
} = uiSlice.actions

// ── Thunk: toast com auto-clear ──────────────────────────────
export const mostrarToastTemporario = (mensagem, tipo = 'success', duracao = 2500) => (dispatch) => {
  dispatch(mostrarToast({ mensagem, tipo }))
  setTimeout(() => dispatch(limparToast()), duracao)
}

// ── Selectors ────────────────────────────────────────────────
export const selectToast = (state) => state.ui.toast
export const selectMesAnoFiltro = (state) => state.ui.mesAnoFiltro
export const selectTransacaoPendente = (state) => state.ui.transacaoPendente
export const selectActionSheetOpen = (state) => state.ui.actionSheetOpen
export const selectAlertaConfigurar = (state) => state.ui.alertaConfigurar

export default uiSlice.reducer
