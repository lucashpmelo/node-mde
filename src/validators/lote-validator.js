'use strict'

const LOTE_MIN_LENGTH = 1
const LOTE_MAX_LENGTH = 20

class LoteValidator {
  /**
   *
   * @param {Object} config
   * @param {string} [config.idLote]
   * @param {{chNFe: string, tipoEvento: 210200 | 210210 | 210220 | 210240, justificativa?: string}[]} config.lote
   */
  constructor(config) {
    const { idLote, lote } = config

    this.idLote = idLote
    this.lote = lote
    this.error = ''
  }

  isValid() {
    if (!this.idLote) {
      this.idLote = '1'
    }

    if (!Array.isArray(this.lote)) {
      this.error = 'Lote não informado.'
      return false
    }

    if (
      this.lote.length < LOTE_MIN_LENGTH ||
      this.lote.length > LOTE_MAX_LENGTH
    ) {
      this.error = `Um lote deve possuir no mínimo ${LOTE_MIN_LENGTH} e no máximo ${LOTE_MAX_LENGTH} eventos.`
      return false
    }

    return true
  }

  getValues() {
    return { idLote: this.idLote, lote: this.lote }
  }

  getError() {
    return this.error
  }
}

module.exports = Object.freeze(LoteValidator)
