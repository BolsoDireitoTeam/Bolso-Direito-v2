/* ================================================================
   Mock Data – Bolso Direito
   Centraliza todos os dados de exemplo usados na Visão Geral.
   Quando conectar ao back-end, basta substituir estas constantes
   por chamadas de API.
   ================================================================ */

// ── Cores do design system ──────────────────────────────────────
export const colors = {
  teal:   '#4ee3c4',
  purple: '#ACB6E5',
  red:    '#f06a6a',
  green:  '#4ee3a0',
  yellow: '#f4c864',
  navy:   '#1a2236',
}

// ── Transações ──────────────────────────────────────────────────
export const transactions = [
  { id: 1, name: 'Salário',          date: '01 Jul, 2025', amount: '+R$ 5.800',    type: 'credit', icon: 'bi-building',           iconBg: 'rgba(78,227,160,0.12)', iconColor: 'var(--bd-green)' },
  { id: 2, name: 'Mercado Extra',    date: '02 Jul, 2025', amount: '-R$ 345',      type: 'debit',  icon: 'bi-cart3',              iconBg: 'rgba(240,106,106,0.12)', iconColor: 'var(--bd-red)' },
  { id: 3, name: 'Aluguel',          date: '05 Jul, 2025', amount: '-R$ 1.500',    type: 'debit',  icon: 'bi-house',              iconBg: 'rgba(240,106,106,0.12)', iconColor: 'var(--bd-red)' },
  { id: 4, name: 'Conta de Luz',     date: '07 Jul, 2025', amount: '-R$ 187',      type: 'debit',  icon: 'bi-lightning-charge',   iconBg: 'rgba(172,182,229,0.12)', iconColor: 'var(--bd-purple)' },
  { id: 5, name: 'Spotify',          date: '08 Jul, 2025', amount: '-R$ 21,90',    type: 'debit',  icon: 'bi-music-note-beamed',  iconBg: 'rgba(240,106,106,0.12)', iconColor: 'var(--bd-red)' },
  { id: 6, name: 'Freelance Design', date: '10 Jul, 2025', amount: '+R$ 800',      type: 'credit', icon: 'bi-cash-stack',         iconBg: 'rgba(78,227,160,0.12)', iconColor: 'var(--bd-green)' },
]

// ── Orçamento por Categoria ─────────────────────────────────────
export const budgetCategories = [
  { name: 'Moradia',      spent: 1500, total: 1500, color: 'var(--bd-red)' },
  { name: 'Alimentação',  spent: 800,  total: 1000, color: 'var(--bd-teal)' },
  { name: 'Transporte',   spent: 300,  total: 500,  color: 'var(--bd-teal)' },
  { name: 'Lazer',        spent: 400,  total: 400,  color: 'var(--bd-red)' },
  { name: 'Saúde',        spent: 120,  total: 300,  color: 'var(--bd-green)' },
  { name: 'Educação',     spent: 80,   total: 200,  color: 'var(--bd-green)' },
]

// ── Metas ───────────────────────────────────────────────────────
export const goals = [
  { id: 1, emoji: '🏖️', name: 'Viagem',  current: 3250,  target: 5000,  pct: 65, color: 'var(--bd-teal)' },
  { id: 2, emoji: '🚗', name: 'Carro Novo', current: 8800,  target: 40000, pct: 22, color: 'var(--bd-purple)' },
  { id: 3, emoji: '🏠', name: 'Reserva', current: 14400, target: 30000, pct: 48, color: '#f4c864' },
  { id: 4, emoji: '📱', name: 'iPhone',  current: 5400,  target: 6000,  pct: 90, color: 'var(--bd-green)' },
]

// ── Dados do Saldo (Balance Hero) ───────────────────────────────
export const balanceData = {
  saldo: 'R$ 3.250,00',
  changePct: '+12,4%',
  changeText: 'vs mês anterior',
  changeDirection: 'up',
  receitas: 'R$ 5.800',
  despesas: 'R$ 3.100',
  investido: 'R$ 1.450',
}

// ── Stat Cards ──────────────────────────────────────────────────
export const statCards = [
  { title: 'Receitas',   value: 'R$ 5.800', valueClass: 'income',  icon: 'bi-arrow-down-circle',    iconVariant: 'green',  meta: { icon: 'bi-arrow-up-right', text: '+8% vs jun', colorClass: 'text-success' } },
  { title: 'Despesas',   value: 'R$ 3.100', valueClass: 'expense', icon: 'bi-arrow-up-circle',      iconVariant: 'red',    meta: { icon: 'bi-arrow-down-right', text: '+3% vs jun', colorClass: 'text-danger' } },
  { title: 'Economias',  value: 'R$ 1.450', valueClass: 'saving',  icon: 'bi-piggy-bank',           iconVariant: 'purple', meta: { text: 'Taxa:', boldText: '25%', boldColor: 'var(--bd-purple)' } },
  { title: 'Fatura CC',  value: 'R$ 1.820', valueClass: '',        icon: 'bi-credit-card-2-front',  iconVariant: 'yellow', meta: { text: 'Vence em', boldText: '5 dias', boldColor: '#f4c864' } },
]

// ── Dados dos Gráficos ──────────────────────────────────────────
export const chartData = {
  barChart: {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
    data: [1200, 950, 1050, 450, 1100, 950, 1100],
  },
  pieChart: {
    labels: ['Moradia', 'Alimentação', 'Transporte', 'Lazer', 'Outros'],
    data: [1500, 800, 300, 400, 100],
    colors: ['#2c3e50', colors.teal, colors.purple, '#f4c864', colors.green],
  },
  lineChart: {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
    data: [1800, 2100, 1900, 2600, 2400, 2900, 3250],
  },
  radarChart: {
    labels: ['Moradia', 'Alimentação', 'Transporte', 'Lazer', 'Saúde', 'Educação'],
    atual: [100, 80, 60, 100, 40, 40],
    meta: [100, 100, 100, 80, 100, 100],
  },
  groupedBar: {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
    receitas: [5000, 5200, 4800, 5800, 5400, 5600, 5800],
    despesas: [3200, 2800, 3100, 2600, 3000, 2700, 3100],
  },
}

// ── Navegação Sidebar ───────────────────────────────────────────
export const sidebarNavItems = [
  { label: 'Visão Geral', icon: 'bi-grid-1x2',        path: '/' },
  { label: 'Metas',       icon: 'bi-bullseye',         path: '/metas' },
  { label: 'Investimentos',icon: 'bi-graph-up-arrow',  path: '/investimentos' },
]

// ── Ações do Action Sheet ───────────────────────────────────────
export const actionSheetActions = [
  { label: 'Novo Ganho',       icon: 'bi-plus-circle' },
  { label: 'Novo Gasto',       icon: 'bi-dash-circle' },
  { label: 'Importar Extrato', icon: 'bi-upload' },
  { label: 'Importar Fatura',  icon: 'bi-credit-card-2-front' },
]

// ── Investimentos ───────────────────────────────────────────────
export const investmentsData = [
  { id: 1, name: 'Tesouro Selic 2029', type: 'Renda Fixa', value: 'R$ 15.000,00', returnLastWeek: '+R$ 32,50', returnPct: '+0.21%', color: 'var(--bd-teal)', icon: 'bi-safe' },
  { id: 2, name: 'Fundo Imobiliário MXRF11', type: 'Renda Variável', value: 'R$ 3.450,00', returnLastWeek: '+R$ 15,30', returnPct: '+0.45%', color: 'var(--bd-purple)', icon: 'bi-buildings' },
  { id: 3, name: 'Ações PETR4', type: 'Renda Variável', value: 'R$ 2.100,00', returnLastWeek: '-R$ 45,00', returnPct: '-2.10%', color: 'var(--bd-red)', icon: 'bi-graph-down-arrow' },
  { id: 4, name: 'CDB Banco Inter', type: 'Renda Fixa', value: 'R$ 8.200,00', returnLastWeek: '+R$ 18,20', returnPct: '+0.22%', color: 'var(--bd-green)', icon: 'bi-bank' },
]
