import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFinance } from '../hooks/useFinance'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'

const ICONS = [
  'bi-piggy-bank', 'bi-car-front', 'bi-house-heart', 'bi-phone', 'bi-laptop', 'bi-graduation-cap',
  'bi-gem', 'bi-heart-pulse', 'bi-airplane', 'bi-music-note', 'bi-gift', 'bi-controller',
  'bi-hospital', 'bi-lamp', 'bi-camera', 'bi-joystick', 'bi-cash-stack', 'bi-bullseye',
]

const COLORS = [
  { value: '#4ee3c4', name: 'Teal' },
  { value: '#ACB6E5', name: 'Roxo' },
  { value: '#4ee3a0', name: 'Verde' },
  { value: '#f4c864', name: 'Amarelo' },
  { value: '#f06a6a', name: 'Vermelho' },
  { value: '#74ebd5', name: 'Cyan' },
]

function formatBRL(val) {
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function NovaMeta() {
  const navigate = useNavigate()
  const { adicionarMeta, saldo } = useFinance()

  const [icone, setIcone] = useState('bi-bullseye')
  const [nome, setNome] = useState('')
  const [valorAlvo, setValorAlvo] = useState('')
  const [aporteInicial, setAporteInicial] = useState('')
  const [cor, setCor] = useState('#4ee3c4')
  const [erro, setErro] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setErro('')

    if (!nome.trim()) {
      setErro('Dê um nome para sua meta.')
      return
    }

    const target = parseFloat(valorAlvo)
    if (!target || target <= 0) {
      setErro('Informe um valor-alvo válido.')
      return
    }

    const aporte = parseFloat(aporteInicial) || 0
    if (aporte > saldo) {
      setErro(`Saldo insuficiente. Disponível: ${formatBRL(saldo)}`)
      return
    }
    if (aporte < 0) {
      setErro('Aporte não pode ser negativo.')
      return
    }

    adicionarMeta({
      icone,
      nome: nome.trim(),
      valorAlvo: target,
      cor,
      aporteInicial: aporte,
    })

    navigate('/metas')
  }

  /* Preview values */
  const previewTarget = parseFloat(valorAlvo) || 0
  const previewAporte = parseFloat(aporteInicial) || 0
  const previewPct = previewTarget > 0
    ? Math.min(Math.round((previewAporte / previewTarget) * 100), 100)
    : 0

  return (
    <>
      <PageHeader
        greeting="Metas"
        title="Nova Meta"
      >
        <button className="meta-btn-back" onClick={() => navigate('/metas')}>
          <i className="bi bi-arrow-left"></i> Voltar
        </button>
      </PageHeader>

      <div className="row g-4">
        {/* ── Formulário ── */}
        <div className="col-12 col-lg-7">
          <Card>
            <form onSubmit={handleSubmit}>
              {/* Icon picker */}
              <label className="meta-form-label">Ícone da Meta</label>
              <div className="meta-emoji-grid">
                {ICONS.map(ic => (
                  <button
                    type="button"
                    key={ic}
                    className={`meta-emoji-btn${icone === ic ? ' selected' : ''}`}
                    onClick={() => setIcone(ic)}
                  >
                    <i className={`bi ${ic}`}></i>
                  </button>
                ))}
              </div>

              {/* Nome */}
              <label className="meta-form-label">Nome da Meta</label>
              <input
                className="meta-form-input"
                type="text"
                placeholder="Ex: Viagem para Europa"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />

              {/* Valor alvo */}
              <label className="meta-form-label">Valor a Alcançar (R$)</label>
              <input
                className="meta-form-input"
                type="number"
                step="0.01"
                min="0"
                placeholder="10000.00"
                value={valorAlvo}
                onChange={(e) => setValorAlvo(e.target.value)}
              />

              {/* Aporte inicial */}
              <label className="meta-form-label">
                Aporte Inicial (Opcional) — Saldo: {formatBRL(saldo)}
              </label>
              <input
                className="meta-form-input"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={aporteInicial}
                onChange={(e) => setAporteInicial(e.target.value)}
              />

              {/* Cor */}
              <label className="meta-form-label">Cor</label>
              <div className="meta-color-grid">
                {COLORS.map(c => (
                  <button
                    type="button"
                    key={c.value}
                    className={`meta-color-btn${cor === c.value ? ' selected' : ''}`}
                    style={{ background: c.value }}
                    onClick={() => setCor(c.value)}
                    title={c.name}
                  />
                ))}
              </div>

              {/* Error */}
              {erro && <div className="meta-form-error">{erro}</div>}

              {/* Actions */}
              <div className="meta-form-actions">
                <button
                  type="button"
                  className="meta-btn-back"
                  onClick={() => navigate('/metas')}
                >
                  Cancelar
                </button>
                <button type="submit" className="meta-btn-nova">
                  <i className="bi bi-check-lg"></i> Criar Meta
                </button>
              </div>
            </form>
          </Card>
        </div>

        {/* ── Preview ── */}
        <div className="col-12 col-lg-5">
          <Card>
            <h5 className="meta-section-label">Preview</h5>
            <div className="meta-preview-wrap">
              <div className="meta-preview-icon" style={{ color: cor }}>
                <i className={`bi ${icone}`}></i>
              </div>
              <div className="meta-preview-name">{nome || 'Minha Meta'}</div>
              <div className="meta-preview-target">
                {previewTarget > 0 ? formatBRL(previewTarget) : 'R$ 0,00'}
              </div>
              <div className="meta-preview-bar">
                <div className="progress" style={{ height: '8px' }}>
                  <div
                    className="progress-bar"
                    style={{
                      width: `${previewPct}%`,
                      background: cor,
                    }}
                  />
                </div>
              </div>
              {previewAporte > 0 && (
                <div className="meta-preview-aporte">
                  Aporte inicial: {formatBRL(previewAporte)} ({previewPct}%)
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}

export default NovaMeta
