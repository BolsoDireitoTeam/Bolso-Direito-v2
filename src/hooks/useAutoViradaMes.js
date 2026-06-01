// ============================================================
//  Bolso Direito v2 — useAutoViradaMes.js
//  Hook de automação da virada de mês (Issue #21)
//
//  Lógica:
//    1. Lê diaVencimentoCartao e ultimoMesProcessado das configuracoes
//    2. Se hoje >= diaVencimentoCartao E ultimoMesProcessado != mesAtual
//       → executa virar_mes() e sela o mês com o lacre de idempotência
//    3. Se diaVencimentoCartao não configurado → sinaliza via alertaConfigurar
//
//  Adaptado para Redux: usa dispatch para toasts e sync de state.
// ============================================================

import { useCallback } from 'react'
import { useAppDispatch } from '../store/hooks'
import { BolsoDB } from '../services/BolsoDB'
import { BolsoEngine } from '../services/BolsoEngine'
import { mostrarToastTemporario } from '../store/slices/uiSlice'
import { initFinance } from '../store/slices/financeSlice'

/**
 * Retorna o mês atual no formato "YYYY-MM".
 */
function getMesAtual() {
  const d = new Date()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${d.getFullYear()}-${mm}`
}

/**
 * Retorna o dia do mês atual (1–31).
 */
function getDiaAtual() {
  return new Date().getDate()
}

/**
 * Hook de automação de virada de mês.
 *
 * @returns {{
 *   executarAutoVirada: () => { alertaConfigurar: boolean } | void
 * }}
 */
export function useAutoViradaMes() {
  const dispatch = useAppDispatch()

  /**
   * Executa a verificação e, se necessário, dispara a virada automática.
   * Deve ser chamada UMA VEZ no useEffect de mount do App.
   */
  const executarAutoVirada = useCallback(() => {
    const cfg = BolsoDB.getConfiguracoes()
    const mesAtual = getMesAtual()
    const diaAtual = getDiaAtual()

    // Usa diaViradaMes se configurado, senão cai para diaVencimentoCartao (compat.)
    const diaVirada = cfg.diaViradaMes || cfg.diaVencimentoCartao

    // Sem dia configurado: nada a fazer agora (App.jsx sinaliza o alerta)
    if (!diaVirada) return { alertaConfigurar: true }

    const jaProcessou = cfg.ultimoMesProcessado === mesAtual
    const deveConsolidar = diaAtual >= diaVirada

    if (deveConsolidar && !jaProcessou) {
      try {
        BolsoEngine.virar_mes()
        // Sela o mês para idempotência — próxima abertura do app não repetirá
        BolsoDB.salvarConfiguracoes({ ultimoMesProcessado: mesAtual })
        // Re-sincroniza o Redux com os dados atualizados
        dispatch(initFinance())
        dispatch(
          mostrarToastTemporario(
            `📅 Fatura de ${mesAtual} consolidada automaticamente!`,
            'success'
          )
        )
        console.info(`[AutoVirada] ✅ Mês ${mesAtual} processado automaticamente.`)
      } catch (err) {
        console.error('[AutoVirada] Erro ao consolidar mês:', err)
        dispatch(mostrarToastTemporario('Erro ao consolidar o mês automaticamente.', 'error'))
      }
      return { alertaConfigurar: false }
    }

    return { alertaConfigurar: false }
  }, [dispatch])

  return { executarAutoVirada }
}
