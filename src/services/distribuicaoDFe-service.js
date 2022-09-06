'use strict'

const controllerDistribuicaoDFe = require('../controllers/distribuicaoDFe-controller')
const { convertPFX, zeroPad } = require('../util')

class DistribuicaoDFe {
  /**
   * @param {Object} config
   * @param {Buffer} [config.pfx]
   * @param {string} [config.passphrase]
   * @param {Buffer | string} [config.cert]
   * @param {Buffer | string} [config.key]
   * @param {string} config.cUFAutor
   * @param {string} [config.cnpj]
   * @param {string} [config.cpf]
   * @param {'1' | '2'} config.tpAmb
   * @param {Object} [config.options]
   * @param {import('axios').AxiosRequestConfig} [config.options.requestOptions]
   * @param {import('https').AgentOptions} [config.options.httpsOptions]
   */
  constructor(config) {
    const { requestOptions = {}, httpsOptions = {} } = config.options || {}

    let cert = config.cert || ''
    let key = config.key || ''

    if (config.pfx) {
      if (!config.passphrase) {
        throw new Error('Senha do Certificado não informada.')
      }

      const pfxLoad = convertPFX(config.pfx, config.passphrase)

      cert = pfxLoad.cert
      key = pfxLoad.key
    }

    if (!cert) {
      throw new Error('Cert não informado.')
    }

    if (!key) {
      throw new Error('Key não informada.')
    }

    if (!config.cUFAutor) {
      throw new Error('Codigo UF NFe não informado.')
    }

    if (!config.cnpj && !config.cpf) {
      throw new Error('CNPJ/CPF não informado.')
    }

    if (!config.tpAmb) {
      throw new Error('Ambiente não informado.')
    }

    this.config = Object.freeze({
      cUFAutor: config.cUFAutor,
      cnpj: config.cnpj,
      cpf: config.cpf,
      tpAmb: config.tpAmb,
      cert: cert.toString(),
      key: key.toString(),
      requestOptions: Object.freeze(requestOptions),
      httpsOptions: Object.freeze(httpsOptions),
    })

    Object.freeze(this)
  }

  /**
   * @param {string} ultNSU
   */
  consultaUltNSU(ultNSU) {
    if (!ultNSU) {
      throw new Error('Último NSU não informado.')
    }

    ultNSU = String(ultNSU)

    if (ultNSU.length > 15) {
      throw new Error('NSU com tamanho incorreto.')
    }

    const opts = {
      ...this.config,
      pesquisa: {
        grupo: 'distNSU',
        consulta: 'ultNSU',
        valor: zeroPad(ultNSU, 15),
      },
    }

    return controllerDistribuicaoDFe.enviar(opts)
  }

  /**
   * @param {string} chNFe
   */
  consultaChNFe(chNFe) {
    if (!chNFe) {
      throw new Error('chNFe não informada.')
    }

    chNFe = String(chNFe)

    if (chNFe.length !== 44) {
      throw new Error('chNFe com tamanho incorreto.')
    }

    const opts = {
      ...this.config,
      pesquisa: {
        grupo: 'consChNFe',
        consulta: 'chNFe',
        valor: chNFe,
      },
    }

    return controllerDistribuicaoDFe.enviar(opts)
  }

  /**
   * @param {string} nsu
   */
  consultaNSU(nsu) {
    if (!nsu) {
      throw new Error('NSU não informado.')
    }

    nsu = String(nsu)

    if (nsu.length > 15) {
      throw new Error('NSU com tamanho incorreto.')
    }

    const opts = {
      ...this.config,
      pesquisa: {
        grupo: 'consNSU',
        consulta: 'NSU',
        valor: zeroPad(nsu, 15),
      },
    }

    return controllerDistribuicaoDFe.enviar(opts)
  }
}

module.exports = DistribuicaoDFe
