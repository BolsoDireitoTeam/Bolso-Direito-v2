// ============================================================
//  Bolso Direito v2 — useFinance.js
//  Atalho para consumir o FinanceContext com error boundary.
// ============================================================

import { useContext } from 'react'
import { FinanceContext } from '../context/FinanceContext'

/**
 * Hook que dá acesso a todos os dados e ações financeiras.
 *
 * @example
 * const { saldo, adicionarGanho, transacoes } = useFinance()
 *
 * @returns {import('../context/FinanceContext').FinanceContextValue}
 */
export function useFinance() {
  const ctx = useContext(FinanceContext)
  if (!ctx) {
    throw new Error(
      'useFinance() deve ser usado dentro de <FinanceProvider>. ' +
      'Verifique que App.jsx está envolvido por <FinanceProvider>.'
    )
  }
  return ctx
}
