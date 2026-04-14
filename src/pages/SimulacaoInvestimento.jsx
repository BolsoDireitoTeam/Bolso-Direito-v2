import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import LineChart from '../components/charts/LineChart'

function SimulacaoInvestimento() {
  const navigate = useNavigate()
  
  const [tipo, setTipo] = useState('')
  const [valor, setValor] = useState('')
  const [tempo, setTempo] = useState('')
  const [resultado, setResultado] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()

    const valorNum = Number(valor)
    const tempoNum = Number(tempo)

    if (valorNum <= 0 || tempoNum <= 0) return

    // Taxas mensais simuladas
    let taxaMensal = 0;
    let nomeTipo = '';
    switch (tipo) {
      case 'renda_fixa':
        taxaMensal = 0.008; // 0.8% a.m
        nomeTipo = 'Renda Fixa';
        break;
      case 'acoes':
        taxaMensal = 0.012; // 1.2% a.m
        nomeTipo = 'Ações';
        break;
      case 'fundos':
        taxaMensal = 0.010; // 1% a.m
        nomeTipo = 'Fundos Imobiliários';
        break;
      case 'cripto':
        taxaMensal = 0.020; // 2% a.m
        nomeTipo = 'Criptomoedas';
        break;
      default:
        return;
    }

    // Geração de curva para o gráfico
    const labels = []
    const chartDataValues = []
    
    // Passo inteligente: se for muito tempo, plota por ano
    const step = tempoNum > 36 ? 12 : 1;
    
    for (let i = 0; i <= tempoNum; i += step) {
      if (i === 0) {
        labels.push('Hoje')
        chartDataValues.push(valorNum)
      } else {
        labels.push(tempoNum > 36 ? `Ano ${i/12}` : `Mês ${i}`)
        chartDataValues.push(valorNum * Math.pow(1 + taxaMensal, i))
      }
    }
    // Garante que o último mês entra se caiu fora do step
    if (tempoNum % step !== 0 && tempoNum > 0) {
       labels.push(tempoNum > 36 ? `Ano ${(tempoNum/12).toFixed(1)}` : `Mês ${tempoNum}`)
       chartDataValues.push(valorNum * Math.pow(1 + taxaMensal, tempoNum))
    }

    const montante = valorNum * Math.pow(1 + taxaMensal, tempoNum)
    const lucro = montante - valorNum

    setResultado({
      montanteFormated: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(montante),
      lucroFormated: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lucro),
      taxa: (taxaMensal * 100).toFixed(1) + '% a.m.',
      nomeTipo,
      chartData: { labels, data: chartDataValues }
    })
  }

  return (
    <>
      <PageHeader
        greeting="Planejamento"
        title="Simulação"
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
          onClick={() => navigate('/investimentos')}
        >
          <i className="bi bi-arrow-left"></i> Voltar
        </button>
      </PageHeader>

      <div className="row g-4">
        {/* Formulário */}
        <div className="col-12 col-md-6 col-lg-5">
          <Card style={{ padding: '2rem', height: '100%' }}>
            <h5 className="mb-4" style={{ fontFamily: "'Syne', sans-serif", fontWeight: '700', color: 'var(--bd-text)' }}>
              Parâmetros da Simulação
            </h5>

            <form onSubmit={handleSubmit}>
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
                  <option value="renda_fixa">Renda Fixa (Seguro)</option>
                  <option value="fundos">Fundos Imobiliários (Moderado)</option>
                  <option value="acoes">Ações (Arrojado)</option>
                  <option value="cripto">Criptomoedas (Alto Risco)</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label text-muted" style={{ fontSize: '0.85rem' }}>Valor Investido (R$)</label>
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

              <div className="mb-4">
                <label className="form-label text-muted" style={{ fontSize: '0.85rem' }}>Tempo (em meses)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Ex: 12"
                  required
                  value={tempo}
                  onChange={(e) => setTempo(e.target.value)}
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
                  onClick={() => navigate('/investimentos')}
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
                  Simular
                </button>
              </div>
            </form>
          </Card>
        </div>

        {/* Resultado */}
        {resultado && (
          <div className="col-12 col-md-6 col-lg-7">
            <Card style={{ padding: '2rem', height: '100%', background: 'rgba(78,227,196,0.05)', border: '1px solid rgba(78,227,196,0.2)' }}>
              <div className="d-flex flex-column justify-content-center h-100 text-center">
                <div style={{ display: 'inline-flex', width: '64px', height: '64px', background: 'rgba(78,227,196,0.2)', borderRadius: '50%', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--bd-teal)', fontSize: '2rem' }}>
                  <i className="bi bi-graph-up-arrow"></i>
                </div>
                <h6 className="text-muted mb-2">Se você investir em {resultado.nomeTipo} ({resultado.taxa})</h6>
                <p className="mb-4" style={{ color: 'var(--bd-text)', fontSize: '1rem' }}>
                  Ao final do período estipulado, você teria acumulado:
                </p>
                <h2 className="display-4 fw-bold mb-3" style={{ color: 'var(--bd-teal)', fontFamily: "'Syne', sans-serif" }}>
                  {resultado.montanteFormated}
                </h2>
                <div className="d-inline-flex px-3 py-2 rounded-pill mx-auto mb-4" style={{ background: 'rgba(78,227,196,0.1)', color: 'var(--bd-teal)', border: '1px solid rgba(78,227,196,0.3)' }}>
                  <i className="bi bi-piggy-bank me-2"></i> Lucro de {resultado.lucroFormated}
                </div>
                
                <div style={{ marginTop: 'auto', textAlign: 'left' }}>
                  <LineChart data={resultado.chartData} />
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </>
  )
}

export default SimulacaoInvestimento
