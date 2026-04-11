import PageHeader from '../components/ui/PageHeader'
import StatCard from '../components/ui/StatCard'
import BalanceHero from '../components/finance/BalanceHero'
import TransactionList from '../components/finance/TransactionList'
import BudgetList from '../components/finance/BudgetList'
import GoalList from '../components/finance/GoalList'
import BarChart from '../components/charts/BarChart'
import DoughnutChart from '../components/charts/DoughnutChart'
import LineChart from '../components/charts/LineChart'
import RadarChart from '../components/charts/RadarChart'
import GroupedBarChart from '../components/charts/GroupedBarChart'

import {
  balanceData,
  statCards,
  transactions,
  budgetCategories,
  goals,
  chartData,
} from '../data/mockData'

function VisaoGeral({ onAddClick, usuario }) {
  return (
    <>
      {/* Page Header */}
      <PageHeader
        greeting={`Olá, ${usuario ? usuario.nome : 'Usuário'}!`}
        title="Visão Geral"
        dateBadge="Abril 2026"
      >
      </PageHeader>

      {/* ── Row 1: Balance + Stats ── */}
      <div className="row g-3 mb-3">
        {/* Balance Hero */}
        <div className="col-12 col-lg-5">
          <BalanceHero data={balanceData} />
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
          <BarChart data={chartData.barChart} />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <DoughnutChart data={chartData.pieChart} />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <LineChart data={chartData.lineChart} />
        </div>
      </div>

      {/* ── Row 3: Transactions + Budget + Goals ── */}
      <div className="row g-3 mb-3">
        <div className="col-12 col-lg-5">
          <TransactionList transactions={transactions} />
        </div>
        <div className="col-12 col-sm-6 col-lg-4">
          <BudgetList categories={budgetCategories} />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <GoalList goals={goals} />
        </div>
      </div>

      {/* ── Row 4: Radar + Grouped Bar ── */}
      <div className="row g-3">
        <div className="col-12 col-md-6 col-lg-4">
          <RadarChart data={chartData.radarChart} />
        </div>
        <div className="col-12 col-md-6 col-lg-8">
          <GroupedBarChart data={chartData.groupedBar} />
        </div>
      </div>
    </>
  )
}

export default VisaoGeral
