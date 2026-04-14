/**
 * Bolso Direito v2 — PaywallOverlay.jsx
 * Componente de "bloqueio" para funcionalidades premium.
 * Oferece uma barreira visual elegante (glassmorphism) e um call-to-action de upgrade.
 */

import { useFinance } from '../../hooks/useFinance'

function PaywallOverlay({ titulo, descricao }) {
  const { salvarConfiguracoes, mostrarToast } = useFinance()

  const handleUpgrade = () => {
    salvarConfiguracoes({ plano: 'pago' })
    mostrarToast('Parabéns! Você agora é Premium! 🌟', 'success')
  }

  return (
    <div className="paywall-overlay">
      <div className="paywall-content">
        <div className="paywall-badge">
          <i className="bi bi-star-fill"></i> PREMIUM
        </div>
        <h2 className="paywall-title">{titulo || 'Funcionalidade exclusiva'}</h2>
        <p className="paywall-text">
          {descricao || 'Assine o plano Pro para desbloquear metas avançadas, dashboards analíticos e muito mais.'}
        </p>
        <button className="paywall-btn" onClick={handleUpgrade}>
          Experimentar Premium Grátis
        </button>
      </div>

      <style>{`
        .paywall-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(13, 21, 32, 0.6);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .paywall-content {
          max-width: 320px;
          text-align: center;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          animation: slideUp 0.4s ease-out;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .paywall-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #ffd700, #ffa500);
          color: #000;
          padding: 0.4rem 0.8rem;
          border-radius: 100px;
          font-weight: 800;
          font-size: 0.7rem;
          letter-spacing: 1px;
          margin-bottom: 1.5rem;
        }

        .paywall-title {
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          color: #fff;
        }

        .paywall-text {
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.5;
          margin-bottom: 2rem;
        }

        .paywall-btn {
          width: 100%;
          padding: 1rem;
          border-radius: 14px;
          border: none;
          background: #fff;
          color: #000;
          font-weight: 700;
          transition: all 0.2s;
          cursor: pointer;
        }

        .paywall-btn:hover {
          transform: scale(1.02);
          box-shadow: 0 10px 20px rgba(255, 255, 255, 0.1);
        }

        .paywall-btn:active {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  )
}

export default PaywallOverlay
