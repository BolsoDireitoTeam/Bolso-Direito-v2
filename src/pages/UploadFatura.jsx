import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFinance } from '../hooks/useFinance'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import { parsearCSV } from '../utils/csvParser'
import { moeda } from '../utils/format'
import ClassificadorDB from '../services/ClassificadorDB'

function UploadFatura() {
  const navigate = useNavigate()
  const { mostrarToast, categorias, importarTransacoes } = useFinance()
  const inputRef = useRef()
  
  const [arquivo, setArquivo] = useState(null)
  const [transacoes, setTransacoes] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [tutorialAberto, setTutorialAberto] = useState(false)

  const handleFile = (file) => {
    if (!file) return
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      mostrarToast('Por favor, selecione um arquivo .csv', 'error')
      return
    }
    setArquivo(file)
  }

  const handleProcessar = () => {
    if (!arquivo) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target.result
      const res = parsearCSV(text)
      if (res.ok) {
        // Para faturas, forçamos o tipo como gasto de crédito
        const dadosFatura = res.dados.map(t => ({
          ...t,
          tipo: 'gasto',
          subtipo: 'credito', // Importante: faturas incrementam a fatura futura
          selecionada: true
        }))
        setTransacoes(dadosFatura)
        mostrarToast(`${res.dados.length} itens detectados na fatura!`, 'success')
      } else {
        mostrarToast(res.erro, 'error')
      }
    }
    reader.readAsText(arquivo)
  }

  const handleImportar = () => {
    const selecionadas = transacoes.filter(t => t.selecionada)
    if (selecionadas.length === 0) {
      mostrarToast('Selecione pelo menos uma transação.', 'error')
      return
    }

    // Aprendizado: salvar mappings para o futuro
    selecionadas.forEach(tx => {
      ClassificadorDB.aprender(tx.nome, tx.categoria)
    })

    importarTransacoes(selecionadas)
    mostrarToast('Fatura importada com sucesso!', 'success')
    navigate('/transacoes')
  }

  const dropZoneStyle = {
    border: `2px dashed ${dragging ? 'var(--bd-purple)' : 'rgba(255,255,255,0.15)'}`,
    borderRadius: '18px',
    padding: '3rem 1.5rem',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    background: dragging ? 'rgba(172,182,229,0.05)' : 'rgba(255,255,255,0.02)',
  }

  return (
    <div style={{ maxWidth: transacoes ? 900 : 520, margin: '0 auto', transition: 'max-width 0.3s' }}>
      <PageHeader
        title={transacoes ? "Revisar Ítens da Fatura" : "Importar Fatura"}
        subtitle={transacoes ? `${transacoes.filter(t => t.selecionada).length} selecionados` : "Upload do resumo do cartão"}
        backPath={transacoes ? null : "/"}
        onBack={transacoes ? () => setTransacoes(null) : null}
      />

      {!transacoes && (
        <>
          <Card>
            <div
              style={dropZoneStyle}
              onClick={() => inputRef.current.click()}
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
            >
              <i className={`bi ${arquivo ? 'bi-file-earmark-check' : 'bi-credit-card-2-front'} mb-3 d-block`} 
                 style={{ fontSize: '3rem', color: arquivo ? 'var(--bd-green)' : 'var(--bd-purple)' }} />
              
              {arquivo ? (
                <div>
                  <div className="fw-bold text-green">{arquivo.name}</div>
                  <div className="small text-muted mt-1">{(arquivo.size / 1024).toFixed(1)} KB</div>
                </div>
              ) : (
                <div>
                  <div className="fw-bold mb-1">Arraste sua fatura aqui</div>
                  <div className="small text-muted">ou clique para selecionar um arquivo .csv</div>
                </div>
              )}
              <input ref={inputRef} type="file" accept=".csv,text/csv" onChange={e => handleFile(e.target.files[0])} style={{ display: 'none' }} />
            </div>

            <div className="mt-4 d-flex gap-3">
              <button className="btn-bd-secondary flex-grow-1" onClick={() => setArquivo(null)}>Limpar</button>
              <button 
                className={`btn-bd-primary flex-grow-2 ${!arquivo ? 'opacity-50' : ''}`} 
                style={{ background: arquivo ? 'var(--bd-purple)' : '', color: arquivo ? '#0d1520' : '' }}
                disabled={!arquivo}
                onClick={handleProcessar}
              >
                Processar Fatura
              </button>
            </div>
          </Card>

          <div className="mt-4">
            <button className="btn-tutorial w-100" onClick={() => setTutorialAberto(!tutorialAberto)}>
              <span><i className="bi bi-question-circle me-2"></i>Como preparar o CSV?</span>
              <i className={`bi bi-chevron-${tutorialAberto ? 'up' : 'down'}`}></i>
            </button>
            {tutorialAberto && (
              <div className="tutorial-content mt-2 p-3 bd-card" style={{ fontSize: '0.85rem' }}>
                <p>O BolsoDireito processa colunas de data, descrição e valor. Exemplos:</p>
                <code className="d-block p-2 bg-dark rounded mb-2 text-purple">data, descricao, valor</code>
                <p className="m-0 text-muted">Itens de fatura são adicionados como gastos no cartão e processados na virada do mês.</p>
              </div>
            )}
          </div>
        </>
      )}

      {transacoes && (
        <Card>
          {/* Desktop Table - Hidden on Mobile */}
          <div className="d-none d-md-block table-responsive" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            <table className="table table-dark table-hover align-middle mb-0" style={{ fontSize: '0.85rem' }}>
              <thead className="sticky-top bg-dark">
                <tr>
                  <th style={{ width: 40 }}><i className="bi bi-check2-all"></i></th>
                  <th>Data</th>
                  <th>Descrição</th>
                  <th>Categoria</th>
                  <th className="text-end">Valor</th>
                </tr>
              </thead>
              <tbody>
                {transacoes.map(tx => (
                  <tr key={tx.idTemp} className={!tx.selecionada ? 'opacity-50' : ''}>
                    <td>
                      <input 
                        type="checkbox" 
                        checked={tx.selecionada} 
                        onChange={() => {
                          setTransacoes(prev => prev.map(t => t.idTemp === tx.idTemp ? { ...t, selecionada: !t.selecionada } : t))
                        }}
                        style={{ width: 18, height: 18, accentColor: 'var(--bd-purple)' }}
                      />
                    </td>
                    <td className="text-muted">{tx.data}</td>
                    <td>
                      <input 
                        type="text" 
                        value={tx.nome} 
                        onChange={e => {
                          setTransacoes(prev => prev.map(t => t.idTemp === tx.idTemp ? { ...t, nome: e.target.value } : t))
                        }}
                        className="bg-transparent border-0 text-white w-100 border-bottom border-secondary-subtle"
                      />
                    </td>
                    <td>
                      <select 
                        value={tx.categoria} 
                        onChange={e => {
                          setTransacoes(prev => prev.map(t => t.idTemp === tx.idTemp ? { ...t, categoria: e.target.value } : t))
                        }}
                        className="bg-transparent border-0 text-purple w-100"
                        style={{ outline: 'none', cursor: 'pointer' }}
                      >
                        {categorias.map(c => <option key={c} value={c} className="bg-dark">{c}</option>)}
                      </select>
                    </td>
                    <td className="text-end fw-bold text-red">
                      {moeda(tx.valor)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards - Shown only on small screens */}
          <div className="d-md-none" style={{ maxHeight: '65vh', overflowY: 'auto', padding: '0.5rem' }}>
            {transacoes.map(tx => (
              <div 
                key={tx.idTemp} 
                className={`bd-review-card mb-3 p-3 ${!tx.selecionada ? 'opacity-50' : ''}`}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '16px',
                  border: `1px solid ${tx.selecionada ? 'rgba(172,182,229,0.15)' : 'var(--bd-border)'}`,
                  transition: 'all 0.2s'
                }}
              >
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="d-flex gap-3 align-items-center">
                    <input 
                      type="checkbox" 
                      checked={tx.selecionada} 
                      onChange={() => {
                        setTransacoes(prev => prev.map(t => t.idTemp === tx.idTemp ? { ...t, selecionada: !t.selecionada } : t))
                      }}
                      style={{ width: 22, height: 22, accentColor: 'var(--bd-purple)' }}
                    />
                    <div>
                      <div className="small text-muted">{tx.data}</div>
                      <input 
                        type="text" 
                        value={tx.nome} 
                        onChange={e => {
                          setTransacoes(prev => prev.map(t => t.idTemp === tx.idTemp ? { ...t, nome: e.target.value } : t))
                        }}
                        className="bg-transparent border-0 text-white fw-bold d-block w-100"
                        style={{ fontSize: '1rem', outline: 'none' }}
                      />
                    </div>
                  </div>
                  <div className="fw-bold text-red" style={{ fontSize: '1.1rem' }}>
                    -{moeda(tx.valor)}
                  </div>
                </div>

                <div className="mt-3">
                  <div className="small text-muted mb-2">Categoria</div>
                  <select 
                    value={tx.categoria} 
                    onChange={e => {
                      setTransacoes(prev => prev.map(t => t.idTemp === tx.idTemp ? { ...t, categoria: e.target.value } : t))
                    }}
                    className="form-select bg-dark border-secondary text-purple"
                    style={{ borderRadius: '12px', fontSize: '0.9rem' }}
                  >
                    {categorias.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-top border-secondary d-flex justify-content-between align-items-center">
            <button className="btn btn-link text-muted text-decoration-none" onClick={() => setTransacoes(null)}>
              <i className="bi bi-arrow-left me-2"></i>Voltar
            </button>
            <button className="btn-bd-primary px-4 py-3" style={{ background: 'var(--bd-purple)' }} onClick={handleImportar}>
              Adicionar {transacoes.filter(t => t.selecionada).length} Itens
            </button>
          </div>
        </Card>
      )}

      <style>{`
        .btn-tutorial {
          display: flex; justify-content: space-between; align-items: center;
          padding: 1rem; border-radius: 12px; border: 1px solid var(--bd-border);
          background: rgba(255,255,255,0.03); color: var(--bd-muted); font-weight: 600;
        }
        .text-purple { color: var(--bd-purple); }
        .flex-grow-2 { flex: 2; }
      `}</style>
    </div>
  )
}

export default UploadFatura
