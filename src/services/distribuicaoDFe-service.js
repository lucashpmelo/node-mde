"use strict"

const controllerDistribuicaoDFe = require("../controllers/distribuicaoDFe-controller")
const { convertPFX, zeroPad } = require("../util")

class DistribuicaoDFe {
  constructor(opt) {
    const { requestOptions = {}, httpsOptions = {} } = opt.options

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

    if (!opt.cUFAutor) {
      throw new Error("Codigo UF NFe não informado.")
    }

    if (!opt.cnpj) {
      throw new Error("CNPJ não informado.")
    }

    if (!opt.tpAmb) {
      throw new Error("Ambiente não informado.")
    }

    this.cUFAutor = opt.cUFAutor
    this.cnpj = opt.cnpj
    this.tpAmb = opt.tpAmb
    this.cert = cert
    this.key = key
    this.requestOptions = requestOptions
    this.httpsOptions = httpsOptions
  }

  consultaPorUltNSU(ultNSU) {
    const pesquisa = {
      grupo: "distNSU",
      consulta: "ultNSU",
      valor: "000000000000000",
    }

    if (ultNSU) {
      ultNSU = String(ultNSU)
      if (ultNSU.length > 15) {
        throw new Error("NSU com tamanho incorreto.")
      }
      pesquisa["valor"] = zeroPad(ultNSU, 15)
    }

    const opt = {
      pesquisa: pesquisa,
      cUFAutor: this.cUFAutor,
      cnpj: this.cnpj,
      tpAmb: this.tpAmb,
      cert: this.cert,
      key: this.key,
    }

    return controllerDistribuicaoDFe.enviar(
      opt,
      this.requestOptions,
      this.httpsOptions
    )
  }

  consultaPorChaveNFe(chNFe) {
    if (!chNFe) {
      throw new Error("chNFe não informada.")
    }

    chNFe = String(chNFe)

    if (chNFe.length !== 44) {
      throw new Error("chNFe com tamanho incorreto.")
    }

    const pesquisa = {
      grupo: "consChNFe",
      consulta: "chNFe",
      valor: chNFe,
    }

    const opt = {
      pesquisa: pesquisa,
      cUFAutor: this.cUFAutor,
      cnpj: this.cnpj,
      tpAmb: this.tpAmb,
      cert: this.cert,
      key: this.key,
    }

    return controllerDistribuicaoDFe.enviar(
      opt,
      this.requestOptions,
      this.httpsOptions
    )
  }

  consultaPorNSU(nsu) {
    if (nsu === 0) {
      nsu = "000000000000000"
    }

    if (!nsu) {
      throw new Error("NSU não informado.")
    }

    nsu = String(nsu)
    if (nsu.length > 15) {
      throw new Error("NSU com tamanho incorreto.")
    }

    const pesquisa = {
      grupo: "consNSU",
      consulta: "NSU",
      valor: zeroPad(nsu, 15),
    }

    const opt = {
      pesquisa: pesquisa,
      cUFAutor: this.cUFAutor,
      cnpj: this.cnpj,
      tpAmb: this.tpAmb,
      cert: this.cert,
      key: this.key,
    }

    return controllerDistribuicaoDFe.enviar(
      opt,
      this.requestOptions,
      this.httpsOptions
    )
  }
}

module.exports = DistribuicaoDFe
