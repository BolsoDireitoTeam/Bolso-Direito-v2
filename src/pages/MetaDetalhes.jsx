import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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

const EMOJIS = [
  '🏖️', '🚗', '🏠', '📱', '💻', '🎓',
  '💍', '🏋️', '✈️', '🎸', '🐶', '👶',
  '🏥', '🛋️', '📸', '🎮', '💰', '🎯',
]

const COLORS = [
  { value: '#4ee3c4' },
  { value: '#ACB6E5' },
  { value: '#4ee3a0' },
  { value: '#f4c864' },
  { value: '#f06a6a' },
  { value: '#74ebd5' },
]

function MetaDetalhes({ metas, usuario, onAporte, onResgate, onUpdate, onDelete }) {
  const { id } = useParams()
  const navigate = useNavigate()

  const meta = metas.find(m => m.id === Number(id))

  /* ── Modal state ── */
  const [modal, setModal] = useState(null) // 'aporte' | 'resgate' | 'editar' | 'confirmar-excluir'
  const [modalValor, setModalValor] = useState('')
  const [modalErro, setModalErro] = useState('')

  /* ── Edit state ── */
  const [editNome, setEditNome] = useState('')
  const [editEmoji, setEditEmoji] = useState('')
  const [editTarget, setEditTarget] = useState('')
  const [editColor, setEditColor] = useState('')

  /* ── Not found ── */
  if (!meta) {
    return (
      <div className="meta-empty">
        <div className="meta-empty-icon">❌</div>
        <p>Meta não encontrada.</p>
        <button className="meta-btn-nova" onClick={() => navigate('/metas')}>
          <i className="bi bi-arrow-left"></i> Voltar para Metas
        </button>
      </div>
    )
  }

  const pct = meta.targetValue > 0
    ? Math.min(Math.round((meta.currentValue / meta.targetValue) * 100), 100)
    : 0
  const isComplete = pct >= 100
  const sortedAportes = [...meta.aportes].sort((a, b) => new Date(b.data) - new Date(a.data))

  /* ── Open edit modal ── */
  const openEdit = () => {
    setEditNome(meta.name)
    setEditEmoji(meta.emoji)
    setEditTarget(String(meta.targetValue))
    setEditColor(meta.color)
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
    if (valor > usuario.saldo) {
      setModalErro(`Saldo insuficiente. Disponível: ${formatBRL(usuario.saldo)}`)
      return
    }
    onAporte(meta.id, valor)
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
    if (valor > meta.currentValue) {
      setModalErro(`Máximo resgatável: ${formatBRL(meta.currentValue)}`)
      return
    }
    onResgate(meta.id, valor)
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
    onUpdate(meta.id, {
      name: editNome.trim(),
      emoji: editEmoji,
      targetValue: target,
      color: editColor,
    })
    setModal(null)
    setModalErro('')
  }

  /* ── Delete handler ── */
  const handleDelete = () => {
    onDelete(meta.id)
    navigate('/metas')
  }

  return (
    <>
      <PageHeader
        greeting="Metas"
        title={`${meta.emoji} ${meta.name}`}
        dateBadge="Abril 2026"
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
            <div className="meta-progress-emoji">{meta.emoji}</div>
            <div className="meta-progress-name">{meta.name}</div>
            <div className="meta-progress-amount" style={{ color: meta.color }}>
              {formatBRL(meta.currentValue)}
            </div>
            <div className="meta-progress-target">
              de {formatBRL(meta.targetValue)}
            </div>
            <div className="meta-progress-bar-wrap">
              <ProgressBar
                value={meta.currentValue}
                max={meta.targetValue}
                color={meta.color}
                height="10px"
              />
            </div>
            <div className="meta-progress-pct" style={{ color: meta.color }}>
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
              disabled={meta.currentValue <= 0}
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
              {formatBRL(usuario.saldo)}
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
              <span className="meta-history-count">{meta.aportes.length}</span>
            </h5>

            {sortedAportes.length === 0 ? (
              <div className="meta-history-empty">
                Nenhum aporte registrado ainda.
              </div>
            ) : (
              sortedAportes.map(ap => {
                const isAporte = ap.tipo === 'aporte'
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
              ? `Saldo disponível: ${formatBRL(usuario.saldo)}`
              : `Disponível na meta: ${formatBRL(meta.currentValue)}`
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
              {modal === 'aporte' ? 'Confirmar' : 'Resgatar'}
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
            {EMOJIS.map(e => (
              <button
                type="button"
                key={e}
                className={`meta-emoji-btn${editEmoji === e ? ' selected' : ''}`}
                onClick={() => setEditEmoji(e)}
              >
                {e}
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
            Tem certeza que deseja excluir <strong>{meta.emoji} {meta.name}</strong>?
          </p>
          {meta.currentValue > 0 && (
            <p className="meta-modal-context" style={{ marginTop: '0.25rem' }}>
              O valor de <strong style={{ color: 'var(--bd-teal)' }}>{formatBRL(meta.currentValue)}</strong> será devolvido ao seu saldo.
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
