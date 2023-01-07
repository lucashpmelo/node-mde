'use strict'

const { Certificado } = require('../util')

class CertificadoValidator {
  /**
   *
   * @param {Object} config
   * @param {Buffer} [config.pfx]
   * @param {string} [config.passphrase]
   * @param {Buffer | string} [config.cert]
   * @param {Buffer | string} [config.key]
   */
  constructor(config) {
    const { pfx, passphrase, cert, key } = config

    this.pfx = pfx
    this.passphrase = passphrase
    this.cert = cert
    this.key = key
    this.error = ''
  }

  isValid() {
    if (this.pfx) {
      if (!this.passphrase) {
        this.error = 'Senha do Certificado não informada.'
        return false
      }

      const pfxLoad = Certificado.p12ToPem(this.pfx, this.passphrase)

      this.cert = pfxLoad.cert
      this.key = pfxLoad.key
    }

    if (!this.cert) {
      this.error = 'Cert não informado.'
      return false
    }

    if (!this.key) {
      this.error = 'Key não informada.'
      return false
    }

    return true
  }

  getValues() {
    return { cert: this.cert.toString(), key: this.key.toString() }
  }

  getError() {
    return this.error
  }
}

module.exports = Object.freeze(CertificadoValidator)
