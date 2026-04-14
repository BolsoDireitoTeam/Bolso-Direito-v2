// ============================================================
//  Bolso Direito v2 — InvestimentoDB.js
//  Módulo de gestão de Investimentos
//  Persistência: localStorage
//  Modelo: valor inicial + taxa mensal estática + aportes[]
// ============================================================

const STORAGE_KEY = 'bolsoDireito_investimentos_v1'

let _investimentos = []

// ─── Persistência ──────────────────────────────────────────

function carregar() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    _investimentos = raw ? JSON.parse(raw) : []
  } catch (err) {
    console.error('[InvestimentoDB] Erro ao carregar:', err)
    _investimentos = []
  }
}

function salvar() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(_investimentos))
}

// ─── Init ──────────────────────────────────────────────────

function init() {
  carregar()
}

// ─── CRUD ──────────────────────────────────────────────────

/**
 * Retorna lista de investimentos (cópia).
 */
function listar() {
  return [..._investimentos]
}

/**
 * Adiciona um novo investimento.
 * @param {object} params
 * @param {string} params.nome - Nome do ativo
 * @param {string} params.tipo - Tipo: 'Renda Fixa', 'Renda Variável', 'Criptomoedas', etc.
 * @param {number} params.valorInicial - Valor aplicado inicialmente
 * @param {number} params.taxaMensal - Taxa de rendimento mensal (ex: 0.008 = 0.8%)
 * @param {string} params.icone - Classe Bootstrap Icon (ex: 'bi-bank')
 * @param {string} params.cor - Cor tema (ex: 'var(--bd-green)')
 * @param {string} [params.dataInicio] - Data de início YYYY-MM-DD
 */
function adicionar({ nome, tipo, valorInicial, taxaMensal, icone, cor, dataInicio }) {
  const novo = {
    id: `inv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    nome,
    tipo: tipo || 'Outros',
    valorInicial: parseFloat(valorInicial) || 0,
    taxaMensal: parseFloat(taxaMensal) || 0,
    icone: icone || 'bi-safe',
    cor: cor || 'var(--bd-teal)',
    dataInicio: dataInicio || new Date().toISOString().split('T')[0],
    aportes: [] // { id, valor, data }
  }
  _investimentos.push(novo)
  salvar()
  return novo
}

/**
 * Remove um investimento pelo ID.
 * @param {string} id
 * @returns {object|null} O investimento removido, ou null
 */
function remover(id) {
  const idx = _investimentos.findIndex(i => i.id === id)
  if (idx === -1) return null
  const [removido] = _investimentos.splice(idx, 1)
  salvar()
  return removido
}

/**
 * Edita campos de um investimento (patch merge).
 * @param {string} id
 * @param {object} patch - Ex: { nome, taxaMensal, cor }
 */
function editar(id, patch) {
  const inv = _investimentos.find(i => i.id === id)
  if (!inv) return null
  Object.assign(inv, patch)
  salvar()
  return inv
}

/**
 * Adiciona um aporte a um investimento existente.
 * O valor do aporte será somado ao montante acumulado a partir da data do aporte.
 * @param {string} id - ID do investimento
 * @param {number} valor - Valor do aporte
 * @param {string} [data] - Data YYYY-MM-DD (padrão: hoje)
 */
function aportar(id, valor, data) {
  const inv = _investimentos.find(i => i.id === id)
  if (!inv) return null

  if (!inv.aportes) inv.aportes = []
  inv.aportes.push({
    id: `ap-${Date.now()}-${Math.random().toString(36).slice(2, 4)}`,
    valor: parseFloat(valor) || 0,
    data: data || new Date().toISOString().split('T')[0],
  })
  salvar()
  return inv
}

/**
 * Calcula o valor acumulado de um investimento até uma data.
 * Fórmula: M = valorInicial * (1 + taxa)^meses + Σ(aporte_i * (1 + taxa)^meses_restantes_i)
 * @param {object} inv - Objeto investimento
 * @param {string} [ateData] - 'YYYY-MM-DD' (padrão: hoje)
 * @returns {{ montante: number, rendimento: number, totalAportado: number }}
 */
function calcularValorAcumulado(inv, ateData) {
  const dataFim = ateData ? new Date(ateData + 'T12:00:00') : new Date()
  const dataIni = new Date(inv.dataInicio + 'T12:00:00')
  const taxa = inv.taxaMensal || 0

  // Meses entre dataInicio e dataFim
  const mesesTotal = _diffMeses(dataIni, dataFim)

  // Montante do valor inicial
  let montante = inv.valorInicial * Math.pow(1 + taxa, Math.max(0, mesesTotal))

  // Somar cada aporte com seus meses de rendimento
  let totalAportado = inv.valorInicial
  if (inv.aportes && inv.aportes.length > 0) {
    inv.aportes.forEach(ap => {
      const dataAporte = new Date(ap.data + 'T12:00:00')
      const mesesAporte = _diffMeses(dataAporte, dataFim)
      montante += ap.valor * Math.pow(1 + taxa, Math.max(0, mesesAporte))
      totalAportado += ap.valor
    })
  }

  montante = Number(montante.toFixed(2))
  const rendimento = Number((montante - totalAportado).toFixed(2))

  return { montante, rendimento, totalAportado }
}

/**
 * Calcula a diferença em meses (fracionário) entre duas datas.
 */
function _diffMeses(d1, d2) {
  const anos = d2.getFullYear() - d1.getFullYear()
  const meses = d2.getMonth() - d1.getMonth()
  const dias = d2.getDate() - d1.getDate()
  return anos * 12 + meses + (dias / 30)
}

/**
 * Retorna o total investido e o montante total de todos os investimentos.
 * @returns {{ totalInvestido: number, montanteTotal: number, rendimentoTotal: number }}
 */
function getTotais() {
  let totalInvestido = 0
  let montanteTotal = 0

  _investimentos.forEach(inv => {
    const { montante, totalAportado } = calcularValorAcumulado(inv)
    totalInvestido += totalAportado
    montanteTotal += montante
  })

  return {
    totalInvestido: Number(totalInvestido.toFixed(2)),
    montanteTotal: Number(montanteTotal.toFixed(2)),
    rendimentoTotal: Number((montanteTotal - totalInvestido).toFixed(2)),
  }
}

// ─── API Pública ───────────────────────────────────────────

export const InvestimentoDB = {
  init,
  listar,
  adicionar,
  remover,
  editar,
  aportar,
  calcularValorAcumulado,
  getTotais,
}
