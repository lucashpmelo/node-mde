"use strict"

const moment = require("moment-timezone")

const controllerRecepcaoEvento = require("../controllers/recepcaoEvento-controller")
const { convertPFX } = require("../util")

const EVENTO = {
  210200: { tpEvento: 210200, descEvento: "Confirmacao da Operacao" },
  210210: { tpEvento: 210210, descEvento: "Ciencia da Operacao" },
  210220: {
    tpEvento: 210220,
    descEvento: "Desconhecimento da Operacao",
  },
  210240: { tpEvento: 210240, descEvento: "Operacao nao Realizada" },
}
class RecepcaoEvento {
  /**
   * @param {Object} opts
   * @param {Buffer} [opts.pfx]
   * @param {string} [opts.passphrase]
   * @param {string} [opts.cert]
   * @param {string} [opts.key]
   * @param {string} opts.cnpj
   * @param {string} opts.tpAmb
   * @param {string} [opts.idLote = '1']
   * @param {string} [opts.nSeqEvento = '1']
   * @param {string} [opts.cOrgao = '91']
   * @param {string} [opts.timezone = 'America/Sao_Paulo']
   * @param {Object} [opts.options]
   * @param {Object} [opts.options.requestOptions]
   * @param {Object} [opts.options.httpsOptions]
   */
  constructor(opts) {
    const { requestOptions = {}, httpsOptions = {} } = opts.options || {}

    let cert = opts.cert || ""
    let key = opts.key || ""

    if (opts.pfx) {
      if (!opts.passphrase) {
        throw new Error("Senha do Certificado não informada.")
      }

      const pfxLoad = convertPFX(opts.pfx, opts.passphrase)

      cert = pfxLoad.cert
      key = pfxLoad.key
    }

    if (!cert) {
      throw new Error("Cert não informado.")
    }

    if (!key) {
      throw new Error("Key não informada.")
    }

    if (!opts.cnpj) {
      throw new Error("CNPJ não informado.")
    }

    if (!opts.tpAmb) {
      throw new Error("Ambiente não informado.")
    }

    this.opts = {
      cnpj: opts.cnpj,
      tpAmb: opts.tpAmb,
      idLote: opts.idLote || "1",
      nSeqEvento: opts.nSeqEvento || "1",
      cOrgao: opts.cOrgao || "91",
      timezone: opts.timezone || "America/Sao_Paulo",
      cert: cert,
      key: key,
      requestOptions: requestOptions,
      httpsOptions: httpsOptions,
    }
  }

  /**
   * @param {Object} evento
   * @param {string} evento.chNFe
   * @param {number} evento.tipoEvento
   * @param {string} evento.justificativa
   */
  enviarEvento(evento) {
    const opts = this.opts
    const { chNFe, tipoEvento, justificativa } = evento || {}

    if (!chNFe) {
      throw new Error("Chave da NFe não informada.")
    }

    if (!tipoEvento) {
      throw new Error("Tipo Evento não informado.")
    }

    if (!EVENTO[tipoEvento]) {
      throw new Error(
        "Tipo Evento deve conter um dos valores: 210200, 210210, 210220 ou 210240"
      )
    }

    if (Number(tipoEvento) === 210240) {
      if (!justificativa) {
        throw new Error("Justificativa não informada.")
      }

      if (justificativa.length < 15 || justificativa.length > 255) {
        throw new Error("Justificativa com tamanho incorreto.")
      }

      opts["xJust"] = justificativa
    }

    const { tpEvento, descEvento } = EVENTO[tipoEvento]

    opts["tpEvento"] = tpEvento
    opts["descEvento"] = descEvento
    opts["infEventoId"] = `ID${tpEvento}${chNFe}01`
    opts["dhEvento"] = moment()
      .tz(opts.timezone)
      .format("YYYY-MM-DD[T]HH:mm:ssZ")

    return controllerRecepcaoEvento.enviar(opts)
  }
}

module.exports = RecepcaoEvento
