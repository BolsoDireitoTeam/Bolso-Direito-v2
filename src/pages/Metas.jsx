import { useState } from 'react'
import { useFinance } from '../hooks/useFinance'
import PageHeader from '../components/ui/PageHeader'
import MetaCard from '../components/finance/MetaCard'
import ContributeModal from '../components/finance/ContributeModal'
import PaywallOverlay from '../components/ui/PaywallOverlay'
import { Link } from 'react-router-dom'

function Metas() {
  const { metas, removerMeta, contribuirMetaSaldo, agendarMeta, configuracoes } = useFinance()
  const [selectedMeta, setSelectedMeta] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const isPremium = configuracoes.plano === 'pago'

  const handleOpenContribute = (meta) => {
    setSelectedMeta(meta)
    setIsModalOpen(true)
  }

  return (
    <div style={{ position: 'relative', minHeight: '60vh' }}>
      {!isPremium && (
        <PaywallOverlay 
          titulo="Módulo de Metas PRO" 
          descricao="Defina objetivos, visualize seu progresso e use o Autopilot para poupar automaticamente todo mês."
        />
      )}

      <div style={{ filter: isPremium ? 'none' : 'blur(4px)', pointerEvents: isPremium ? 'auto' : 'none' }}>
        <PageHeader 
          title="Minhas Metas" 
          greeting="Planeje seus sonhos"
        />

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="section-title">Gerenciar Objetivos</h2>
          <Link to="/metas/nova" className="btn-bd-primary px-3 py-2" style={{ fontSize: '0.85rem' }}>
            <i className="bi bi-plus-lg me-2"></i> Nova Meta
          </Link>
        </div>

        <div className="row">
          {metas.length === 0 ? (
            <div className="col-12 text-center py-5">
              <div className="mb-3" style={{ fontSize: '3rem', opacity: '0.3' }}>
                <i className="bi bi-piggy-bank"></i>
              </div>
              <h5 className="text-muted">Você ainda não definiu nenhuma meta.</h5>
              <p className="text-muted small">Comece a poupar para seus sonhos hoje mesmo!</p>
              <Link to="/metas/nova" className="btn-bd-primary mt-3">Criar Primeira Meta</Link>
            </div>
          ) : (
            metas.map(meta => (
              <div key={meta.id} className="col-12 col-md-6 col-xl-4 mb-3">
                <MetaCard 
                  meta={meta} 
                  onContribute={handleOpenContribute}
                  onRemove={removerMeta}
                />
              </div>
            ))
          )}
        </div>
      </div>

      <ContributeModal 
        meta={selectedMeta}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirmSaldo={contribuirMetaSaldo}
        onConfirmAgenda={agendarMeta}
      />
    </div>
  )
}

export default Metas
