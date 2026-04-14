// ============================================================
//  Bolso Direito v2 — EscolherTipoGasto.jsx
//  Seleção de débito/crédito + número de parcelas.
//  Origem: app.js L417-490 (v1) — reescrito em React
// ============================================================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFinance } from '../hooks/useFinance'
import { moeda, hojeISO } from '../utils/format'
import PageHeader from '../components/ui/PageHeader'

function EscolherTipoGasto() {
  const navigate = useNavigate()
  const { transacaoPendente, setTransacaoPendente, adicionarGasto, mostrarToast } = useFinance()

  const [nome, setNome] = useState('')
  const [tipo, setTipo] = useState(null)      // 'debito' | 'credito'
  const [parcelas, setParcelas] = useState(1)

  if (!transacaoPendente) {
    navigate('/transacoes/teclado/gasto')
    return null
  }

  const handleSalvar = () => {
    if (!nome.trim()) {
      mostrarToast('Informe uma descrição para o gasto.', 'error')
      return
    }
    if (!tipo) {
      mostrarToast('Escolha o tipo de pagamento.', 'error')
      return
    }

    try {
      adicionarGasto({
        nome: nome.trim(),
        valor: transacaoPendente.valor,
        categoria: transacaoPendente.categoria,
        tipo,
        parcelas: tipo === 'credito' ? parcelas : 1,
        data: hojeISO(),
      })
      setTransacaoPendente(null)

      const textoTipo = tipo === 'credito'
        ? `no crédito (${parcelas}x de ${moeda(transacaoPendente.valor / parcelas)})`
        : 'no débito'
      mostrarToast(`Gasto de ${moeda(transacaoPendente.valor)} ${textoTipo} adicionado!`, 'success')
      navigate('/')
    } catch (err) {
      mostrarToast(err.message, 'error')
    }
  }

  const inputStyle = {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '12px',
    padding: '0.75rem 1rem',
    color: '#fff',
    fontSize: '0.95rem',
    width: '100%',
    outline: 'none',
    marginBottom: '1rem',
    transition: 'border-color 0.2s',
  }

  const tipoBtnBase = {
    flex: 1,
    padding: '1rem',
    borderRadius: '14px',
    border: '2px solid transparent',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '0.9rem',
    transition: 'all 0.15s',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.4rem',
  }

  return (
    <div style={{ maxWidth: 440, margin: '0 auto', padding: '1rem' }}>
      <PageHeader
        title="Tipo de Pagamento"
        subtitle={`${transacaoPendente.categoria} · ${moeda(transacaoPendente.valor)}`}
        backPath="/transacoes/categoria"
      />

      {/* Campo de nome */}
      <label style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.4rem', display: 'block' }}>
        Descrição do gasto
      </label>
      <input
        style={inputStyle}
        type="text"
        placeholder="Ex: Supermercado, Uber, Cinema..."
        value={nome}
        onChange={e => setNome(e.target.value)}
        maxLength={60}
        autoFocus
      />

      {/* Seleção de tipo */}
      <label style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.6rem', display: 'block' }}>
        Forma de pagamento
      </label>
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <button
          style={{
            ...tipoBtnBase,
            background: tipo === 'debito' ? 'rgba(240,106,106,0.18)' : 'rgba(255,255,255,0.05)',
            borderColor: tipo === 'debito' ? 'var(--bd-red)' : 'transparent',
            color: tipo === 'debito' ? 'var(--bd-red)' : 'rgba(255,255,255,0.6)',
          }}
          onClick={() => setTipo('debito')}
        >
          <i className="bi bi-lightning-charge" style={{ fontSize: '1.4rem' }} />
          Débito
          <span style={{ fontSize: '0.72rem', fontWeight: 400, opacity: 0.7 }}>Desconta agora</span>
        </button>
        <button
          style={{
            ...tipoBtnBase,
            background: tipo === 'credito' ? 'rgba(172,182,229,0.18)' : 'rgba(255,255,255,0.05)',
            borderColor: tipo === 'credito' ? 'var(--bd-purple)' : 'transparent',
            color: tipo === 'credito' ? 'var(--bd-purple)' : 'rgba(255,255,255,0.6)',
          }}
          onClick={() => setTipo('credito')}
        >
          <i className="bi bi-credit-card" style={{ fontSize: '1.4rem' }} />
          Crédito
          <span style={{ fontSize: '0.72rem', fontWeight: 400, opacity: 0.7 }}>Parcela na fatura</span>
        </button>
      </div>

      {/* Parcelas (só crédito) */}
      {tipo === 'credito' && (
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.4rem', display: 'block' }}>
            Número de parcelas: <strong style={{ color: 'var(--bd-purple)' }}>{parcelas}x</strong>
            {parcelas > 1 && (
              <span style={{ marginLeft: '0.5rem', color: 'rgba(255,255,255,0.4)' }}>
                ({moeda(transacaoPendente.valor / parcelas)} / mês)
              </span>
            )}
          </label>
          <input
            type="range"
            min={1}
            max={36}
            value={parcelas}
            onChange={e => setParcelas(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--bd-purple)' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.25rem' }}>
            <span>1x</span><span>18x</span><span>36x</span>
          </div>
        </div>
      )}

      {/* Botão salvar */}
      <button
        onClick={handleSalvar}
        disabled={!tipo || !nome.trim()}
        style={{
          width: '100%',
          padding: '0.9rem',
          borderRadius: '14px',
          border: 'none',
          background: tipo ? 'var(--bd-teal)' : 'rgba(255,255,255,0.08)',
          color: tipo ? '#0d1520' : 'rgba(255,255,255,0.3)',
          fontWeight: 700,
          fontSize: '1rem',
          cursor: tipo ? 'pointer' : 'not-allowed',
          transition: 'all 0.15s',
        }}
      >
        <i className="bi bi-check-circle" style={{ marginRight: '0.5rem' }} />
        Salvar Gasto
      </button>
    </div>
  )
}

export default EscolherTipoGasto
