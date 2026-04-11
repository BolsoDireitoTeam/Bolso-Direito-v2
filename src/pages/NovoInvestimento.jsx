import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'

function NovoInvestimento({ onAdd }) {
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [tipo, setTipo] = useState('')
  const [valor, setValor] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    let color = 'var(--bd-teal)'
    let icon = 'bi-safe'
    let labelTipo = 'Outros'

    switch (tipo) {
      case 'renda_fixa':
        color = 'var(--bd-green)'; icon = 'bi-bank'; labelTipo = 'Renda Fixa'; break;
      case 'acoes':
        color = 'var(--bd-red)'; icon = 'bi-graph-up-arrow'; labelTipo = 'Renda Variável'; break;
      case 'fundos':
        color = 'var(--bd-purple)'; icon = 'bi-buildings'; labelTipo = 'Renda Variável'; break;
      case 'cripto':
        color = '#f4c864'; icon = 'bi-currency-bitcoin'; labelTipo = 'Criptomoedas'; break;
      default:
        break;
    }

    const formattedValor = new Intl.NumberFormat('pt-BR', {
      style: 'currency', currency: 'BRL'
    }).format(Number(valor))

    const novoInvestimento = {
      id: Date.now(),
      name: nome,
      type: labelTipo,
      value: formattedValor,
      returnLastWeek: '+R$ 0,00',
      returnPct: '+0.00%',
      color,
      icon
    }

    if (onAdd) {
      onAdd(novoInvestimento)
    }
    navigate('/investimentos/carteira')
  }

  return (
    <>
      <PageHeader
        greeting="Gerenciar Carteira"
        title="Novo Investimento"
        dateBadge="Abril 2026"
      >
        <button
          className="btn d-none d-lg-flex align-items-center gap-2"
          style={{
            background: 'transparent',
            border: '1px solid var(--bd-border)',
            color: 'var(--bd-muted)',
            borderRadius: '12px',
            fontSize: '0.85rem',
            padding: '0.5rem 1rem',
          }}
          onClick={() => navigate('/investimentos/carteira')}
        >
          <i className="bi bi-arrow-left"></i> Voltar
        </button>
      </PageHeader>

      <div className="row">
        <div className="col-12 col-md-8 col-lg-6 mx-auto mx-lg-0">
          <Card style={{ padding: '2rem' }}>
            <h5 className="mb-4" style={{ fontFamily: "'Syne', sans-serif", fontWeight: '700', color: 'var(--bd-text)' }}>
              Informações do Investimento
            </h5>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-muted" style={{ fontSize: '0.85rem' }}>Nome do ativo</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ex: Tesouro Selic 2029"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  style={{
                    background: 'rgba(0,0,0,0.1)',
                    border: '1px solid var(--bd-border)',
                    color: 'var(--bd-text)'
                  }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-muted" style={{ fontSize: '0.85rem' }}>Tipo de Investimento</label>
                <select
                  className="form-select"
                  required
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  style={{
                    background: 'rgba(0,0,0,0.1)',
                    border: '1px solid var(--bd-border)',
                    color: 'var(--bd-text)'
                  }}
                >
                  <option value="">Selecione o tipo</option>
                  <option value="renda_fixa">Renda Fixa</option>
                  <option value="acoes">Ações</option>
                  <option value="fundos">Fundos Imobiliários</option>
                  <option value="cripto">Criptomoedas</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label text-muted" style={{ fontSize: '0.85rem' }}>Valor Inicial (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  placeholder="0,00"
                  required
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  style={{
                    background: 'rgba(0,0,0,0.1)',
                    border: '1px solid var(--bd-border)',
                    color: 'var(--bd-text)'
                  }}
                />
              </div>

              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <button
                  type="button"
                  className="btn btn-outline-secondary me-md-2"
                  style={{
                    borderColor: 'var(--bd-border)',
                    color: 'var(--bd-text)',
                    borderRadius: '12px'
                  }}
                  onClick={() => navigate('/investimentos/carteira')}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn"
                  style={{
                    background: 'linear-gradient(135deg, var(--bd-teal), var(--bd-teal2))',
                    color: 'var(--bd-navy)',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: '600'
                  }}
                >
                  Salvar Investimento
                </button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </>
  )
}

export default NovoInvestimento
