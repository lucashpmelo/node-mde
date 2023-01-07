'use strict'

class CnpjCpfValidator {
  /**
   *
   * @param {Object} config
   * @param {string} [config.cnpj]
   * @param {string} [config.cpf]
   */
  constructor(config) {
    const { cnpj, cpf } = config

    this.cnpj = cnpj
    this.cpf = cpf
    this.error = ''
  }

  isValid() {
    if (!this.cnpj && !this.cpf) {
      this.error = 'CNPJ/CPF não informado.'
      return false
    }

    return true
  }

  getValues() {
    return { cnpj: this.cnpj, cpf: this.cpf }
  }

  getError() {
    return this.error
  }
}

module.exports = Object.freeze(CnpjCpfValidator)
