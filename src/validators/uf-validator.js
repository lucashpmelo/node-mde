'use strict'

const { CODIGOS_UF } = require('../env')

class UfValidator {
  /**
   *
   * @param {Object} config
   * @param {'11' | '12' | '13' | '14' | '15' | '16' | '17' | '21' | '22' | '23' | '24' | '25' | '26' | '27' | '28' | '29' | '31' | '32' | '33' | '35' | '41' | '42' | '43' | '50' | '51' | '52' | '53'} config.cUFAutor
   */
  constructor(config) {
    const { cUFAutor } = config

    this.cUFAutor = cUFAutor
    this.error = ''
  }

  isValid() {
    if (!this.cUFAutor) {
      this.error = 'Código UF do Autor não informado.'
      return false
    }

    if (!CODIGOS_UF.includes(this.cUFAutor)) {
      this.error = 'Código UF inválido.'
      return false
    }

    return true
  }

  getValues() {
    return { cUFAutor: this.cUFAutor }
  }

  getError() {
    return this.error
  }
}

module.exports = Object.freeze(UfValidator)
