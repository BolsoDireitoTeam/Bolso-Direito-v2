// ============================================================
//  Bolso Direito v2 — Toast.jsx
//  Feedback não-bloqueante que consome useFinance().toast
// ============================================================

import { useFinance } from '../../hooks/useFinance'

function Toast() {
  const { toast } = useFinance()

  if (!toast) return null

  const bgColors = {
    success: 'var(--bd-teal)',
    error: 'var(--bd-red)',
    info: 'var(--bd-purple)',
  }

  const icons = {
    success: 'bi-check-circle-fill',
    error: 'bi-x-circle-fill',
    info: 'bi-info-circle-fill',
  }

  return (
    <div
      className="bd-toast"
      style={{
        position: 'fixed',
        top: '1.2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        padding: '0.75rem 1.25rem',
        borderRadius: '12px',
        background: bgColors[toast.tipo] || bgColors.success,
        color: '#0d1520',
        fontWeight: 600,
        fontSize: '0.88rem',
        boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
        animation: 'toastIn 0.25s ease',
        minWidth: '200px',
        maxWidth: '90vw',
        whiteSpace: 'nowrap',
      }}
    >
      <i className={`bi ${icons[toast.tipo] || icons.success}`} style={{ fontSize: '1rem' }} />
      {toast.mensagem}
    </div>
  )
}

export default Toast
