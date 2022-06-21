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
   * @param {Object} opts
   * @param {Buffer} [opts.pfx]
   * @param {string} [opts.passphrase]
   * @param {string} [opts.cert]
   * @param {string} [opts.key]
   * @param {string} opts.cnpj
   * @param {'1' | '2'} opts.tpAmb
   * @param {string} [opts.timezone = 'America/Sao_Paulo']
   * @param {Object} [opts.options]
   * @param {Object} [opts.options.requestOptions]
   * @param {Object} [opts.options.httpsOptions]
   */
  constructor(opts) {
    const { requestOptions = {}, httpsOptions = {} } = opts.options || {}

    let cert = opts.cert || ''
    let key = opts.key || ''

    if (opts.pfx) {
      if (!opts.passphrase) {
        throw new Error('Senha do Certificado não informada.')
      }

      const pfxLoad = convertPFX(opts.pfx, opts.passphrase)

      cert = pfxLoad.cert
      key = pfxLoad.key
    }

    if (!cert) {
      throw new Error('Cert não informado.')
    }

    if (!key) {
      throw new Error('Key não informada.')
    }

    if (!opts.cnpj) {
      throw new Error('CNPJ não informado.')
    }

    if (!opts.tpAmb) {
      throw new Error('Ambiente não informado.')
    }

    this.opts = {
      cnpj: opts.cnpj,
      tpAmb: opts.tpAmb,
      timezone: opts.timezone || 'America/Sao_Paulo',
      cert: cert,
      key: key,
      requestOptions: requestOptions,
      httpsOptions: httpsOptions,
    }
  }

  /**
   * @param {Object} options
   * @param {string} [options.idLote = '1']
   * @param {{chNFe: string, tipoEvento: 210200 | 210210 | 210220 | 210240, justificativa?: string}[]} options.lote
   */
  enviarEvento(options) {
    const { idLote = '1', lote = [] } = options || {}

    const opts = this.opts

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
