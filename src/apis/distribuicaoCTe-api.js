'use strict'

const { DistribuicaoCTeController } = require('../controllers')
const {
  AmbienteValidator,
  CertificadoValidator,
  ChaveValidator,
  CnpjCpfValidator,
  NsuValidator,
  UfValidator,
} = require('../validators')

class DistribuicaoCTe {
  /**
   * @param {Object} config
   * @param {Buffer} [config.pfx]
   * @param {string} [config.passphrase]
   * @param {Buffer | string} [config.cert]
   * @param {Buffer | string} [config.key]
   * @param {'11' | '12' | '13' | '14' | '15' | '16' | '17' | '21' | '22' | '23' | '24' | '25' | '26' | '27' | '28' | '29' | '31' | '32' | '33' | '35' | '41' | '42' | '43' | '50' | '51' | '52' | '53'} config.cUFAutor
   * @param {string} [config.cnpj]
   * @param {string} [config.cpf]
   * @param {'1' | '2'} config.tpAmb
   * @param {Object} [config.options]
   * @param {import('axios').AxiosRequestConfig} [config.options.requestOptions]
   * @param {import('https').AgentOptions} [config.options.httpsOptions]
   */
  constructor(config) {
    const { requestOptions = {}, httpsOptions = {} } = config.options || {}

    const certificadoValidator = new CertificadoValidator(config)
    const ambienteValidator = new AmbienteValidator(config)
    const cnpjCpfValidator = new CnpjCpfValidator(config)
    const ufValidator = new UfValidator(config)

    if (!certificadoValidator.isValid()) {
      throw new Error(certificadoValidator.getError())
    }

    if (!ambienteValidator.isValid()) {
      throw new Error(ambienteValidator.getError())
    }

    if (!cnpjCpfValidator.isValid()) {
      throw new Error(cnpjCpfValidator.getError())
    }

    if (!ufValidator.isValid()) {
      throw new Error(ufValidator.getError())
    }

    const { cert, key } = certificadoValidator.getValues()
    const { tpAmb } = ambienteValidator.getValues()
    const { cnpj, cpf } = cnpjCpfValidator.getValues()
    const { cUFAutor } = ufValidator.getValues()

    this.config = Object.freeze({
      cUFAutor: cUFAutor,
      cnpj: cnpj,
      cpf: cpf,
      tpAmb: tpAmb,
      cert: cert,
      key: key,
      requestOptions: Object.freeze(requestOptions),
      httpsOptions: Object.freeze(httpsOptions),
    })

    Object.freeze(this)
  }

  /**
   * @param {string} chNFe
   */
  consultaChCTe(chNFe) {
    const chaveValidator = new ChaveValidator(chNFe)

    if (!chaveValidator.isValid()) {
      throw new Error(chaveValidator.getError())
    }

    const value = chaveValidator.getValues()

    const opts = {
      ...this.config,
      chNFe: value,
    }

    return DistribuicaoCTeController.enviar(opts)
  }

  /**
   * @param {string} nsu
   */
  consultaNSU(nsu) {
    const nsuValidator = new NsuValidator(nsu)

    if (!nsuValidator.isValid()) {
      throw new Error(nsuValidator.getError())
    }

    const value = nsuValidator.getValues()

    const opts = {
      ...this.config,
      nsu: value,
    }

    return DistribuicaoCTeController.enviar(opts)
  }

  /**
   * @param {string} ultNSU
   */
  consultaUltNSU(ultNSU) {
    const nsuValidator = new NsuValidator(ultNSU)

    if (!nsuValidator.isValid()) {
      throw new Error(nsuValidator.getError())
    }

    const value = nsuValidator.getValues()

    const opts = {
      ...this.config,
      ultNSU: value,
    }

    return DistribuicaoCTeController.enviar(opts)
  }
}

module.exports = DistribuicaoCTe
