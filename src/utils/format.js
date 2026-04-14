// ============================================================
//  Bolso Direito v2 — format.js
//  Helpers de formatação puros (sem dependência de React/DOM)
//  Origem: extraídos de ui.js e utils.js do v1
// ============================================================

/**
 * Formata um número como moeda brasileira: R$ 1.500,00
 * @param {number} v
 * @returns {string}
 */
export function moeda(v) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(v)
}

/**
 * Converte "YYYY-MM-DD" → "DD/MM/YYYY"
 * @param {string} iso
 * @returns {string}
 */
export function dataFormatada(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

/**
 * Converte "YYYY-MM" em nome longo pt-BR: "Abril de 2026"
 * @param {string} mesAno
 * @returns {string}
 */
export function nomeMes(mesAno) {
  const [yyyy, mm] = mesAno.split('-').map(Number)
  const nomes = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ]
  return `${nomes[mm - 1]} de ${yyyy}`
}

/**
 * Retorna "YYYY-MM" do mês atual.
 * @returns {string}
 */
export function mesAtual() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

/**
 * Retorna a data de hoje como "YYYY-MM-DD"
 * @returns {string}
 */
export function hojeISO() {
  return new Date().toISOString().slice(0, 10)
}

/**
 * Retorna o nome longo do mês atual em pt-BR: "Abril 2026"
 * @returns {string}
 */
export function mesAtualLabel() {
  const d = new Date()
  const nomes = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ]
  return `${nomes[d.getMonth()]} ${d.getFullYear()}`
}
