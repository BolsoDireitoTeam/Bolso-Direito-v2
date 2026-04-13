/**
 * Bolso Direito v2 — ClassificadorDB.js
 * Motor de aprendizado para categorização automática de transações.
 */

const STORAGE_KEY = 'bd_v2_classificador_mappings'

/**
 * Mappings personalizados do usuário.
 * Estrutura: { "NOME DO ESTABELECIMENTO": "Categoria" }
 */
let userMappings = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}

const ClassificadorDB = {
  /**
   * Retorna a categoria aprendida para um nome, se existir.
   */
  obterSugestao(nome) {
    if (!nome) return null
    const nomeLimpo = nome.trim().toUpperCase()
    return userMappings[nomeLimpo] || null
  },

  /**
   * Salva ou atualiza um mapping de categoria para um estabelecimento.
   */
  aprender(nome, categoria) {
    if (!nome || !categoria) return
    const nomeLimpo = nome.trim().toUpperCase()
    
    // Evita salvar "Outros" se já tiver algo melhor, 
    // ou simplesmente salva a nova preferência do usuário.
    userMappings[nomeLimpo] = categoria
    this._persistir()
  },

  /**
   * Retorna todos os mappings (para debug / exportação).
   */
  listarTodos() {
    return userMappings
  },

  _persistir() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userMappings))
  }
}

export default ClassificadorDB
