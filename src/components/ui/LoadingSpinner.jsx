// ============================================================
//  Bolso Direito v2 — LoadingSpinner.jsx
//  Componente reutilizável de loading com animação pulsante.
//  Exibido enquanto os slices Redux estão em status 'loading'.
// ============================================================

const spinnerStyles = `
  .bd-loading-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 220px;
    gap: 1.2rem;
    padding: 2rem;
  }

  .bd-spinner {
    width: 44px;
    height: 44px;
    border: 3px solid rgba(78, 227, 196, 0.15);
    border-top-color: var(--bd-teal, #4ee3c4);
    border-radius: 50%;
    animation: bd-spin 0.7s linear infinite;
  }

  @keyframes bd-spin {
    to { transform: rotate(360deg); }
  }

  .bd-loading-msg {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.45);
    letter-spacing: 0.02em;
  }

  /* ── Skeleton bar variant ── */
  .bd-skeleton-bar {
    height: 56px;
    border-radius: 12px;
    background: linear-gradient(
      90deg,
      rgba(255,255,255,0.04) 25%,
      rgba(255,255,255,0.08) 50%,
      rgba(255,255,255,0.04) 75%
    );
    background-size: 200% 100%;
    animation: bd-shimmer 1.4s ease-in-out infinite;
  }

  @keyframes bd-shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .bd-error-banner {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.85rem 1.1rem;
    background: rgba(240, 106, 106, 0.1);
    border: 1px solid rgba(240, 106, 106, 0.25);
    border-radius: 12px;
    color: var(--bd-red, #f06a6a);
    font-size: 0.82rem;
    font-family: 'DM Sans', sans-serif;
    margin: 1rem 0;
  }

  .bd-error-banner i {
    font-size: 1.1rem;
    flex-shrink: 0;
  }
`

/**
 * Spinner de carregamento para páginas e seções.
 * @param {{ mensagem?: string }} props
 */
export function LoadingSpinner({ mensagem = 'Carregando...' }) {
  return (
    <>
      <style>{spinnerStyles}</style>
      <div className="bd-loading-wrap">
        <div className="bd-spinner" />
        <span className="bd-loading-msg">{mensagem}</span>
      </div>
    </>
  )
}

/**
 * Placeholder skeleton para listas em carregamento.
 * @param {{ count?: number }} props
 */
export function SkeletonList({ count = 4 }) {
  return (
    <>
      <style>{spinnerStyles}</style>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', padding: '0.5rem 0' }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bd-skeleton-bar" style={{ opacity: 1 - i * 0.15 }} />
        ))}
      </div>
    </>
  )
}

/**
 * Banner de erro para falhas de carregamento.
 * @param {{ mensagem?: string }} props
 */
export function ErrorBanner({ mensagem = 'Ocorreu um erro ao carregar os dados.' }) {
  return (
    <>
      <style>{spinnerStyles}</style>
      <div className="bd-error-banner">
        <i className="bi bi-exclamation-triangle-fill" />
        <span>{mensagem}</span>
      </div>
    </>
  )
}

export default LoadingSpinner
