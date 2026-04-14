// ============================================================
//  Bolso Direito v2 — useAutoViradaMes.js
//  Hook de automação da virada de mês (Issue #21)
//
//  Lógica:
//    1. Lê diaVencimentoCartao e ultimoMesProcessado das configuracoes
//    2. Se hoje >= diaVencimentoCartao E ultimoMesProcessado != mesAtual
//       → executa virar_mes() e sela o mês com o lacre de idempotência
//    3. Se diaVencimentoCartao não configurado → sinaliza via alertaConfigurar
// ============================================================

import { useCallback } from 'react'
import { BolsoDB } from '../services/BolsoDB'
import { BolsoEngine } from '../services/BolsoEngine'

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
 * @param {Function} bump         — função que força re-render no FinanceContext
 * @param {Function} mostrarToast — função de toast do FinanceContext
 * @returns {{
 *   alertaConfigurar: boolean,
 *   executarAutoVirada: () => void
 * }}
 */
export function useAutoViradaMes(bump, mostrarToast) {
  /**
   * Executa a verificação e, se necessário, dispara a virada automática.
   * Deve ser chamada UMA VEZ no useEffect de mount do FinanceContext.
   */
  const executarAutoVirada = useCallback(() => {
    const cfg = BolsoDB.getConfiguracoes()
    const mesAtual = getMesAtual()
    const diaAtual = getDiaAtual()

    // Sem dia configurado: nada a fazer agora (FinanceContext sinaliza o alerta)
    if (!cfg.diaVencimentoCartao) return { alertaConfigurar: true }

    const jaProcessou = cfg.ultimoMesProcessado === mesAtual
    const deveConsolidar = diaAtual >= cfg.diaVencimentoCartao

    if (deveConsolidar && !jaProcessou) {
      try {
        BolsoEngine.virar_mes()
        // Sela o mês para idempotência — próxima abertura do app não repetirá
        BolsoDB.salvarConfiguracoes({ ultimoMesProcessado: mesAtual })
        bump()
        mostrarToast(
          `📅 Fatura de ${mesAtual} consolidada automaticamente!`,
          'success'
        )
        console.info(`[AutoVirada] ✅ Mês ${mesAtual} processado automaticamente.`)
      } catch (err) {
        console.error('[AutoVirada] Erro ao consolidar mês:', err)
        mostrarToast('Erro ao consolidar o mês automaticamente.', 'error')
      }
      return { alertaConfigurar: false }
    }

    return { alertaConfigurar: false }
  }, [bump, mostrarToast])

  return { executarAutoVirada }
}
