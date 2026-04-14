/* ================================================================
   Constants – Bolso Direito
   Constantes de design e navegação utilizadas pelo app.
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

// ── Navegação Sidebar ───────────────────────────────────────────
export const sidebarNavItems = [
  { label: 'Visão Geral',   icon: 'bi-grid-1x2',       path: '/' },
  { label: 'Transações',    icon: 'bi-list-check',      path: '/transacoes' },
  { label: 'View Mensal',   icon: 'bi-calendar3',       path: '/view-mensal' },
  { label: 'Metas',         icon: 'bi-bullseye',        path: '/metas' },
  { label: 'Investimentos', icon: 'bi-graph-up-arrow',  path: '/investimentos' },
]
