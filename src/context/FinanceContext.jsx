// ============================================================
//  Bolso Direito v2 — FinanceContext.jsx
//  Provider central de estado financeiro (BolsoDB + BolsoEngine)
//  Todas as mutações passam por aqui para garantir re-renders.
// ============================================================

import { createContext, useState, useEffect, useMemo, useCallback } from 'react'
import { BolsoDB } from '../services/BolsoDB'
import { BolsoEngine } from '../services/BolsoEngine'
import { MetaDB } from '../services/MetaDB'
import { InvestimentoDB } from '../services/InvestimentoDB'
import { mesAtual } from '../utils/format'
import { useAutoViradaMes } from '../hooks/useAutoViradaMes'

export const FinanceContext = createContext(null)

export function FinanceProvider({ children }) {
  // ── Version counter: cada mutação incrementa para forçar recálculo ──
  const [version, setVersion] = useState(0)
  const bump = useCallback(() => setVersion(v => v + 1), [])

  // ── Filtro global de mês/ano — "ambiente" do app ──
  const [mesAnoFiltro, setMesAnoFiltro] = useState(() => mesAtual())

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

  // ── Usuário e Financeiro (persistidos no localStorage) ──
  const [usuario, setUsuario] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bd_usuario')) ?? { nome: 'Usuário', email: '', celular: '', avatar: null } }
    catch { return { nome: 'Usuário', email: '', celular: '', avatar: null } }
  })
  const [financeiro, setFinanceiro] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bd_financeiro')) ?? null }
    catch { return null }
  })

  const salvarUsuario = useCallback((patch) => {
    setUsuario(prev => {
      const atualizado = { ...prev, ...patch }
      localStorage.setItem('bd_usuario', JSON.stringify(atualizado))
      return atualizado
    })
  }, [])

  const salvarFinanceiro = useCallback((dados) => {
    setFinanceiro(dados)
    localStorage.setItem('bd_financeiro', JSON.stringify(dados))
  }, [])

  // ── Inicializar BolsoDB, MetaDB, InvestimentoDB e auto-virada ──
  useEffect(() => {
    BolsoDB.init()
    MetaDB.init()
    InvestimentoDB.init()
    const { alertaConfigurar: alerta } = executarAutoVirada() ?? {}
    setAlertaConfigurar(!!alerta)
    bump()
  }, [bump, executarAutoVirada])

  // ── Dados derivados — recalculam quando version muda ──
  const saldo = useMemo(() => BolsoDB.getSaldo(), [version])
  const transacoes = useMemo(() => BolsoDB.getTransacoes(), [version])
  const estado = useMemo(() => BolsoDB.getEstado(), [version])
  const alertas = useMemo(() => BolsoEngine.calcularAlertas(), [version])

  // ── Dados filtrados pelo mês/ano selecionado globalmente ──
  const transacoesMesAtual = useMemo(() => {
    return transacoes.filter(tx => tx.data && tx.data.startsWith(mesAnoFiltro))
  }, [transacoes, mesAnoFiltro])

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
    return BolsoDB.getTotalFatura(mesAnoFiltro)
  }, [version, mesAnoFiltro])

  // Gastos por categoria no mês filtrado
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
    if (params.aporteInicial && params.aporteInicial > 0) {
      BolsoDB.adicionarGasto({
        nome: `Aporte inicial: ${params.nome}`,
        valor: params.aporteInicial,
        categoria: 'Poupança',
        tipo: 'debito'
      })
      MetaDB.contribuir(nova.id, params.aporteInicial, 'aporte')
    }
    bump()
    mostrarToast('Meta criada com sucesso! 🎯', 'success')
    return nova
  }, [bump, mostrarToast])

  const removerMeta = useCallback((id) => {
    const meta = MetaDB.listar().find(m => m.id === id)
    if (meta && meta.valorAtual > 0) {
      BolsoDB.adicionarGanho({
        nome: `Resgate [Meta excluída]: ${meta.nome}`,
        valor: meta.valorAtual,
      })
    }
    MetaDB.remover(id)
    bump()
    mostrarToast('Meta excluída.', 'success')
  }, [bump, mostrarToast])

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
      MetaDB.contribuir(id, valor, 'aporte')
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

  const resgatarMetaSaldo = useCallback((id, valor) => {
    try {
      const meta = MetaDB.listar().find(m => m.id === id)
      if (!meta) throw new Error('Meta não encontrada')
      if (valor > meta.valorAtual) throw new Error('Valor excede o disponível na meta')

      BolsoDB.adicionarGanho({
        nome: `Resgate: ${meta.nome}`,
        valor,
      })
      MetaDB.resgatar(id, valor)
      bump()
      mostrarToast('Resgate realizado com sucesso!', 'success')
    } catch (err) {
      console.error('[FinanceContext] Erro no resgate:', err)
      mostrarToast(err.message, 'error')
    }
  }, [bump, mostrarToast])

  const editarMeta = useCallback((id, patch) => {
    MetaDB.editar(id, patch)
    bump()
    mostrarToast('Meta atualizada!', 'success')
  }, [bump, mostrarToast])

  // ── Investimentos ──
  const investimentos = useMemo(() => InvestimentoDB.listar(), [version])
  const investimentosTotais = useMemo(() => InvestimentoDB.getTotais(), [version])

  const adicionarInvestimento = useCallback((params) => {
    const inv = InvestimentoDB.adicionar(params)
    bump()
    mostrarToast('Investimento adicionado!', 'success')
    return inv
  }, [bump, mostrarToast])

  const removerInvestimento = useCallback((id) => {
    const inv = InvestimentoDB.remover(id)
    if (inv) {
      // Devolver montante acumulado ao saldo
      const { montante } = InvestimentoDB.calcularValorAcumulado(inv)
      if (montante > 0) {
        BolsoDB.adicionarGanho({
          nome: `Resgate investimento: ${inv.nome}`,
          valor: montante,
        })
      }
      bump()
      mostrarToast('Investimento resgatado e valor devolvido ao saldo.', 'success')
    }
    return inv
  }, [bump, mostrarToast])

  const editarInvestimento = useCallback((id, patch) => {
    InvestimentoDB.editar(id, patch)
    bump()
    mostrarToast('Investimento atualizado!', 'success')
  }, [bump, mostrarToast])

  const aportarInvestimento = useCallback((id, valor) => {
    try {
      const inv = InvestimentoDB.listar().find(i => i.id === id)
      if (!inv) throw new Error('Investimento não encontrado')
      BolsoDB.adicionarGasto({
        nome: `Aporte: ${inv.nome}`,
        valor,
        categoria: 'Poupança',
        tipo: 'debito'
      })
      InvestimentoDB.aportar(id, valor)
      bump()
      mostrarToast('Aporte realizado com sucesso!', 'success')
    } catch (err) {
      console.error('[FinanceContext] Erro no aporte:', err)
      mostrarToast(err.message, 'error')
    }
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

    // Metas
    metas,
    adicionarMeta,
    removerMeta,
    contribuirMetaSaldo,
    resgatarMetaSaldo,
    editarMeta,
    agendarMeta,

    // Investimentos
    investimentos,
    investimentosTotais,
    adicionarInvestimento,
    removerInvestimento,
    editarInvestimento,
    aportarInvestimento,
    calcularValorInvestimento: InvestimentoDB.calcularValorAcumulado,

    // Configurações do Sistema
    configuracoes,
    salvarConfiguracoes,
    alertaConfigurar,

    // Importação em lote
    importarTransacoes,

    // Constantes
    categorias: BolsoDB.CATEGORIAS,
    tiposGasto: BolsoDB.TIPOS_GASTO,

    // Fluxo de gasto entre páginas
    transacaoPendente,
    setTransacaoPendente,

    // Filtro global de mês/ano
    mesAnoFiltro,
    setMesAnoFiltro,

    // Usuário e Financeiro
    usuario,
    financeiro,
    salvarUsuario,
    salvarFinanceiro,

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
    metas, adicionarMeta, removerMeta, contribuirMetaSaldo, resgatarMetaSaldo, editarMeta, agendarMeta,
    investimentos, investimentosTotais, adicionarInvestimento, removerInvestimento, editarInvestimento, aportarInvestimento,
    usuario, financeiro, salvarUsuario, salvarFinanceiro,
    transacaoPendente, toast, mostrarToast,
    mesAnoFiltro, setMesAnoFiltro,
  ])

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  )
}
