// ============================================================
//  Bolso Direito v2 — MetaDB.js
//  Módulo de gestão de Metas Financeiras (Issue #18)
//  Expandido com aportes[], resgatar, migração de schema.
// ============================================================

const STORAGE_KEY = 'bolsoDireito_metas_v1'

let _metas = []

/**
 * Carrega as metas do localStorage.
 * Migra schema antigo (contribuicoes → aportes) automaticamente.
 */
function carregar() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      _metas = JSON.parse(raw)
      // Migrar campo antigo contribuicoes → aportes
      _metas.forEach(m => {
        if (m.contribuicoes && !m.aportes) {
          m.aportes = m.contribuicoes.map((c, i) => ({
            id: c.id || `ap-migrated-${i}`,
            valor: c.valor,
            data: c.data ? c.data.split('T')[0] : new Date().toISOString().split('T')[0],
            tipo: c.tipo === 'direta' ? 'aporte' : (c.tipo || 'aporte'),
          }))
          delete m.contribuicoes
        }
        if (!m.aportes) m.aportes = []
      })
    } else {
      _metas = []
    }
  } catch (err) {
    console.error('[MetaDB] Erro ao carregar metas:', err)
    _metas = []
  }
}

/**
 * Salva as metas no localStorage.
 */
function salvar() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(_metas))
}

/**
 * Inicializa o DB de metas.
 */
function init() {
  carregar()
}

/**
 * Retorna a lista de metas.
 */
function listar() {
  return [..._metas]
}

/**
 * Adiciona uma nova meta.
 * @param {object} params
 */
function adicionar({ nome, valorAlvo, prazo, icone, cor, agendamento = null }) {
  const nova = {
    id: `meta-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    nome,
    valorAlvo: parseFloat(valorAlvo) || 0,
    valorAtual: 0,
    prazo,
    icone: icone || 'bi-piggy-bank',
    cor: cor || '#4ee3c4',
    agendamento, // { dia, valor, ativo }
    aportes: []
  }
  _metas.push(nova)
  salvar()
  return nova
}

/**
 * Adiciona um aporte (contribuição) a uma meta.
 * @param {string} id
 * @param {number} valor
 * @param {string} tipo - 'aporte' | 'autopilot' | etc
 */
function contribuir(id, valor, tipo = 'aporte') {
  const meta = _metas.find(m => m.id === id)
  if (!meta) return null

  meta.valorAtual = Number((meta.valorAtual + valor).toFixed(2))
  if (!meta.aportes) meta.aportes = []
  meta.aportes.push({
    id: `ap-${Date.now()}-${Math.random().toString(36).slice(2, 4)}`,
    valor,
    data: new Date().toISOString().split('T')[0],
    tipo
  })
  salvar()
  return meta
}

/**
 * Resgata (retira) valor de uma meta.
 * @param {string} id
 * @param {number} valor
 */
function resgatar(id, valor) {
  const meta = _metas.find(m => m.id === id)
  if (!meta) return null

  meta.valorAtual = Math.max(0, Number((meta.valorAtual - valor).toFixed(2)))
  if (!meta.aportes) meta.aportes = []
  meta.aportes.push({
    id: `ap-${Date.now()}-${Math.random().toString(36).slice(2, 4)}`,
    valor,
    data: new Date().toISOString().split('T')[0],
    tipo: 'resgate'
  })
  salvar()
  return meta
}

/**
 * Remove uma meta.
 */
function remover(id) {
  _metas = _metas.filter(m => m.id !== id)
  salvar()
}

/**
 * Atualiza campos de uma meta.
 */
function editar(id, patch) {
  const idx = _metas.findIndex(m => m.id === id)
  if (idx === -1) return null

  _metas[idx] = { ..._metas[idx], ...patch }
  salvar()
  return _metas[idx]
}

export const MetaDB = {
  init,
  listar,
  adicionar,
  contribuir,
  resgatar,
  remover,
  editar
}
