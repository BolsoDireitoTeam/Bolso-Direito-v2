import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { selectConfiguracoes, virarMes, salvarConfiguracoes } from '../store/slices/financeSlice'
import { mostrarToastTemporario } from '../store/slices/uiSlice'

function getMesAtual() {
  const d = new Date()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${d.getFullYear()}-${mm}`
}

function getDiaAtual() {
  return new Date().getDate()
}

export function useAutoViradaMes() {
  const dispatch = useAppDispatch()
  const cfg = useAppSelector(selectConfiguracoes)

  const executarAutoVirada = useCallback(async () => {
    // Evita rodar se a config ainda não carregou do backend
    if (!cfg || Object.keys(cfg).length === 0) return { alertaConfigurar: false }

    const mesAtual = getMesAtual()
    const diaAtual = getDiaAtual()

    const diaVirada = cfg.diaViradaMes || cfg.diaVencimentoCartao

    if (!diaVirada) return { alertaConfigurar: true }

    const jaProcessou = cfg.ultimoMesProcessado === mesAtual
    const deveConsolidar = diaAtual >= diaVirada

    if (deveConsolidar && !jaProcessou) {
      try {
        await dispatch(virarMes()).unwrap()
        await dispatch(salvarConfiguracoes({ ultimoMesProcessado: mesAtual })).unwrap()

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
  }, [dispatch, cfg])

  return { executarAutoVirada }
}
