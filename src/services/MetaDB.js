// ============================================================
//  Bolso Direito v2 — MetaDB.js
//  Módulo de gestão de Metas Financeiras (Issue #18)
// ============================================================

const STORAGE_KEY = 'bolsoDireito_metas_v1'

let _metas = []

/**
 * Carrega as metas do localStorage.
 */
function carregar() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      _metas = JSON.parse(raw)
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
 * @param {object} meta 
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
    contribuicoes: []
  }
  _metas.push(nova)
  salvar()
  return nova
}

/**
 * Adiciona uma contribuição direta a uma meta.
 * @param {string} id 
 * @param {number} valor 
 * @param {string} tipo 
 */
function contribuir(id, valor, tipo = 'direta') {
  const meta = _metas.find(m => m.id === id)
  if (!meta) return null

  meta.valorAtual = Number((meta.valorAtual + valor).toFixed(2))
  meta.contribuicoes.push({
    data: new Date().toISOString(),
    valor,
    tipo
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
  remover,
  editar
}
