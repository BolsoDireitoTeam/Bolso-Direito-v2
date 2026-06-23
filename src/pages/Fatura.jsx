// ============================================================
//  Bolso Direito v2 — Fatura.jsx
//  Visualização da fatura do cartão de crédito por mês,
//  com navegação entre faturas atuais e anteriores.
// ============================================================

import { useState, useMemo } from 'react'
import { useAppSelector } from '../store/hooks'
import { selectFaturas, selectConfiguracoes } from '../store/slices/financeSlice'
import { selectCategoryColorMap } from '../store/slices/categoriesSlice'
import { moeda, nomeMes, dataFormatada } from '../utils/format'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import '../styles/fatura.css'

function getMesAtual() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function offsetMes(mesAno, delta) {
  const [yyyy, mm] = mesAno.split('-').map(Number)
  const d = new Date(yyyy, mm - 1 + delta, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function Fatura() {
  const faturas = useAppSelector(selectFaturas)
  const configuracoes = useAppSelector(selectConfiguracoes)
  const categoryColorMap = useAppSelector(selectCategoryColorMap)
  const mesAtual = getMesAtual()

  // Meses disponíveis (todas as faturas + mês atual se não existir)
  const mesesDisponiveis = useMemo(() => {
    const meses = new Set(Object.keys(faturas))
    meses.add(mesAtual)
    // Adiciona também os próximos 3 meses para faturas futuras
    for (let i = 1; i <= 3; i++) {
      meses.add(offsetMes(mesAtual, i))
    }
    return [...meses].sort()
  }, [faturas, mesAtual])

  const [mesSelecionado, setMesSelecionado] = useState(mesAtual)

  // Itens da fatura do mês selecionado
  const itensFatura = useMemo(() => {
    return faturas[mesSelecionado] ?? []
  }, [faturas, mesSelecionado])

  // Stats
  const totalFatura = useMemo(() => {
    return Number(itensFatura.reduce((acc, p) => acc + (p.valorParcela || p.valor), 0).toFixed(2))
  }, [itensFatura])

  const qtdItens = itensFatura.length

  const categoriasDaFatura = useMemo(() => {
    const mapa = {}
    itensFatura.forEach(item => {
      const cat = item.categoria || 'Outros'
      mapa[cat] = (mapa[cat] || 0) + (item.valorParcela || item.valor)
    })
    return Object.entries(mapa)
      .map(([nome, valor]) => ({ nome, valor }))
      .sort((a, b) => b.valor - a.valor)
  }, [itensFatura])

  const limiteCartao = configuracoes?.limiteCartao || 0
  const percentualUsado = limiteCartao > 0 ? Math.min(100, Math.round((totalFatura / limiteCartao) * 100)) : 0

  const isMesAtual = mesSelecionado === mesAtual
  const isFuturo = mesSelecionado > mesAtual

  // Navegação
  const navAnterior = () => {
    const idx = mesesDisponiveis.indexOf(mesSelecionado)
    if (idx > 0) setMesSelecionado(mesesDisponiveis[idx - 1])
  }
  const navProximo = () => {
    const idx = mesesDisponiveis.indexOf(mesSelecionado)
    if (idx < mesesDisponiveis.length - 1) setMesSelecionado(mesesDisponiveis[idx + 1])
  }

  const idxAtual = mesesDisponiveis.indexOf(mesSelecionado)

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      <PageHeader
        title="Fatura do Cartão"
        subtitle="Compras parceladas e débitos no crédito"
      />

      {/* ── Navegação de meses ── */}
      <div className="fatura-nav">
        <button
          className="fatura-nav-btn"
          onClick={navAnterior}
          disabled={idxAtual <= 0}
        >
          <i className="bi bi-chevron-left" />
        </button>

        <div className="fatura-nav-label">
          {nomeMes(mesSelecionado)}
          {isMesAtual && <span className="fatura-nav-badge atual">Atual</span>}
          {isFuturo && <span className="fatura-nav-badge passada">Futura</span>}
          {!isMesAtual && !isFuturo && <span className="fatura-nav-badge passada">Anterior</span>}
        </div>

        <button
          className="fatura-nav-btn"
          onClick={navProximo}
          disabled={idxAtual >= mesesDisponiveis.length - 1}
        >
          <i className="bi bi-chevron-right" />
        </button>
      </div>

      {/* ── Timeline rápida ── */}
      <div className="fatura-timeline">
        {mesesDisponiveis.map(mes => {
          const NOMES_CURTOS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
          const [, mm] = mes.split('-').map(Number)
          const temItens = (faturas[mes]?.length || 0) > 0
          return (
            <button
              key={mes}
              className={`fatura-timeline-item${mes === mesSelecionado ? ' active' : ''}`}
              onClick={() => setMesSelecionado(mes)}
              style={temItens ? {} : { opacity: 0.5 }}
            >
              {NOMES_CURTOS[mm - 1]}
              {mes === mesAtual && ' •'}
            </button>
          )
        })}
      </div>

      {/* ── Summary cards ── */}
      <div className="fatura-summary">
        <div className="fatura-summary-card">
          <div className="fatura-summary-icon" style={{ background: 'rgba(172,182,229,0.12)', color: 'var(--bd-purple)' }}>
            <i className="bi bi-credit-card-2-front" />
          </div>
          <div className="fatura-summary-label">Total da Fatura</div>
          <div className="fatura-summary-value" style={{ color: totalFatura > 0 ? 'var(--bd-purple)' : 'var(--bd-muted)' }}>
            {moeda(totalFatura)}
          </div>
        </div>

        <div className="fatura-summary-card">
          <div className="fatura-summary-icon" style={{ background: 'rgba(78,227,196,0.12)', color: 'var(--bd-teal)' }}>
            <i className="bi bi-receipt" />
          </div>
          <div className="fatura-summary-label">Lançamentos</div>
          <div className="fatura-summary-value" style={{ color: 'var(--bd-teal)' }}>
            {qtdItens}
          </div>
        </div>

        <div className="fatura-summary-card">
          <div className="fatura-summary-icon" style={{
            background: percentualUsado > 80 ? 'rgba(240,106,106,0.12)' : 'rgba(244,200,100,0.12)',
            color: percentualUsado > 80 ? 'var(--bd-red)' : '#f4c864',
          }}>
            <i className="bi bi-speedometer2" />
          </div>
          <div className="fatura-summary-label">Uso do Limite</div>
          <div className="fatura-summary-value" style={{
            color: percentualUsado > 80 ? 'var(--bd-red)' : percentualUsado > 50 ? '#f4c864' : 'var(--bd-green)',
          }}>
            {limiteCartao > 0 ? `${percentualUsado}%` : '—'}
          </div>
        </div>
      </div>

      {/* ── Categorias breakdown ── */}
      {categoriasDaFatura.length > 0 && (
        <Card>
          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--bd-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
            Por Categoria
          </div>
          {categoriasDaFatura.map(({ nome, valor }) => {
            const pct = totalFatura > 0 ? Math.round((valor / totalFatura) * 100) : 0
            const cor = categoryColorMap[nome] || '#8a9bbf'
            return (
              <div key={nome} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: cor, flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: '0.82rem', color: 'var(--bd-text)' }}>{nome}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--bd-muted)', marginRight: '0.3rem' }}>{pct}%</span>
                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.85rem', color: 'var(--bd-text)' }}>
                  {moeda(valor)}
                </span>
              </div>
            )
          })}
        </Card>
      )}

      {/* ── Lista de itens da fatura ── */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--bd-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Lançamentos
          </span>
          {qtdItens > 0 && (
            <span style={{
              fontSize: '0.68rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '20px',
              padding: '0.15rem 0.5rem',
              color: 'var(--bd-muted)',
            }}>
              {qtdItens} {qtdItens === 1 ? 'item' : 'itens'}
            </span>
          )}
        </div>

        {itensFatura.length === 0 ? (
          <div className="fatura-empty">
            <i className="bi bi-credit-card" />
            <p>Nenhum lançamento nesta fatura</p>
            <small>{nomeMes(mesSelecionado)}</small>
          </div>
        ) : (
          <>
            {itensFatura.map((item, idx) => {
              const cor = categoryColorMap[item.categoria] || '#ACB6E5'
              return (
                <div className="fatura-item" key={item._id || item.id || idx}>
                  <div className="fatura-item-icon" style={{
                    background: `${cor}1F`,
                    color: cor,
                  }}>
                    <i className="bi bi-credit-card-2-front" />
                  </div>
                  <div className="fatura-item-info">
                    <strong>{item.nome}</strong>
                    <small>
                      {[
                        item.dataCompra ? dataFormatada(item.dataCompra) : null,
                        item.categoria,
                      ].filter(Boolean).join(' • ')}
                    </small>
                  </div>
                  {item.totalParcelas > 1 && (
                    <span className="fatura-item-parcela">
                      {item.parcela}/{item.totalParcelas}
                    </span>
                  )}
                  <span className="fatura-item-valor">
                    {moeda(item.valorParcela || item.valor)}
                  </span>
                </div>
              )
            })}

            {/* Total bar */}
            <div className="fatura-total-bar">
              <span className="fatura-total-label">
                <i className="bi bi-calculator" />
                Total da Fatura
              </span>
              <span className="fatura-total-value">
                {moeda(totalFatura)}
              </span>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}

export default Fatura
