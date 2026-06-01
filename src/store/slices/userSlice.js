// ============================================================
//  Bolso Direito v2 — userSlice.js
//  Estado do usuário: dados cadastrais, dados financeiros,
//  e controle de autenticação.
// ============================================================

import { createSlice } from '@reduxjs/toolkit'

// ── Helpers de hydration do localStorage ─────────────────────
function carregarUsuario() {
  try {
    return JSON.parse(localStorage.getItem('bd_usuario')) ?? {
      nome: 'Usuário', email: '', celular: '', avatar: null,
    }
  } catch {
    return { nome: 'Usuário', email: '', celular: '', avatar: null }
  }
}

function carregarFinanceiro() {
  try {
    return JSON.parse(localStorage.getItem('bd_financeiro')) ?? null
  } catch {
    return null
  }
}

const initialState = {
  usuario: carregarUsuario(),
  financeiro: carregarFinanceiro(),
  isLoggedIn: localStorage.getItem('bd_logado') === 'true',
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    salvarUsuario(state, action) {
      state.usuario = { ...state.usuario, ...action.payload }
      localStorage.setItem('bd_usuario', JSON.stringify(state.usuario))
    },
    salvarFinanceiro(state, action) {
      state.financeiro = action.payload
      localStorage.setItem('bd_financeiro', JSON.stringify(action.payload))
    },
    login(state, action) {
      state.isLoggedIn = true
      state.usuario = { ...state.usuario, nome: action.payload.username }
      localStorage.setItem('bd_logado', 'true')
      localStorage.setItem('bd_usuario', JSON.stringify(state.usuario))
    },
    logout(state) {
      state.isLoggedIn = false
      localStorage.removeItem('bd_logado')
    },
  },
})

export const { salvarUsuario, salvarFinanceiro, login, logout } = userSlice.actions

// ── Selectors ────────────────────────────────────────────────
export const selectUsuario = (state) => state.user.usuario
export const selectFinanceiro = (state) => state.user.financeiro
export const selectIsLoggedIn = (state) => state.user.isLoggedIn

export default userSlice.reducer
