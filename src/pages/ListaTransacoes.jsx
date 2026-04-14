// ============================================================
//  Bolso Direito v2 — ListaTransacoes.jsx
//  Lista filtrada de transações com CRUD.
//  Origem: transacoes.js (313 linhas, v1) — reescrito em React
// ============================================================

import { useState, useMemo } from 'react'
import { useFinance } from '../hooks/useFinance'
import { moeda, nomeMes, mesAtual } from '../utils/format'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import TransactionItem from '../components/finance/TransactionItem'
import { gerarCSV, baixarCSV } from '../utils/csvExporter'
import '../styles/transacoes.css'

// Gera os últimos N meses (inclusive o atual) no formato "YYYY-MM"
function gerarMeses(n = 6) {
  const meses = []
  const agora = new Date()
  for (let i = 0; i < n; i++) {
    const d = new Date(agora.getFullYear(), agora.getMonth() - i, 1)
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    meses.push(`${yyyy}-${mm}`)
  }
  return meses
}

function ListaTransacoes() {
  const {
    transacoes,
    categorias,
    removerGanho,
    removerGastoDebito,
    removerGastoCredito,
    editarTransacao,
    mostrarToast,
  } = useFinance()

  const [filtroMes, setFiltroMes] = useState(mesAtual())
  const [filtroCategoria, setFiltroCategoria] = useState('Todas as categorias')
  const [editando, setEditando] = useState(null)    // { tx } | null
  const [editNome, setEditNome] = useState('')
  const [editValor, setEditValor] = useState('')
  const [editCategoria, setEditCategoria] = useState('')

  const meses = useMemo(() => gerarMeses(12), [])

  // Filtragem
  const txFiltradas = useMemo(() => {
    return transacoes.filter(tx => {
      // Filtro de mês
      const mesMatch = tx.data && tx.data.startsWith(filtroMes)

      // Filtro de categoria
      let catMatch = true
      if (filtroCategoria === 'Apenas ganhos') catMatch = tx.tipo === 'ganho'
      else if (filtroCategoria === 'Apenas gastos') catMatch = tx.tipo === 'gasto'
      else if (filtroCategoria !== 'Todas as categorias') catMatch = tx.categoria === filtroCategoria

      return mesMatch && catMatch
    })
  }, [transacoes, filtroMes, filtroCategoria])

  // Stats do período filtrado
  const stats = useMemo(() => {
    const receitas = txFiltradas.filter(tx => tx.tipo === 'ganho').reduce((a, t) => a + t.valor, 0)
    const despesas = txFiltradas.filter(tx => tx.tipo === 'gasto').reduce((a, t) => a + t.valor, 0)
    return { receitas, despesas, balanco: receitas - despesas }
  }, [txFiltradas])

  // ── Ações ──

  const handleRemover = (tx) => {
    const desc = tx.nome || 'esta transação'
    if (!window.confirm(`Remover "${desc}"? Esta ação não pode ser desfeita.`)) return

    let ok = false
    if (tx.tipo === 'ganho') ok = removerGanho(tx.id)
    else if (tx.subtipo === 'debito') ok = removerGastoDebito(tx.id)
    else if (tx.subtipo === 'credito') ok = removerGastoCredito(tx.id)

    if (ok) mostrarToast(`"${desc}" removido.`, 'success')
    else mostrarToast('Não foi possível remover.', 'error')
  }

  const abrirEditar = (tx) => {
    setEditando(tx)
    setEditNome(tx.nome)
    setEditValor(String(tx.valor))
    setEditCategoria(tx.categoria || '')
  }

  const handleSalvarEdicao = () => {
    if (!editNome.trim()) { mostrarToast('Informe um nome.', 'error'); return }

    const novoValor = parseFloat(editValor)
    const ok = editarTransacao(editando.id, {
      nome: editNome.trim(),
      valor: isNaN(novoValor) ? undefined : novoValor,
      categoria: editCategoria || undefined,
    })

    if (ok) { mostrarToast('Transação atualizada!', 'success'); setEditando(null) }
    else mostrarToast('Não foi possível editar.', 'error')
  }

  const handleExportar = () => {
    if (txFiltradas.length === 0) {
      mostrarToast('Não há transações para exportar.', 'info')
      return
    }
    const csv = gerarCSV(txFiltradas)
    baixarCSV(csv, `bolsodireito_extrato_${filtroMes}.csv`)
    mostrarToast('CSV gerado com sucesso!', 'success')
  }

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      <PageHeader title="Transações" subtitle="Histórico detalhado" />

      {/* Filtros */}
      <div className="transacoes-filtros">
        <select
          className="transacoes-select"
          value={filtroMes}
          onChange={e => setFiltroMes(e.target.value)}
        >
          {meses.map(m => (
            <option key={m} value={m}>{nomeMes(m)}</option>
          ))}
        </select>
        <select
          className="transacoes-select"
          value={filtroCategoria}
          onChange={e => setFiltroCategoria(e.target.value)}
        >
          <option>Todas as categorias</option>
          <option>Apenas ganhos</option>
          <option>Apenas gastos</option>
          {categorias.map(c => <option key={c}>{c}</option>)}
        </select>
        <button 
          className="btn-bd-secondary py-2 px-3 flex-shrink-0 d-flex align-items-center gap-2"
          onClick={handleExportar}
          title="Exportar CSV"
        >
          <i className="bi bi-download"></i> <span className="d-none d-md-inline">Exportar CSV</span>
        </button>
      </div>

      {/* Header período */}
      <div className="transacoes-header">
        <div className="transacoes-header-stat">
          <div className="transacoes-header-label">Receitas</div>
          <div className="transacoes-header-value income">{moeda(stats.receitas)}</div>
        </div>
        <div className="transacoes-header-stat">
          <div className="transacoes-header-label">Despesas</div>
          <div className="transacoes-header-value expense">{moeda(stats.despesas)}</div>
        </div>
        <div className="transacoes-header-stat">
          <div className="transacoes-header-label">Balanço</div>
          <div
            className="transacoes-header-value balance"
            style={{ color: stats.balanco >= 0 ? 'var(--bd-green)' : 'var(--bd-red)' }}
          >
            {moeda(stats.balanco)}
          </div>
        </div>
        <div className="transacoes-header-stat">
          <div className="transacoes-header-label">Movimentações</div>
          <div className="transacoes-header-value balance">{txFiltradas.length}</div>
        </div>
      </div>

      {/* Lista */}
      <Card>
        {txFiltradas.length === 0 ? (
          <div className="transacoes-empty">
            <i className="bi bi-inbox" />
            <div>Nenhuma movimentação encontrada</div>
            <div style={{ fontSize: '0.78rem', marginTop: '0.3rem', opacity: 0.6 }}>
              {nomeMes(filtroMes)} · {filtroCategoria}
            </div>
          </div>
        ) : (
          txFiltradas.map(tx => (
            <div key={tx.id} className="tx-item" style={{ position: 'relative' }}>
              {/* Reutiliza o TransactionItem mas com ações de editar/excluir */}
              <div style={{ display: 'contents' }}>
                <TransactionItem tx={tx} />
              </div>
              <div className="tx-item-actions">
                {tx.subtipo !== 'credito' && (
                  <button className="tx-action-btn" onClick={() => abrirEditar(tx)} title="Editar">
                    <i className="bi bi-pencil" />
                  </button>
                )}
                <button className="tx-action-btn danger" onClick={() => handleRemover(tx)} title="Excluir">
                  <i className="bi bi-trash" />
                </button>
              </div>
            </div>
          ))
        )}
      </Card>

      {/* Modal de edição */}
      {editando && (
        <div className="tx-modal-overlay" onClick={() => setEditando(null)}>
          <div className="tx-modal" onClick={e => e.stopPropagation()}>
            <h4><i className="bi bi-pencil-square" style={{ marginRight: '0.5rem' }} />Editar Transação</h4>
            <label style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.3rem', display: 'block' }}>Descrição</label>
            <input
              className="tx-modal-input"
              value={editNome}
              onChange={e => setEditNome(e.target.value)}
              placeholder="Nome da transação"
            />
            {editando.subtipo !== 'credito' && (
              <>
                <label style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.3rem', display: 'block' }}>Valor (R$)</label>
                <input
                  className="tx-modal-input"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={editValor}
                  onChange={e => setEditValor(e.target.value)}
                />
              </>
            )}
            {editando.tipo === 'gasto' && (
              <>
                <label style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.3rem', display: 'block' }}>Categoria</label>
                <select
                  className="tx-modal-select"
                  value={editCategoria}
                  onChange={e => setEditCategoria(e.target.value)}
                >
                  {categorias.map(c => <option key={c}>{c}</option>)}
                </select>
              </>
            )}
            <div className="tx-modal-actions">
              <button className="tx-modal-btn cancel" onClick={() => setEditando(null)}>Cancelar</button>
              <button className="tx-modal-btn save" onClick={handleSalvarEdicao}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ListaTransacoes
