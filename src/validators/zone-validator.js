'use strict'

const { ZONES } = require('../env')

class ZoneValidator {
  /**
   *
   * @param {Object} config
   * @param {'America/Araguaina' | 'America/Bahia' | 'America/Belem' | 'America/Boa_Vista' | 'America/Campo_Grande' | 'America/Cuiaba' | 'America/Fortaleza' | 'America/Maceio' | 'America/Manaus' | 'America/Noronha' | 'America/Porto_Velho' | 'America/Recife' | 'America/Rio_Branco' | 'America/Sao_Paulo'} [config.timezone = 'America/Sao_Paulo']
   */
  constructor(config) {
    const { timezone } = config

    this.timezone = timezone
    this.error = ''
  }

  isValid() {
    if (this.timezone) {
      if (!ZONES.includes(this.timezone)) {
        this.error = 'Timezone inválido.'
        return false
      }
    } else {
      this.timezone = 'America/Sao_Paulo'
    }

    return true
  }

  getValues() {
    return { timezone: this.timezone }
  }

  getError() {
    return this.error
  }
}

module.exports = Object.freeze(ZoneValidator)
