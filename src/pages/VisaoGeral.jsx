import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useFinance } from '../hooks/useFinance'
import { moeda, nomeMes } from '../utils/format'

import PageHeader from '../components/ui/PageHeader'
import StatCard from '../components/ui/StatCard'
import BalanceHero from '../components/finance/BalanceHero'
import TransactionList from '../components/finance/TransactionList'
import BudgetList from '../components/finance/BudgetList'
import GoalList from '../components/finance/GoalList'
import AlertaBanner from '../components/finance/AlertaBanner'
import BarChart from '../components/charts/BarChart'
import DoughnutChart from '../components/charts/DoughnutChart'
import LineChart from '../components/charts/LineChart'
import RadarChart from '../components/charts/RadarChart'
import GroupedBarChart from '../components/charts/GroupedBarChart'

// chartData removido — dados vêm do FinanceContext

function VisaoGeral({ onAddClick }) {
  const {
    saldo,
    transacoes,
    receitasMes,
    despesasMes,
    totalFaturaMesAtual,
    gastosPorCategoria,
    alertaConfigurar,
    metas,
    investimentosTotais,
    usuario,
    mesAnoFiltro,
  } = useFinance()

  // Últimas 6 transações
  const ultimasTransacoes = transacoes.slice(0, 6)

  // StatCards com dados reais
  const statCards = useMemo(() => [
    {
      title: 'Receitas',
      value: moeda(receitasMes),
      valueClass: 'income',
      icon: 'bi-arrow-down-circle',
      iconVariant: 'green',
      meta: { text: 'Mês atual' },
    },
    {
      title: 'Despesas',
      value: moeda(despesasMes),
      valueClass: 'expense',
      icon: 'bi-arrow-up-circle',
      iconVariant: 'red',
      meta: { text: 'Mês atual' },
    },
    {
      title: 'Economias',
      value: moeda(Math.max(0, receitasMes - despesasMes)),
      valueClass: 'saving',
      icon: 'bi-piggy-bank',
      iconVariant: 'purple',
      meta: {
        text: 'Taxa:',
        boldText: receitasMes > 0
          ? `${((1 - despesasMes / receitasMes) * 100).toFixed(0)}%`
          : '0%',
        boldColor: 'var(--bd-purple)',
      },
    },
    {
      title: 'Fatura CC',
      value: moeda(totalFaturaMesAtual),
      valueClass: '',
      icon: 'bi-credit-card-2-front',
      iconVariant: 'yellow',
      meta: { text: 'Mês corrente', boldText: '', boldColor: '#f4c864' },
    },
  ], [receitasMes, despesasMes, totalFaturaMesAtual])

  // BudgetCategories a partir dos gastos reais
  const budgetCategories = useMemo(() => {
    return Object.entries(gastosPorCategoria).map(([name, spent]) => ({
      name,
      spent,
      total: spent,  // sem meta definida ainda — 100%
      color: spent > 500 ? 'var(--bd-red)' : 'var(--bd-teal)',
    }))
  }, [gastosPorCategoria])

  // Transformar metas reais para o formato esperado pelo componente GoalList/GoalItem
  const metasFormatadas = useMemo(() => {
    return metas.map(m => ({
      ...m,
      name: m.nome,
      target: m.valorAlvo,
      current: m.valorAtual,
      pct: Math.min(100, Math.round((m.valorAtual / m.valorAlvo) * 100)),
      color: m.cor,
      emoji: <i className={`bi ${m.icone}`}></i> // Adaptando para aceitar ícone Bootstrap
    }))
  }, [metas])

  // ── Gráficos Reais ──

  // 1. Doughnut: Gastos por Categoria
  const realPieData = useMemo(() => {
    const categories = Object.keys(gastosPorCategoria)
    const values = Object.values(gastosPorCategoria)

    if (categories.length === 0) return {
      labels: ['Sem dados'],
      data: [1],
      colors: ['rgba(255,255,255,0.08)']
    }

    return {
      labels: categories,
      data: values,
      colors: ['#4ee3c4', '#ACB6E5', '#f06a6a', '#4ee3a0', '#f4c864', '#74ebd5', '#8a9bbf']
    }
  }, [gastosPorCategoria])

  // 2. Bar: Gastos por dia no mês selecionado
  const realBarData = useMemo(() => {
    const [yyyy, mm] = mesAnoFiltro.split('-').map(Number)
    const diasNoMes = new Date(yyyy, mm, 0).getDate()
    const labels = []
    const data = []
    for (let d = 1; d <= diasNoMes; d++) {
      const dia = `${mesAnoFiltro}-${String(d).padStart(2, '0')}`
      if (d % 4 === 1 || d === diasNoMes) labels.push(String(d))
      else labels.push('')
      data.push(
        transacoes
          .filter(t => t.data === dia && t.tipo === 'gasto')
          .reduce((acc, t) => acc + t.valor, 0)
      )
    }
    return { labels, data }
  }, [transacoes, mesAnoFiltro])

  // 3. Line: Variação acumulada do saldo no mês selecionado
  const realLineData = useMemo(() => {
    const [yyyy, mm] = mesAnoFiltro.split('-').map(Number)
    const diasNoMes = new Date(yyyy, mm, 0).getDate()
    const labels = []
    const data = []
    for (let d = 1; d <= diasNoMes; d++) {
      const dia = `${mesAnoFiltro}-${String(d).padStart(2, '0')}`
      if (d % 5 === 1 || d === diasNoMes) labels.push(String(d))
      else labels.push('')
      data.push(
        transacoes
          .filter(t => t.data === dia)
          .reduce((acc, t) => acc + (t.tipo === 'ganho' ? t.valor : -t.valor), 0)
      )
    }
    return { labels, data }
  }, [transacoes, mesAnoFiltro])

  // 4. Radar: Gastos por Categoria (% do total)
  const realRadarData = useMemo(() => {
    const cats = ['Alimentação', 'Transporte', 'Moradia', 'Lazer', 'Saúde', 'Educação']
    const atual = cats.map(c => gastosPorCategoria[c] || 0)
    const maxVal = Math.max(...atual, 1)
    return {
      labels: cats,
      atual: atual.map(v => Math.round((v / maxVal) * 100)),
      meta: cats.map(() => 100),
    }
  }, [gastosPorCategoria])

  // 5. Grouped Bar: Receitas vs Despesas nos últimos 7 meses
  const realGroupedBar = useMemo(() => {
    const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    const hoje = new Date()
    const labels = []
    const receitas = []
    const despesas = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      labels.push(MESES[d.getMonth()])
      const txMes = transacoes.filter(t => t.data && t.data.startsWith(key))
      receitas.push(txMes.filter(t => t.tipo === 'ganho').reduce((a, t) => a + t.valor, 0))
      despesas.push(txMes.filter(t => t.tipo === 'gasto').reduce((a, t) => a + t.valor, 0))
    }
    return { labels, receitas, despesas }
  }, [transacoes])

  return (
    <>
      {/* Page Header */}
      <PageHeader
        greeting={`Olá, ${usuario?.nome || 'Usuário'}!`}
        title="Visão Geral"
        dateBadge={nomeMes(mesAnoFiltro)}
      />

      {/* Alertas de fatura */}
      <AlertaBanner />

      {/* Alerta de Configuração (Issue #21) */}
      {alertaConfigurar && (
        <div className="alert-setup mb-3">
          <div className="alert-setup-icon">
            <i className="bi bi-gear-wide-connected"></i>
          </div>
          <div className="alert-setup-content">
            <p className="alert-setup-title">Ativar Automação Financeira</p>
            <p className="alert-setup-text">
              Configure o vencimento do seu cartão para que o BolsoDireito consolide seus meses automaticamente.
            </p>
          </div>
          <Link to="/editar-dados-financeiros" className="alert-setup-btn">
            Configurar
          </Link>
        </div>
      )}

      {/* ── Row 1: Balance + Stats ── */}
      <div className="row g-3 mb-3">
        {/* Balance Hero */}
        <div className="col-12 col-lg-5">
          <BalanceHero
            saldo={saldo}
            receitas={receitasMes}
            despesas={despesasMes}
            investido={investimentosTotais.montanteTotal}
          />
        </div>

        {/* Stat Cards */}
        {statCards.map((stat, i) => (
          <div className="col-6 col-lg" key={i}>
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      {/* ── Row 2: Bar Chart + Pie + Line ── */}
      <div className="row g-3 mb-3">
        <div className="col-12 col-lg-6">
          <BarChart data={realBarData} />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <DoughnutChart data={realPieData} />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <LineChart data={realLineData} />
        </div>
      </div>

      {/* ── Row 3: Transactions + Budget + Goals ── */}
      <div className="row g-3 mb-3">
        <div className="col-12 col-lg-5">
          <TransactionList transactions={ultimasTransacoes} />
        </div>
        <div className="col-12 col-sm-6 col-lg-4">
          <BudgetList categories={budgetCategories.length > 0 ? budgetCategories : []} />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <GoalList goals={metasFormatadas} />
        </div>
      </div>

      {/* ── Row 4: Radar + Grouped Bar ── */}
      <div className="row g-3">
        <div className="col-12 col-md-6 col-lg-4">
          <RadarChart data={realRadarData} />
        </div>
        <div className="col-12 col-md-6 col-lg-8">
          <GroupedBarChart data={realGroupedBar} />
        </div>
      </div>
    </>
  )
}

export default VisaoGeral
