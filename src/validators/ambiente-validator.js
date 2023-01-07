'use strict'

class AmbienteValidator {
  /**
   *
   * @param {Object} config
   * @param {'1' | '2'} config.tpAmb
   */
  constructor(config) {
    const { tpAmb } = config

    this.tpAmb = tpAmb
    this.error = ''
  }

  isValid() {
    if (!this.tpAmb) {
      this.error = 'Ambiente não informado.'
      return false
    }

    if (this.tpAmb !== '1' && this.tpAmb !== '2') {
      this.error = 'Ambiente com valor inválido.'
      return false
    }

    return true
  }

  getValues() {
    return { tpAmb: this.tpAmb }
  }

  getError() {
    return this.error
  }
}

module.exports = Object.freeze(AmbienteValidator)
