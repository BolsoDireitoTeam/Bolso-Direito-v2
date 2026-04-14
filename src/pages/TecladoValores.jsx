// ============================================================
//  Bolso Direito v2 — TecladoValores.jsx
//  Tela de entrada de valor via teclado numérico.
//  Origem: app.js L207-315 (v1) — reescrito em React
// ============================================================

import { useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useFinance } from '../hooks/useFinance'
import { moeda, hojeISO } from '../utils/format'
import PageHeader from '../components/ui/PageHeader'
import '../styles/teclado.css'

const TECLAS = [
  '7', '8', '9',
  '4', '5', '6',
  '1', '2', '3',
  '.', '0', '⌫',
]

function avaliarExpressao(expr) {
  try {
    // Substitui , por . e avalia apenas adição/subtração simples
    const limpa = expr.replace(/,/g, '.').replace(/[^0-9+\-.]/g, '')
    const resultado = Function('"use strict"; return (' + limpa + ')')()
    return typeof resultado === 'number' && isFinite(resultado) ? resultado : null
  } catch {
    return null
  }
}

function TecladoValores() {
  const { tipo } = useParams()           // 'ganho' | 'gasto'
  const navigate = useNavigate()
  const { adicionarGanho, setTransacaoPendente, mostrarToast } = useFinance()

  const [expressao, setExpressao] = useState('')
  const [nome, setNome] = useState('')

  const isGanho = tipo === 'ganho'
  const titulo = isGanho ? 'Novo Ganho' : 'Novo Gasto'
  const subtitulo = isGanho
    ? 'Informe o valor recebido'
    : 'Informe o valor gasto'

  // Valor calculado para exibição
  const valorCalculado = avaliarExpressao(expressao) ?? 0

  const handleTecla = useCallback((tecla) => {
    if (tecla === '⌫') {
      // Remove o último token
      setExpressao(prev => {
        if (prev.endsWith('+') || prev.endsWith('-')) return prev.slice(0, -1)
        const partes = prev.split(/(?=[+\-])/)
        partes[partes.length - 1] = partes[partes.length - 1].slice(0, -1)
        return partes.join('')
      })
    } else if (tecla === '+' || tecla === '-') {
      setExpressao(prev => {
        if (prev === '') return prev
        if (prev.endsWith('+') || prev.endsWith('-')) {
          return prev.slice(0, -1) + tecla
        }
        return prev + tecla
      })
    } else if (tecla === '.') {
      setExpressao(prev => {
        const partes = prev.split(/[+\-]/)
        const ultimo = partes[partes.length - 1]
        if (ultimo.includes('.')) return prev
        return prev + '.'
      })
    } else {
      setExpressao(prev => prev + tecla)
    }
  }, [])

  const handleConfirmar = () => {
    const valor = avaliarExpressao(expressao)
    if (!valor || valor <= 0) {
      mostrarToast('Informe um valor válido maior que zero.', 'error')
      return
    }

    if (isGanho) {
      if (!nome.trim()) {
        mostrarToast('Informe uma descrição para o ganho.', 'error')
        return
      }
      try {
        adicionarGanho({ nome: nome.trim(), valor, data: hojeISO() })
        mostrarToast(`Ganho de ${moeda(valor)} adicionado! 🎉`, 'success')
        navigate('/')
      } catch (err) {
        mostrarToast(err.message, 'error')
      }
    } else {
      // Gasto → próxima etapa: escolher categoria
      setTransacaoPendente({ valor, nome: '' })
      navigate('/transacoes/categoria')
    }
  }

  const haValor = valorCalculado > 0

  return (
    <div className="teclado-page">
      <PageHeader
        title={titulo}
        subtitle={subtitulo}
        backPath="/"
      />

      {/* Visor */}
      <div className="teclado-visor">
        <div className="teclado-expressao">{expressao || '–'}</div>
        <div className={`teclado-valor ${tipo}`}>
          {haValor ? moeda(valorCalculado) : 'R$ 0,00'}
        </div>
      </div>

      {/* Campo de nome (só para ganho) */}
      {isGanho && (
        <input
          className="teclado-nome-input"
          type="text"
          placeholder="Descrição (ex: Salário, Freelance...)"
          value={nome}
          onChange={e => setNome(e.target.value)}
          maxLength={60}
        />
      )}

      {/* Teclado numérico */}
      <div className="teclado-grid">
        {TECLAS.map(tecla => (
          <button
            key={tecla}
            className={`teclado-btn ${tecla === '⌫' ? 'del' : 'num'}`}
            onClick={() => handleTecla(tecla)}
          >
            {tecla === '⌫' ? <i className="bi bi-backspace" /> : tecla}
          </button>
        ))}
        {/* Botões de operação */}
        <button className="teclado-btn op" onClick={() => handleTecla('+')}>
          <i className="bi bi-plus" />
        </button>
        <button className="teclado-btn op" onClick={() => handleTecla('-')}>
          <i className="bi bi-dash" />
        </button>
        <button
          className="teclado-btn confirmar"
          onClick={handleConfirmar}
          disabled={!haValor}
        >
          {isGanho ? 'Adicionar Ganho' : 'Escolher Categoria →'}
        </button>
      </div>
    </div>
  )
}

export default TecladoValores
