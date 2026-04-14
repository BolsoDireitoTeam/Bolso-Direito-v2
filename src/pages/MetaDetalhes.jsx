import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useFinance } from '../hooks/useFinance'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import ProgressBar from '../components/ui/ProgressBar'

function formatBRL(val) {
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

const ICONS = [
  'bi-piggy-bank', 'bi-car-front', 'bi-house-heart', 'bi-phone', 'bi-laptop', 'bi-graduation-cap',
  'bi-gem', 'bi-heart-pulse', 'bi-airplane', 'bi-music-note', 'bi-gift', 'bi-controller',
  'bi-hospital', 'bi-lamp', 'bi-camera', 'bi-joystick', 'bi-cash-stack', 'bi-bullseye',
]

const COLORS = [
  { value: '#4ee3c4' },
  { value: '#ACB6E5' },
  { value: '#4ee3a0' },
  { value: '#f4c864' },
  { value: '#f06a6a' },
  { value: '#74ebd5' },
]

function MetaDetalhes() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    metas, saldo,
    contribuirMetaSaldo, resgatarMetaSaldo,
    editarMeta, removerMeta
  } = useFinance()

  const meta = metas.find(m => m.id === id)

  /* ── Modal state ── */
  const [modal, setModal] = useState(null) // 'aporte' | 'resgate' | 'editar' | 'confirmar-excluir'
  const [modalValor, setModalValor] = useState('')
  const [modalErro, setModalErro] = useState('')

  /* ── Edit state ── */
  const [editNome, setEditNome] = useState('')
  const [editIcone, setEditIcone] = useState('')
  const [editTarget, setEditTarget] = useState('')
  const [editColor, setEditColor] = useState('')

  /* ── Not found ── */
  if (!meta) {
    return (
      <div className="meta-empty">
        <div className="meta-empty-icon"><i className="bi bi-x-circle"></i></div>
        <p>Meta não encontrada.</p>
        <button className="meta-btn-nova" onClick={() => navigate('/metas')}>
          <i className="bi bi-arrow-left"></i> Voltar para Metas
        </button>
      </div>
    )
  }

  const pct = meta.valorAlvo > 0
    ? Math.min(Math.round((meta.valorAtual / meta.valorAlvo) * 100), 100)
    : 0
  const isComplete = pct >= 100
  const aportes = meta.aportes || []
  const sortedAportes = [...aportes].sort((a, b) => new Date(b.data) - new Date(a.data))

  /* ── Open edit modal ── */
  const openEdit = () => {
    setEditNome(meta.nome)
    setEditIcone(meta.icone)
    setEditTarget(String(meta.valorAlvo))
    setEditColor(meta.cor)
    setModal('editar')
    setModalErro('')
  }

  /* ── Aporte handler ── */
  const handleAporte = () => {
    const valor = parseFloat(modalValor)
    if (!valor || valor <= 0) {
      setModalErro('Informe um valor válido.')
      return
    }
    if (valor > saldo) {
      setModalErro(`Saldo insuficiente. Disponível: ${formatBRL(saldo)}`)
      return
    }
    contribuirMetaSaldo(meta.id, valor)
    setModal(null)
    setModalValor('')
    setModalErro('')
  }

  /* ── Resgate handler ── */
  const handleResgate = () => {
    const valor = parseFloat(modalValor)
    if (!valor || valor <= 0) {
      setModalErro('Informe um valor válido.')
      return
    }
    if (valor > meta.valorAtual) {
      setModalErro(`Máximo resgatável: ${formatBRL(meta.valorAtual)}`)
      return
    }
    resgatarMetaSaldo(meta.id, valor)
    setModal(null)
    setModalValor('')
    setModalErro('')
  }

  /* ── Edit handler ── */
  const handleEdit = () => {
    const target = parseFloat(editTarget)
    if (!editNome.trim()) {
      setModalErro('Nome é obrigatório.')
      return
    }
    if (!target || target <= 0) {
      setModalErro('Valor-alvo deve ser maior que zero.')
      return
    }
    editarMeta(meta.id, {
      nome: editNome.trim(),
      icone: editIcone,
      valorAlvo: target,
      cor: editColor,
    })
    setModal(null)
    setModalErro('')
  }

  /* ── Delete handler ── */
  const handleDelete = () => {
    removerMeta(meta.id)
    navigate('/metas')
  }

  return (
    <>
      <PageHeader
        greeting="Metas"
        title={meta.nome}
      >
        <button className="meta-btn-back" onClick={() => navigate('/metas')}>
          <i className="bi bi-arrow-left"></i> Voltar
        </button>
      </PageHeader>

      <div className="row g-4">
        {/* ══ Left: Progress + Actions ══ */}
        <div className="col-12 col-lg-5">

          {/* Progress Hero */}
          <div className="meta-progress-hero">
            <div className="meta-progress-icon" style={{ color: meta.cor }}>
              <i className={`bi ${meta.icone || 'bi-piggy-bank'}`}></i>
            </div>
            <div className="meta-progress-name">{meta.nome}</div>
            <div className="meta-progress-amount" style={{ color: meta.cor }}>
              {formatBRL(meta.valorAtual)}
            </div>
            <div className="meta-progress-target">
              de {formatBRL(meta.valorAlvo)}
            </div>
            <div className="meta-progress-bar-wrap">
              <ProgressBar
                value={meta.valorAtual}
                max={meta.valorAlvo}
                color={meta.cor}
                height="10px"
              />
            </div>
            <div className="meta-progress-pct" style={{ color: meta.cor }}>
              {pct}%
            </div>
            {isComplete && (
              <div className="meta-badge-complete" style={{ marginTop: '0.75rem' }}>
                <i className="bi bi-trophy-fill"></i> Meta Conquistada! 🎉
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="meta-action-row">
            <button
              className="meta-btn-aporte"
              onClick={() => { setModal('aporte'); setModalValor(''); setModalErro('') }}
            >
              <i className="bi bi-plus-circle"></i> Aportar
            </button>
            <button
              className="meta-btn-resgate"
              onClick={() => { setModal('resgate'); setModalValor(''); setModalErro('') }}
              disabled={meta.valorAtual <= 0}
            >
              <i className="bi bi-dash-circle"></i> Resgatar
            </button>
          </div>

          {/* Saldo card */}
          <div className="meta-saldo-card">
            <span className="meta-saldo-label">
              <i className="bi bi-wallet2"></i> Saldo disponível
            </span>
            <span className="meta-saldo-value">
              {formatBRL(saldo)}
            </span>
          </div>

          {/* Manage section */}
          <div className="meta-danger-zone">
            <div className="meta-manage-row">
              <button className="meta-btn-edit" onClick={openEdit}>
                <i className="bi bi-pencil"></i> Editar
              </button>
              <button
                className="meta-btn-delete"
                onClick={() => { setModal('confirmar-excluir'); setModalErro('') }}
              >
                <i className="bi bi-trash3"></i> Excluir
              </button>
            </div>
          </div>
        </div>

        {/* ══ Right: History ══ */}
        <div className="col-12 col-lg-7">
          <Card>
            <h5 className="meta-section-label">
              Histórico de Movimentações
              <span className="meta-history-count">{aportes.length}</span>
            </h5>

            {sortedAportes.length === 0 ? (
              <div className="meta-history-empty">
                Nenhum aporte registrado ainda.
              </div>
            ) : (
              sortedAportes.map(ap => {
                const isAporte = ap.tipo === 'aporte' || ap.tipo === 'autopilot'
                return (
                  <div className="meta-history-item" key={ap.id}>
                    <div
                      className="meta-history-icon"
                      style={{
                        background: isAporte ? 'rgba(78,227,160,0.12)' : 'rgba(240,106,106,0.12)',
                        color: isAporte ? 'var(--bd-green)' : 'var(--bd-red)',
                      }}
                    >
                      <i className={`bi ${isAporte ? 'bi-arrow-down-circle' : 'bi-arrow-up-circle'}`}></i>
                    </div>
                    <div className="meta-history-info">
                      <strong>{isAporte ? 'Aporte' : 'Resgate'}</strong>
                      <small>{formatDate(ap.data)}</small>
                    </div>
                    <div
                      className="meta-history-value"
                      style={{ color: isAporte ? 'var(--bd-green)' : 'var(--bd-red)' }}
                    >
                      {isAporte ? '+' : '−'}{formatBRL(ap.valor)}
                    </div>
                  </div>
                )
              })
            )}
          </Card>
        </div>
      </div>

      {/* ══════════════════════ MODAIS ══════════════════════ */}

      {/* ── Modal: Aporte / Resgate ── */}
      <div
        className={`meta-modal-overlay${modal === 'aporte' || modal === 'resgate' ? ' active' : ''}`}
        onClick={() => setModal(null)}
      >
        <div className="meta-modal" onClick={(e) => e.stopPropagation()}>
          <h3>{modal === 'aporte' ? '💰 Adicionar Aporte' : '📤 Resgatar Valor'}</h3>

          <p className="meta-modal-context">
            {modal === 'aporte'
              ? `Saldo disponível: ${formatBRL(saldo)}`
              : `Disponível na meta: ${formatBRL(meta.valorAtual)}`
            }
          </p>

          <input
            className="meta-modal-input"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={modalValor}
            onChange={(e) => { setModalValor(e.target.value); setModalErro('') }}
            autoFocus
          />

          {modalErro && (
            <div className="meta-modal-hint meta-modal-hint-error">{modalErro}</div>
          )}

          <div className="meta-modal-actions">
            <button className="meta-btn-back" onClick={() => setModal(null)}>
              Cancelar
            </button>
            <button
              className={modal === 'aporte' ? 'meta-btn-aporte' : 'meta-btn-resgate'}
              onClick={modal === 'aporte' ? handleAporte : handleResgate}
            >
              <i className={`bi ${modal === 'aporte' ? 'bi-check-lg' : 'bi-arrow-up-circle'}`}></i>
              {modal === 'aporte' ? ' Confirmar' : ' Resgatar'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Modal: Editar ── */}
      <div
        className={`meta-modal-overlay${modal === 'editar' ? ' active' : ''}`}
        onClick={() => setModal(null)}
      >
        <div className="meta-modal meta-modal-wide" onClick={(e) => e.stopPropagation()}>
          <h3>✏️ Editar Meta</h3>

          <label className="meta-form-label">Ícone</label>
          <div className="meta-emoji-grid meta-emoji-grid-compact">
            {ICONS.map(ic => (
              <button
                type="button"
                key={ic}
                className={`meta-emoji-btn${editIcone === ic ? ' selected' : ''}`}
                onClick={() => setEditIcone(ic)}
              >
                <i className={`bi ${ic}`}></i>
              </button>
            ))}
          </div>

          <label className="meta-form-label">Nome</label>
          <input
            className="meta-form-input"
            type="text"
            value={editNome}
            onChange={(e) => setEditNome(e.target.value)}
          />

          <label className="meta-form-label">Valor-alvo (R$)</label>
          <input
            className="meta-form-input"
            type="number"
            step="0.01"
            min="0"
            value={editTarget}
            onChange={(e) => setEditTarget(e.target.value)}
          />

          <label className="meta-form-label">Cor</label>
          <div className="meta-color-grid">
            {COLORS.map(c => (
              <button
                type="button"
                key={c.value}
                className={`meta-color-btn${editColor === c.value ? ' selected' : ''}`}
                style={{ background: c.value }}
                onClick={() => setEditColor(c.value)}
              />
            ))}
          </div>

          {modalErro && (
            <div className="meta-modal-hint meta-modal-hint-error">{modalErro}</div>
          )}

          <div className="meta-modal-actions">
            <button className="meta-btn-back" onClick={() => setModal(null)}>
              Cancelar
            </button>
            <button className="meta-btn-aporte" onClick={handleEdit}>
              <i className="bi bi-check-lg"></i> Salvar
            </button>
          </div>
        </div>
      </div>

      {/* ── Modal: Confirmar Exclusão ── */}
      <div
        className={`meta-modal-overlay${modal === 'confirmar-excluir' ? ' active' : ''}`}
        onClick={() => setModal(null)}
      >
        <div className="meta-modal" onClick={(e) => e.stopPropagation()}>
          <h3>🗑️ Excluir Meta</h3>
          <p className="meta-modal-context">
            Tem certeza que deseja excluir <strong>{meta.nome}</strong>?
          </p>
          {meta.valorAtual > 0 && (
            <p className="meta-modal-context" style={{ marginTop: '0.25rem' }}>
              O valor de <strong style={{ color: 'var(--bd-teal)' }}>{formatBRL(meta.valorAtual)}</strong> será devolvido ao seu saldo.
            </p>
          )}
          <div className="meta-modal-actions">
            <button className="meta-btn-back" onClick={() => setModal(null)}>
              Cancelar
            </button>
            <button className="meta-btn-delete" style={{ flex: 1 }} onClick={handleDelete}>
              <i className="bi bi-trash3"></i> Confirmar Exclusão
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default MetaDetalhes
