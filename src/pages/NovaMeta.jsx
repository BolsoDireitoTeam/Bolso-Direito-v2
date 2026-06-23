import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { novaMetaSchema } from '../validation/schemas'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { selectSaldo } from '../store/slices/financeSlice'
import { adicionarMeta } from '../store/slices/metasSlice'
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
  const dispatch = useAppDispatch()
  const saldo = useAppSelector(selectSaldo)

  const [icone, setIcone] = useState('bi-bullseye')
  const [cor, setCor] = useState('#4ee3c4')
  const [erroCustom, setErroCustom] = useState('')

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: yupResolver(novaMetaSchema),
    defaultValues: { nome: '', valorAlvo: '', aporteInicial: 0 },
  })

  const onSubmit = (data) => {
    setErroCustom('')
    const aporte = data.aporteInicial || 0

    // Validação customizada: saldo insuficiente (não cabe no Yup puro)
    if (aporte > saldo) {
      setErroCustom(`Saldo insuficiente. Disponível: ${formatBRL(saldo)}`)
      return
    }

    dispatch(adicionarMeta({
      icone,
      nome: data.nome.trim(),
      valorAlvo: data.valorAlvo,
      cor,
      aporteInicial: aporte,
    }))

    navigate('/metas')
  }

  /* Preview values via watch */
  const nomeWatch = watch('nome', '')
  const valorAlvoWatch = watch('valorAlvo', '')
  const aporteInicialWatch = watch('aporteInicial', 0)
  const previewTarget = parseFloat(valorAlvoWatch) || 0
  const previewAporte = parseFloat(aporteInicialWatch) || 0
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
            <form onSubmit={handleSubmit(onSubmit)}>
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
                {...register('nome')}
              />
              {errors.nome && <div className="meta-form-error">{errors.nome.message}</div>}

              {/* Valor alvo */}
              <label className="meta-form-label">Valor a Alcançar (R$)</label>
              <input
                className="meta-form-input"
                type="number"
                step="0.01"
                min="0"
                placeholder="10000.00"
                {...register('valorAlvo')}
              />
              {errors.valorAlvo && <div className="meta-form-error">{errors.valorAlvo.message}</div>}

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
                {...register('aporteInicial')}
              />
              {errors.aporteInicial && <div className="meta-form-error">{errors.aporteInicial.message}</div>}

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
              {erroCustom && <div className="meta-form-error">{erroCustom}</div>}

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
              <div className="meta-preview-name">{nomeWatch || 'Minha Meta'}</div>
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
