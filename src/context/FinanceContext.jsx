// ============================================================
//  Bolso Direito v2 — FinanceContext.jsx
//  Provider central de estado financeiro (BolsoDB + BolsoEngine)
//  Todas as mutações passam por aqui para garantir re-renders.
// ============================================================

import { createContext, useState, useEffect, useMemo, useCallback } from 'react'
import { BolsoDB } from '../services/BolsoDB'
import { BolsoEngine } from '../services/BolsoEngine'
import { MetaDB } from '../services/MetaDB'
import { mesAtual } from '../utils/format'
import { useAutoViradaMes } from '../hooks/useAutoViradaMes'

export const FinanceContext = createContext(null)

export function FinanceProvider({ children }) {
  // ── Version counter: cada mutação incrementa para forçar recálculo ──
  const [version, setVersion] = useState(0)
  const bump = useCallback(() => setVersion(v => v + 1), [])

  // ── State temporário para o fluxo de gasto (Teclado → Categoria → Tipo) ──
  const [transacaoPendente, setTransacaoPendente] = useState(null)

  // ── Toast state ──
  const [toast, setToast] = useState(null)

  const mostrarToast = useCallback((mensagem, tipo = 'success') => {
    setToast({ mensagem, tipo })
    setTimeout(() => setToast(null), 2500)
  }, [])

  // ── Alerta de configuração de cartão pendente ──
  const [alertaConfigurar, setAlertaConfigurar] = useState(false)

  // ── Hook de automação de virada de mês (Issue #21) ──
  const { executarAutoVirada } = useAutoViradaMes(bump, mostrarToast)

  // ── Inicializar BolsoDB e executar auto-virada ──
  useEffect(() => {
    BolsoDB.init()
    MetaDB.init()
    const { alertaConfigurar: alerta } = executarAutoVirada() ?? {}
    setAlertaConfigurar(!!alerta)
    bump()
  }, [bump, executarAutoVirada])

  // ── Dados derivados — recalculam quando version muda ──
  const saldo = useMemo(() => BolsoDB.getSaldo(), [version])
  const transacoes = useMemo(() => BolsoDB.getTransacoes(), [version])
  const estado = useMemo(() => BolsoDB.getEstado(), [version])
  const alertas = useMemo(() => BolsoEngine.calcularAlertas(), [version])

  // Dados do mês atual
  const mesAtualKey = mesAtual()
  const transacoesMesAtual = useMemo(() => {
    return transacoes.filter(tx => tx.data && tx.data.startsWith(mesAtualKey))
  }, [version, mesAtualKey])

  const receitasMes = useMemo(() => {
    return transacoesMesAtual
      .filter(tx => tx.tipo === 'ganho')
      .reduce((acc, tx) => acc + tx.valor, 0)
  }, [transacoesMesAtual])

  const despesasMes = useMemo(() => {
    return transacoesMesAtual
      .filter(tx => tx.tipo === 'gasto')
      .reduce((acc, tx) => acc + tx.valor, 0)
  }, [transacoesMesAtual])

  const totalFaturaMesAtual = useMemo(() => {
    return BolsoDB.getTotalFatura(mesAtualKey)
  }, [version, mesAtualKey])

  // Gastos por categoria no mês atual
  const gastosPorCategoria = useMemo(() => {
    const mapa = {}
    transacoesMesAtual
      .filter(tx => tx.tipo === 'gasto' && tx.categoria)
      .forEach(tx => {
        mapa[tx.categoria] = (mapa[tx.categoria] || 0) + tx.valor
      })
    return mapa
  }, [transacoesMesAtual])

  // ── Ações (wrappers que chamam BolsoDB e disparam re-render) ──

  const adicionarGanho = useCallback((params) => {
    const ganho = BolsoDB.adicionarGanho(params)
    bump()
    return ganho
  }, [bump])

  const adicionarGasto = useCallback((params) => {
    const gasto = BolsoDB.adicionarGasto(params)
    bump()
    return gasto
  }, [bump])

  const removerGanho = useCallback((id) => {
    const ok = BolsoDB.removerGanho(id)
    if (ok) bump()
    return ok
  }, [bump])

  const removerGastoDebito = useCallback((id) => {
    const ok = BolsoDB.removerGastoDebito(id)
    if (ok) bump()
    return ok
  }, [bump])

  const removerGastoCredito = useCallback((gastoId) => {
    const ok = BolsoDB.removerGastoCredito(gastoId)
    if (ok) bump()
    return ok
  }, [bump])

  const editarTransacao = useCallback((id, dadosAtualizados) => {
    const ok = BolsoDB.editarTransacao(id, dadosAtualizados)
    if (ok) bump()
    return ok
  }, [bump])

  const adicionarGanhoMensal = useCallback((params) => {
    const ganho = BolsoDB.adicionarGanhoMensal(params)
    bump()
    return ganho
  }, [bump])

  const removerGanhoMensal = useCallback((id) => {
    const ok = BolsoDB.removerGanhoMensal(id)
    if (ok) bump()
    return ok
  }, [bump])

  const adicionarGastoMensal = useCallback((params) => {
    const gasto = BolsoDB.adicionarGastoMensal(params)
    bump()
    return gasto
  }, [bump])

  const removerGastoMensal = useCallback((id) => {
    const ok = BolsoDB.removerGastoMensal(id)
    if (ok) bump()
    return ok
  }, [bump])

  const virarMes = useCallback((opcoes) => {
    const metasObj = MetaDB.listar()
    const resultado = BolsoEngine.virar_mes({
      ...opcoes,
      metas: metasObj,
      onMetaContribute: (id, val, tipo) => {
        MetaDB.contribuir(id, val, tipo)
      }
    })
    bump()
    return resultado
  }, [bump])

  const resetarDados = useCallback(() => {
    BolsoDB.reset()
    bump()
  }, [bump])

  // ── Configurações do Sistema ──
  const configuracoes = useMemo(() => BolsoDB.getConfiguracoes(), [version])

  const salvarConfiguracoes = useCallback((patch) => {
    BolsoDB.salvarConfiguracoes(patch)
    bump()
  }, [bump])

  // ── Importação em lote (Fase C — CSV Upload) ──
  const importarTransacoes = useCallback((lista) => {
    lista.forEach(tx => {
      try {
        if (tx.tipo === 'ganho') {
          BolsoDB.adicionarGanho({ nome: tx.nome, valor: tx.valor, data: tx.data })
        } else {
          BolsoDB.adicionarGasto({
            nome: tx.nome,
            valor: tx.valor,
            categoria: tx.categoria || 'Outros',
            tipo: tx.subtipo || 'debito',
            parcelas: tx.parcelas || 1,
            data: tx.data,
          })
        }
      } catch (err) {
        console.warn('[Importar] Item ignorado:', tx, err.message)
      }
    })
    bump()
  }, [bump])

  // ── Metas Financeiras (Fase B) ──
  const metas = useMemo(() => MetaDB.listar(), [version])

  const adicionarMeta = useCallback((params) => {
    const nova = MetaDB.adicionar(params)
    bump()
    return nova
  }, [bump])

  const removerMeta = useCallback((id) => {
    MetaDB.remover(id)
    bump()
  }, [bump])

  const contribuirMetaSaldo = useCallback((id, valor) => {
    try {
      // 1. Debitar do saldo (Gasto)
      BolsoDB.adicionarGasto({
        nome: `Aporte: ${MetaDB.listar().find(m => m.id === id)?.nome || 'Meta'}`,
        valor,
        categoria: 'Poupança',
        tipo: 'debito'
      })
      // 2. Incrementar meta
      MetaDB.contribuir(id, valor, 'direta')
      bump()
      mostrarToast('Aporte realizado com sucesso!', 'success')
    } catch (err) {
      console.error('[FinanceContext] Erro no aporte:', err)
      mostrarToast(err.message, 'error')
    }
  }, [bump, mostrarToast])

  const agendarMeta = useCallback((id, agendamento) => {
    MetaDB.editar(id, { agendamento })
    bump()
    mostrarToast('Agendamento salvo!', 'success')
  }, [bump, mostrarToast])

  // ── Value do context ──
  const value = useMemo(() => ({
    // Leituras
    saldo,
    transacoes,
    estado,
    alertas,
    receitasMes,
    despesasMes,
    totalFaturaMesAtual,
    gastosPorCategoria,
    transacoesMesAtual,

    // Ações de Ganho
    adicionarGanho,
    removerGanho,
    adicionarGanhoMensal,
    removerGanhoMensal,

    // Ações de Gasto
    adicionarGasto,
    removerGastoDebito,
    removerGastoCredito,
    adicionarGastoMensal,
    removerGastoMensal,

    // Edição
    editarTransacao,

    // Motor Financeiro
    virarMes,
    resetarDados,

    // Metas (Fase B)
    metas,
    adicionarMeta,
    removerMeta,
    contribuirMetaSaldo,
    agendarMeta,

    // Configurações do Sistema (Fase A)
    configuracoes,
    salvarConfiguracoes,
    alertaConfigurar,

    // Importação em lote (Fase C)
    importarTransacoes,

    // Constantes
    categorias: BolsoDB.CATEGORIAS,
    tiposGasto: BolsoDB.TIPOS_GASTO,

    // Fluxo de gasto entre páginas
    transacaoPendente,
    setTransacaoPendente,

    // Toast
    toast,
    mostrarToast,

    // Queries diretas
    getFatura: BolsoDB.getFatura,
    getTotalFatura: BolsoDB.getTotalFatura,
    getFaturasMeses: BolsoDB.getFaturasMeses,
  }), [
    saldo, transacoes, estado, alertas, receitasMes, despesasMes,
    totalFaturaMesAtual, gastosPorCategoria, transacoesMesAtual,
    adicionarGanho, removerGanho, adicionarGanhoMensal, removerGanhoMensal,
    adicionarGasto, removerGastoDebito, removerGastoCredito,
    adicionarGastoMensal, removerGastoMensal, editarTransacao,
    virarMes, resetarDados,
    configuracoes, salvarConfiguracoes, alertaConfigurar, importarTransacoes,
    metas, adicionarMeta, removerMeta, contribuirMetaSaldo, agendarMeta,
    transacaoPendente, toast, mostrarToast,
  ])

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  )
}
