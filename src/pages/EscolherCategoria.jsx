// ============================================================
//  Bolso Direito v2 — EscolherCategoria.jsx
//  Seletor de categoria para o fluxo de gasto.
//  Origem: app.js L321-350 (v1) — reescrito em React
// ============================================================

import { useNavigate } from 'react-router-dom'
import { useFinance } from '../hooks/useFinance'
import { moeda } from '../utils/format'
import PageHeader from '../components/ui/PageHeader'

const ICONES_CATEGORIA = {
  'Alimentação':  { icon: 'bi-cart3',          bg: 'rgba(78,227,160,0.12)',   color: 'var(--bd-green)' },
  'Transporte':   { icon: 'bi-car-front',       bg: 'rgba(78,227,196,0.12)',   color: 'var(--bd-teal)' },
  'Moradia':      { icon: 'bi-house',           bg: 'rgba(240,106,106,0.12)',  color: 'var(--bd-red)' },
  'Saúde':        { icon: 'bi-heart-pulse',     bg: 'rgba(240,106,106,0.14)',  color: '#ff8585' },
  'Lazer':        { icon: 'bi-controller',      bg: 'rgba(172,182,229,0.12)', color: 'var(--bd-purple)' },
  'Educação':     { icon: 'bi-book',            bg: 'rgba(244,200,100,0.12)', color: '#f4c864' },
  'Vestuário':    { icon: 'bi-bag',             bg: 'rgba(172,182,229,0.14)', color: '#c0caff' },
  'Assinaturas':  { icon: 'bi-music-note-beamed',bg: 'rgba(78,227,196,0.1)', color: 'var(--bd-teal)' },
  'Outros':       { icon: 'bi-three-dots',      bg: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.55)' },
}

function EscolherCategoria() {
  const navigate = useNavigate()
  const { categorias, transacaoPendente, setTransacaoPendente } = useFinance()

  // Redireciona se não há transação pendente
  if (!transacaoPendente) {
    navigate('/transacoes/teclado/gasto')
    return null
  }

  const handleCategoria = (categoria) => {
    setTransacaoPendente({ ...transacaoPendente, categoria })
    navigate('/transacoes/tipo')
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '1rem' }}>
      <PageHeader
        title="Escolher Categoria"
        subtitle={`Valor: ${moeda(transacaoPendente.valor)}`}
        backPath="/transacoes/teclado/gasto"
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.75rem',
        }}
      >
        {categorias.map(cat => {
          const cfg = ICONES_CATEGORIA[cat] || ICONES_CATEGORIA['Outros']
          return (
            <button
              key={cat}
              onClick={() => handleCategoria(cat)}
              style={{
                background: cfg.bg,
                border: `1px solid ${cfg.color}22`,
                borderRadius: '14px',
                padding: '1.1rem 0.5rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'transform 0.12s, background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <i
                className={`bi ${cfg.icon}`}
                style={{ fontSize: '1.5rem', color: cfg.color }}
              />
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.8)',
                  textAlign: 'center',
                  lineHeight: 1.2,
                }}
              >
                {cat}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default EscolherCategoria
