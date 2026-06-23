import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { novoInvestimentoSchema } from '../validation/schemas'
import { useAppDispatch } from '../store/hooks'
import { adicionarInvestimento } from '../store/slices/investimentosSlice'
import { mesAtualLabel } from '../utils/format'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'

function NovoInvestimento() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(novoInvestimentoSchema),
    defaultValues: { nome: '', tipo: '', valor: '', taxaMensal: '0.80' },
  })

  const onSubmit = (data) => {
    let cor = 'var(--bd-teal)'
    let icone = 'bi-safe'
    let labelTipo = 'Outros'

    switch (data.tipo) {
      case 'renda_fixa':
        cor = 'var(--bd-green)'; icone = 'bi-bank'; labelTipo = 'Renda Fixa'; break
      case 'acoes':
        cor = 'var(--bd-red)'; icone = 'bi-graph-up-arrow'; labelTipo = 'Renda Variável'; break
      case 'fundos':
        cor = 'var(--bd-purple)'; icone = 'bi-buildings'; labelTipo = 'Renda Variável'; break
      case 'cripto':
        cor = '#f4c864'; icone = 'bi-currency-bitcoin'; labelTipo = 'Criptomoedas'; break
      default:
        break
    }

    dispatch(adicionarInvestimento({
      nome: data.nome,
      tipo: labelTipo,
      valorInicial: data.valor,
      taxaMensal: data.taxaMensal / 100,
      icone,
      cor,
    }))

    navigate('/investimentos/carteira')
  }

  return (
    <>
      <PageHeader
        greeting="Gerenciar Carteira"
        title="Novo Investimento"
        dateBadge={mesAtualLabel()}
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

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label className="form-label" style={{ fontSize: '0.85rem', color: 'var(--bd-muted)' }}>Nome do ativo</label>
                <input
                  type="text"
                  className={`form-control${errors.nome ? ' is-invalid' : ''}`}
                  placeholder="Ex: Tesouro Selic 2029"
                  {...register('nome')}
                  style={{
                    background: 'rgba(0,0,0,0.1)',
                    border: '1px solid var(--bd-border)',
                    color: 'var(--bd-text)'
                  }}
                />
                {errors.nome && <div className="invalid-feedback" style={{display:'block'}}>{errors.nome.message}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label" style={{ fontSize: '0.85rem', color: 'var(--bd-muted)' }}>Tipo de Investimento</label>
                <select
                  className={`form-select${errors.tipo ? ' is-invalid' : ''}`}
                  {...register('tipo')}
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
                {errors.tipo && <div className="invalid-feedback" style={{display:'block'}}>{errors.tipo.message}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label" style={{ fontSize: '0.85rem', color: 'var(--bd-muted)' }}>Valor Inicial (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  className={`form-control${errors.valor ? ' is-invalid' : ''}`}
                  placeholder="0,00"
                  {...register('valor')}
                  style={{
                    background: 'rgba(0,0,0,0.1)',
                    border: '1px solid var(--bd-border)',
                    color: 'var(--bd-text)'
                  }}
                />
                {errors.valor && <div className="invalid-feedback" style={{display:'block'}}>{errors.valor.message}</div>}
              </div>

              <div className="mb-4">
                <label className="form-label" style={{ fontSize: '0.85rem', color: 'var(--bd-muted)' }}>
                  Taxa Mensal (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className={`form-control${errors.taxaMensal ? ' is-invalid' : ''}`}
                  placeholder="0.80"
                  {...register('taxaMensal')}
                  style={{
                    background: 'rgba(0,0,0,0.1)',
                    border: '1px solid var(--bd-border)',
                    color: 'var(--bd-text)'
                  }}
                />
                {errors.taxaMensal && <div className="invalid-feedback" style={{display:'block'}}>{errors.taxaMensal.message}</div>}
                <small style={{ color: 'var(--bd-muted)', fontSize: '0.75rem' }}>
                  Taxa fixa de rendimento mensal. Pode ser editada depois.
                </small>
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
