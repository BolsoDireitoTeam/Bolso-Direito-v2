import ClassificadorDB from '../services/ClassificadorDB'

const CATEGORY_KEYWORDS = [
  { pattern: /mercado|extra|carrefour|pão de açúcar|hortifruti|supermercado|ifood|delivery|restaurante|lanchonete|mcdonald|burguer|rappi|bk|assai|atacad|pizzaria/i, cat: 'Alimentação' },
  { pattern: /uber|99|taxi|combust|posto|estacion|metrô|ônibus|movida|localiza|shell|ipiranga|pop/i, cat: 'Transporte' },
  { pattern: /aluguel|condom|iptu|light|enel|cedae|água|gás|energia|quinto.andar/i, cat: 'Moradia' },
  { pattern: /farmácia|raia|drogasil|pacheco|hospital|clínica|unimed|plano.saúde|amico|prevent|growth|suplemento/i, cat: 'Saúde' },
  { pattern: /netflix|spotify|amazon|prime|disney|hbo|globo|youtube|crunchyroll/i, cat: 'Assinaturas' },
  { pattern: /academia|smartfit|cinema|teatro|show|ingresso|lazer|steam|epic|playstation|xbox|nintendo|canva|jogos/i, cat: 'Lazer' },
  { pattern: /escola|faculdade|curso|livro|udemy|alura|fgv|estacio/i, cat: 'Educação' },
  { pattern: /nubank|itaú|bradesco|santander|inter|btg|pagsegu|picpay|mercado.livre|mercpago|ame|mp\s\*/i, cat: 'Outros' },
]

/**
 * Tenta classificar uma transação pelo nome.
 * Ordem de prioridade: 1. Aprendizado do usuário | 2. Regex genérico
 */
function sugerirCategoria(nome) {
  // 1. Tenta o motor de aprendizado
  const aprendida = ClassificadorDB.obterSugestao(nome)
  if (aprendida) return aprendida

  // 2. Tenta os padrões genéricos
  for (const item of CATEGORY_KEYWORDS) {
    if (item.pattern.test(nome)) return item.cat
  }

  return 'Outros'
}

/**
 * Normaliza uma data para o formato YYYY-MM-DD.
 */
function normalizarData(dataStr) {
  if (!dataStr) return new Date().toISOString().slice(0, 10)
  
  // DD/MM/YYYY -> YYYY-MM-DD
  const matchBR = dataStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (matchBR) {
    return `${matchBR[3]}-${matchBR[2].padStart(2, '0')}-${matchBR[1].padStart(2, '0')}`
  }
  
  return dataStr // assume YYYY-MM-DD
}

/**
 * Parseia o CSV.
 */
export function parsearCSV(texto) {
  try {
    const linhas = texto.split(/\r?\n/).filter(line => line.trim() !== '')
    if (linhas.length < 2) throw new Error('Arquivo vazio ou sem dados.')

    const cabecalho = linhas[0].toLowerCase().split(/[;,]/)
    const idxData = cabecalho.findIndex(c => c.includes('data') || c === 'date')
    const idxNome = cabecalho.findIndex(c => c.includes('desc') || c.includes('nome') || c === 'title')
    const idxValor = cabecalho.findIndex(c => c.includes('valor') || c.includes('quant') || c === 'amount')
    const idxTipo = cabecalho.findIndex(c => c.includes('tipo'))

    if (idxData === -1 || idxNome === -1 || idxValor === -1) {
      throw new Error('Colunas obrigatórias não encontradas (data, descricao, valor).')
    }

    // Heurística de Nubank: se a coluna for 'amount', gastos costumam ser positivos
    const isNubankFormat = cabecalho[idxValor] === 'amount'

    const resultado = linhas.slice(1).map((linha, idx) => {
      const colunas = linha.split(/[;,]/).map(c => c.trim().replace(/^["']|["']$/g, ''))
      
      const nomeRaw = colunas[idxNome] || 'Sem descrição'
      const valorRaw = parseFloat(colunas[idxValor]?.replace(',', '.')) || 0
      const dataRaw = colunas[idxData]
      
      // Detecção de tipo
      let tipo = colunas[idxTipo]?.toLowerCase()
      if (!tipo) {
        if (isNubankFormat) {
          tipo = valorRaw > 0 ? 'gasto' : 'ganho'
        } else {
          tipo = valorRaw < 0 ? 'gasto' : 'ganho'
        }
      }
      
      if (tipo.includes('desp') || tipo.includes('deb')) tipo = 'gasto'
      if (tipo.includes('receit') || tipo.includes('cred')) tipo = 'ganho'

      return {
        idTemp: `import-${idx}-${Date.now()}`,
        data: normalizarData(dataRaw),
        nome: nomeRaw,
        valor: Math.abs(valorRaw),
        tipo,
        categoria: sugerirCategoria(nomeRaw),
        selecionada: true
      }
    })

    return { ok: true, dados: resultado }
  } catch (err) {
    return { ok: false, erro: err.message }
  }
}
