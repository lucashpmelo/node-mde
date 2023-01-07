'use strict'

const { ZeroPad } = require('../util')

class NsuValidator {
  /**
   *
   * @param {string} nsu
   */
  constructor(nsu) {
    this.nsu = nsu
    this.error = ''
  }

  isValid() {
    if (!this.nsu) {
      this.error = 'NSU não informado.'
      return false
    }

    this.nsu = String(this.nsu)

    if (this.nsu.length > 15) {
      this.error = 'NSU com tamanho incorreto.'
      return false
    }

    this.nsu = ZeroPad.padNsu(this.nsu)

    return true
  }

  getValues() {
    return this.nsu
  }

  getError() {
    return this.error
  }
}

module.exports = Object.freeze(NsuValidator)
