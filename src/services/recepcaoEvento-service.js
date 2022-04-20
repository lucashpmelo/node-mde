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
  constructor(opt) {
    const { requestOptions = {}, httpsOptions = {} } = opt.options || {}

    let cert = opt.cert || ""
    let key = opt.key || ""

    if (opt.pfx) {
      if (!opt.passphrase) {
        throw new Error("Senha do Certificado não informada.")
      }

      const pfxLoad = convertPFX(opt.pfx, opt.passphrase)

      cert = pfxLoad.cert
      key = pfxLoad.key
    }

    if (!cert) {
      throw new Error("Cert não informado.")
    }

    if (!key) {
      throw new Error("Key não informada.")
    }

    if (!opt.chNFe) {
      throw new Error("Chave da NFe não informada.")
    }

    if (!opt.cnpj) {
      throw new Error("CNPJ não informado.")
    }

    if (!opt.tpAmb) {
      throw new Error("Ambiente não informado.")
    }

    this.chNFe = opt.chNFe
    this.cnpj = opt.cnpj
    this.tpAmb = opt.tpAmb
    this.idLote = opt.idLote || 1
    this.nSeqEvento = opt.nSeqEvento || 1
    this.cOrgao = opt.cOrgao || 91
    this.timezone = opt.timezone || "America/Sao_Paulo"
    this.cert = cert
    this.key = key
    this.requestOptions = requestOptions
    this.httpsOptions = httpsOptions
  }

  enviarEvento({ tipoEvento = 210210, justificativa = "" } = {}) {
    if (!EVENTO[tipoEvento]) {
      throw new Error(
        "Tipo Evento deve conter um dos valores: 210200, 210210, 210220 ou 210240"
      )
    }

    const chNFe = this.chNFe
    const cnpj = this.cnpj
    const tpAmb = this.tpAmb
    const idLote = this.idLote
    const timezone = this.timezone
    const nSeqEvento = this.nSeqEvento
    const cOrgao = this.cOrgao
    const { tpEvento, descEvento } = EVENTO[tipoEvento]
    const infEventoId = `ID${tpEvento}${chNFe}01`
    const dhEvento = moment().tz(timezone).format("YYYY-MM-DD[T]HH:mm:ssZ")

    const opt = {
      chNFe: chNFe,
      cnpj: cnpj,
      tpAmb: tpAmb,
      idLote: idLote,
      nSeqEvento: nSeqEvento,
      cOrgao: cOrgao,
      tpEvento: tpEvento,
      descEvento: descEvento,
      infEventoId: infEventoId,
      dhEvento: dhEvento,
      cert: this.cert,
      key: this.key,
    }

    if (Number(tipoEvento) === 210240) {
      if (!justificativa) {
        throw new Error("Justificativa não informada.")
      }

      if (justificativa.length < 15 || justificativa.length > 255) {
        throw new Error("Justificativa com tamanho incorreto.")
      }

      opt["xJust"] = justificativa
    }

    return controllerRecepcaoEvento.enviar(
      opt,
      this.requestOptions,
      this.httpsOptions
    )
  }
}

module.exports = RecepcaoEvento
