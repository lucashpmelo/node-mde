'use strict'

const moment = require('moment-timezone')

const controllerRecepcaoEvento = require('../controllers/recepcaoEvento-controller')
const { convertPFX } = require('../util')

const EVENTO = {
  210200: { tpEvento: 210200, descEvento: 'Confirmacao da Operacao' },
  210210: { tpEvento: 210210, descEvento: 'Ciencia da Operacao' },
  210220: {
    tpEvento: 210220,
    descEvento: 'Desconhecimento da Operacao',
  },
  210240: { tpEvento: 210240, descEvento: 'Operacao nao Realizada' },
}
class RecepcaoEvento {
  /**
   * @param {Object} config
   * @param {Buffer} [config.pfx]
   * @param {string} [config.passphrase]
   * @param {string} [config.cert]
   * @param {string} [config.key]
   * @param {string} config.cnpj
   * @param {'1' | '2'} config.tpAmb
   * @param {string} [config.timezone = 'America/Sao_Paulo']
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

    if (!config.cnpj) {
      throw new Error('CNPJ não informado.')
    }

    if (!config.tpAmb) {
      throw new Error('Ambiente não informado.')
    }

    this.config = Object.freeze({
      cnpj: config.cnpj,
      tpAmb: config.tpAmb,
      timezone: config.timezone || 'America/Sao_Paulo',
      cert: cert,
      key: key,
      requestOptions: Object.freeze({ ...requestOptions }),
      httpsOptions: Object.freeze({ ...httpsOptions }),
    })

    Object.freeze(this)
  }

  /**
   * @param {Object} options
   * @param {string} [options.idLote = '1']
   * @param {{chNFe: string, tipoEvento: 210200 | 210210 | 210220 | 210240, justificativa?: string}[]} options.lote
   */
  enviarEvento(options) {
    const { idLote = '1', lote = [] } = options || {}

    const opts = { ...this.config }

    const LOTE_MIN_LENGTH = 1
    const LOTE_MAX_LENGTH = 20

    if (!Array.isArray(lote)) {
      throw new Error('Lote não informado.')
    }

    if (lote.length < LOTE_MIN_LENGTH || lote.length > LOTE_MAX_LENGTH) {
      throw new Error(
        `Um lote deve possuir no mínimo ${LOTE_MIN_LENGTH} e no máximo ${LOTE_MAX_LENGTH} eventos.`
      )
    }

    const eventos = lote.map((evento) => {
      const { chNFe, tipoEvento, justificativa } = evento
      const retorno = {}

      if (!chNFe) {
        throw new Error('Chave da NFe não informada.')
      }

      if (!tipoEvento) {
        throw new Error('Tipo Evento não informado.')
      }

      if (!EVENTO[tipoEvento]) {
        throw new Error(
          'Tipo Evento deve conter um dos valores: 210200, 210210, 210220 ou 210240'
        )
      }

      if (Number(tipoEvento) === 210240) {
        if (!justificativa) {
          throw new Error('Justificativa não informada.')
        }

        if (justificativa.length < 15 || justificativa.length > 255) {
          throw new Error('Justificativa com tamanho incorreto.')
        }

        retorno['xJust'] = justificativa
      }

      const { tpEvento, descEvento } = EVENTO[tipoEvento]

      retorno['idLote'] = idLote
      retorno['nSeqEvento'] = '1'
      retorno['cOrgao'] = '91'
      retorno['tpAmb'] = opts.tpAmb
      retorno['cnpj'] = opts.cnpj
      retorno['tpEvento'] = tpEvento
      retorno['descEvento'] = descEvento
      retorno['chNFe'] = chNFe
      retorno['infEventoId'] = `ID${tpEvento}${chNFe}01`
      retorno['dhEvento'] = moment()
        .tz(opts.timezone)
        .format('YYYY-MM-DD[T]HH:mm:ssZ')

      return retorno
    })

    opts['idLote'] = idLote
    opts['eventos'] = eventos

    return controllerRecepcaoEvento.enviar(opts)
  }
}

module.exports = RecepcaoEvento
