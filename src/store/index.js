// ============================================================
//  Bolso Direito v2 — store/index.js
//  Configura o Redux Store com todos os slices e middleware.
// ============================================================

import { configureStore } from '@reduxjs/toolkit'

import financeReducer from './slices/financeSlice'
import userReducer from './slices/userSlice'
import uiReducer from './slices/uiSlice'
import metasReducer from './slices/metasSlice'
import investimentosReducer from './slices/investimentosSlice'
import { initFinance } from './slices/financeSlice'

// ─────────────────────────────────────────────────────────────
//  Cross-slice sync middleware
//  Quando thunks do metasSlice ou investimentosSlice retornam
//  um campo `finance` no payload, esse middleware despacha
//  automaticamente a sincronização para o financeSlice.
// ─────────────────────────────────────────────────────────────

const crossSliceSyncMiddleware = (storeAPI) => (next) => (action) => {
  const result = next(action)

  // Após thunks de metas/investimentos que afetam o saldo,
  // re-sincronizamos o financeSlice com um snapshot fresco
  if (
    action.type?.endsWith('/fulfilled') &&
    action.payload?.finance &&
    (action.type.startsWith('metas/') || action.type.startsWith('investimentos/'))
  ) {
    // Despacha a re-hidratação do finance como um init "light"
    storeAPI.dispatch({
      type: 'finance/crossSync',
      payload: action.payload.finance,
    })
  }

  return result
}

// ─────────────────────────────────────────────────────────────
//  Store
// ─────────────────────────────────────────────────────────────

export const store = configureStore({
  reducer: {
    finance: financeReducer,
    user: userReducer,
    ui: uiReducer,
    metas: metasReducer,
    investimentos: investimentosReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // BolsoDB retorna objetos com referências circulares em alguns casos;
      // desabilitamos a checagem de serialização para evitar warnings.
      serializableCheck: false,
    }).concat(crossSliceSyncMiddleware),
})

// ─────────────────────────────────────────────────────────────
//  Initializer — chama os inits de todos os slices
//  Deve ser despachado UMA VEZ no mount do App
// ─────────────────────────────────────────────────────────────

export { initFinance }
export { initMetas } from './slices/metasSlice'
export { initInvestimentos } from './slices/investimentosSlice'
