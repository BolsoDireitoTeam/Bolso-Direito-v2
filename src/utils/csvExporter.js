/**
 * Bolso Direito v2 — csvExporter.js
 * Utilitário para exportar transações em formato CSV para download.
 */

/**
 * Converte um array de objetos para uma string CSV.
 * @param {Array} transacoes 
 */
export function gerarCSV(transacoes) {
  if (!transacoes || transacoes.length === 0) return ""

  const headers = ["Data", "Descrição", "Valor", "Tipo", "Categoria", "Origem"]
  const rows = transacoes.map(tx => [
    tx.data,
    `"${tx.nome.replace(/"/g, '""')}"`,
    tx.valor.toFixed(2),
    tx.tipo === 'ganho' ? 'Receita' : 'Despesa',
    tx.categoria || 'Outros',
    tx.origem || 'manual'
  ])

  return [
    headers.join(","),
    ...rows.map(r => r.join(","))
  ].join("\n")
}

/**
 * Dispara o download de um arquivo CSV no navegador.
 * @param {string} csvText 
 * @param {string} filename 
 */
export function baixarCSV(csvText, filename = 'extrato.csv') {
  const blob = new Blob(["\ufeff" + csvText], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  
  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
