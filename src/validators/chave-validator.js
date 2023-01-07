'use strict'

class ChaveValidator {
  /**
   *
   * @param {string} chave
   */
  constructor(chave) {
    this.chave = chave
    this.error = ''
  }

  isValid() {
    if (!this.chave) {
      this.error = 'Chave da NF-e não informada.'
      return false
    }

    this.chave = String(this.chave)

    if (this.chave.length !== 44) {
      this.error = 'Chave da NF-e com tamanho incorreto.'
      return false
    }

    return true
  }

  getValues() {
    return this.chave
  }

  getError() {
    return this.error
  }
}

module.exports = Object.freeze(ChaveValidator)
