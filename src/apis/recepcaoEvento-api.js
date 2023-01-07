'use strict'

const { RecepcaoController } = require('../controllers')
const { Data } = require('../util')
const {
  AmbienteValidator,
  CertificadoValidator,
  CnpjCpfValidator,
  EventoValidator,
  LoteValidator,
  ZoneValidator,
} = require('../validators')

class RecepcaoEvento {
  /**
   * @param {Object} config
   * @param {Buffer} [config.pfx]
   * @param {string} [config.passphrase]
   * @param {Buffer | string} [config.cert]
   * @param {Buffer | string} [config.key]
   * @param {string} [config.cnpj]
   * @param {string} [config.cpf]
   * @param {'1' | '2'} config.tpAmb
   * @param {'America/Araguaina' | 'America/Bahia' | 'America/Belem' | 'America/Boa_Vista' | 'America/Campo_Grande' | 'America/Cuiaba' | 'America/Fortaleza' | 'America/Maceio' | 'America/Manaus' | 'America/Noronha' | 'America/Porto_Velho' | 'America/Recife' | 'America/Rio_Branco' | 'America/Sao_Paulo'} [config.timezone = 'America/Sao_Paulo']
   * @param {Object} [config.options]
   * @param {import('axios').AxiosRequestConfig} [config.options.requestOptions]
   * @param {import('https').AgentOptions} [config.options.httpsOptions]
   */
  constructor(config) {
    const { requestOptions = {}, httpsOptions = {} } = config.options || {}

    const certificadoValidator = new CertificadoValidator(config)
    const ambienteValidator = new AmbienteValidator(config)
    const cnpjCpfValidator = new CnpjCpfValidator(config)
    const zoneValidator = new ZoneValidator(config)

    if (!certificadoValidator.isValid()) {
      throw new Error(certificadoValidator.getError())
    }

    if (!ambienteValidator.isValid()) {
      throw new Error(ambienteValidator.getError())
    }

    if (!cnpjCpfValidator.isValid()) {
      throw new Error(cnpjCpfValidator.getError())
    }

    if (!zoneValidator.isValid()) {
      throw new Error(zoneValidator.getError())
    }

    const { cert, key } = certificadoValidator.getValues()
    const { tpAmb } = ambienteValidator.getValues()
    const { cnpj, cpf } = cnpjCpfValidator.getValues()
    const { timezone } = zoneValidator.getValues()

    this.config = Object.freeze({
      cnpj: cnpj,
      cpf: cpf,
      tpAmb: tpAmb,
      timezone: timezone,
      cert: cert,
      key: key,
      requestOptions: Object.freeze(requestOptions),
      httpsOptions: Object.freeze(httpsOptions),
    })

    Object.freeze(this)
  }

  /**
   * @param {Object} options
   * @param {string} [options.idLote = '1']
   * @param {{chNFe: string, tipoEvento: 210200 | 210210 | 210220 | 210240, justificativa?: string}[]} options.lote
   */
  enviarEvento(options) {
    const opts = { ...this.config }

    const loteValidator = new LoteValidator(options)

    if (!loteValidator.isValid()) {
      throw new Error(loteValidator.getError())
    }

    const { idLote, lote } = loteValidator.getValues()

    const eventos = lote.map((evento) => {
      const retorno = {}

      const eventoValidator = new EventoValidator(evento)

      if (!eventoValidator.isValid()) {
        throw new Error(eventoValidator.getError())
      }

      const { chNFe, justificativa, tpEvento, descEvento } =
        eventoValidator.getValues()

      if (justificativa) {
        retorno['xJust'] = justificativa
      }

      retorno['idLote'] = idLote
      retorno['nSeqEvento'] = '1'
      retorno['cOrgao'] = '91'
      retorno['tpAmb'] = opts.tpAmb
      retorno['cnpj'] = opts.cnpj
      retorno['cpf'] = opts.cpf
      retorno['tpEvento'] = tpEvento
      retorno['descEvento'] = descEvento
      retorno['chNFe'] = chNFe
      retorno['infEventoId'] = `ID${tpEvento}${chNFe}01`
      retorno['dhEvento'] = Data.toFormat(new Date(), opts.timezone)

      return retorno
    })

    opts['idLote'] = idLote
    opts['eventos'] = eventos

    return RecepcaoController.enviar(opts)
  }
}

module.exports = RecepcaoEvento
