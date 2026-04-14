import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFinance } from '../hooks/useFinance'
import PageHeader from '../components/ui/PageHeader'

const COLORS = [
  '#4ee3c4', '#ACB6E5', '#f06a6a', '#f4c864', '#74ebd5', '#ff9a9e', '#a18cd1', '#fbc2eb'
]

const ICONS = [
  'bi-piggy-bank', 'bi-airplane', 'bi-house-heart', 'bi-car-front', 'bi-laptop', 
  'bi-graduation-cap', 'bi-heart-pulse', 'bi-umbrella', 'bi-gift'
]

function NovaMeta() {
  const { adicionarMeta } = useFinance()
  const navigate = useNavigate()

  const [nome, setNome] = useState('')
  const [valorAlvo, setValorAlvo] = useState('')
  const [prazo, setPrazo] = useState('')
  const [cor, setCor] = useState(COLORS[0])
  const [icone, setIcone] = useState(ICONS[0])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!nome || !valorAlvo) return alert('Preecha os campos obrigatórios')

    adicionarMeta({
      nome,
      valorAlvo: parseFloat(valorAlvo),
      prazo,
      cor,
      icone
    })

    navigate('/metas')
  }

  return (
    <>
      <PageHeader 
        title="Criar Nova Meta" 
        greeting="Dê um nome aos seus sonhos"
      />

      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <form className="bd-card" onSubmit={handleSubmit}>
            <div className="mb-4 text-center">
              <div 
                className="mx-auto meta-icon-circle"
                style={{ width: '64px', height: '64px', fontSize: '2rem', backgroundColor: `${cor}15`, color: cor, marginBottom: '1rem' }}
              >
                <i className={`bi ${icone}`}></i>
              </div>
              <p className="text-muted small">Prévia do ícone</p>
            </div>

            <div className="mb-3">
              <label className="form-label text-muted small">Nome da Meta</label>
              <input 
                type="text" 
                className="input-bd-field bg-transparent border-bottom rounded-0" 
                placeholder="Ex: Viagem para o Japão"
                value={nome}
                onChange={e => setNome(e.target.value)}
                required
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted small">Valor Alvo (R$)</label>
                <div className="input-group-bd">
                   <span className="input-prefix">R$</span>
                   <input 
                     type="number" 
                     className="input-bd-field" 
                     placeholder="0,00"
                     value={valorAlvo}
                     onChange={e => setValorAlvo(e.target.value)}
                     required
                   />
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted small">Prazo Estimado (Opcional)</label>
                <input 
                  type="month" 
                  className="input-group-bd w-100 bg-transparent"
                  value={prazo}
                  onChange={e => setPrazo(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label text-muted small">Escolha uma Cor</label>
              <div className="d-flex flex-wrap gap-2">
                {COLORS.map(c => (
                  <div 
                    key={c}
                    className={`color-pick ${cor === c ? 'active' : ''}`}
                    style={{ backgroundColor: c }}
                    onClick={() => setCor(c)}
                  ></div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label text-muted small">Escolha um Ícone</label>
              <div className="d-flex flex-wrap gap-3" style={{ fontSize: '1.5rem' }}>
                {ICONS.map(i => (
                  <i 
                    key={i}
                    className={`bi ${i} cursor-pointer ${icone === i ? 'text-teal fw-bold' : 'text-muted'}`}
                    onClick={() => setIcone(i)}
                    style={{ cursor: 'pointer' }}
                  ></i>
                ))}
              </div>
            </div>

            <div className="d-flex gap-3">
              <button type="button" className="btn-bd-secondary flex-grow-1 py-3" onClick={() => navigate('/metas')}>
                Cancelar
              </button>
              <button type="submit" className="btn-bd-primary flex-grow-2 py-3">
                Criar Meta
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <style>{`
        .color-pick {
          width: 32px; height: 32px;
          border-radius: 50%;
          cursor: pointer;
          border: 3px solid transparent;
        }
        .color-pick.active {
          border-color: white;
          box-shadow: 0 0 10px rgba(255,255,255,0.3);
        }
        .flex-grow-2 { flex: 2; }
      `}</style>
    </>
  )
}

export default NovaMeta
