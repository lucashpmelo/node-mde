"use strict"

const schemaRecepcaoEvento = require("../schema/recepcaoEvento")
const Client = require("../services/client-service")
const { assinaturaXml, enveloparXml, json2xml, xml2json } = require("../util")

exports.enviar = async (opts) => {
  const schema = schemaRecepcaoEvento.schema(opts)
  const xml = json2xml(schema)
  const xmlSign = assinaturaXml(opts.cert, opts.key, xml)
  const data = enveloparXml(xmlSign)

  const options = {
    method: "POST",
    data: data,
  }

  const client = new Client({
    service: "recepcao",
    tpAmb: opts.tpAmb,
    cert: opts.cert,
    key: opts.key,
    requestOptions: opts.requestOptions,
    httpsOptions: opts.httpsOptions,
  })

  const eventoRetorno = await client.request(options)

  const json = montarRetorno(eventoRetorno.data)

  if (Math.floor(eventoRetorno.status / 100) > 2 && !json.error)
    json["error"] = eventoRetorno.data

  const retorno = {
    ...eventoRetorno,
    data: json,
    xml: eventoRetorno.data,
  }

  return retorno
}

/**
 * @returns {{retEnvEvento:{idLote: string,tpAmb: string,verAplic: string,cOrgao: string,cStat: string,xMotivo: string}, infEvento:{tpAmb: string,verAplic: string,cOrgao: string,cStat: string,xMotivo: string,chNFe: string,tpEvento: string,xEvento: string,nSeqEvento: string,dhRegEvento: string}, error: string}}
 */
function montarRetorno(data) {
  const retorno = {
    retEnvEvento: {},
    infEvento: {},
    error: "",
  }

  const json = xml2json(data)

  if (json.error) {
    retorno["error"] = json.error || "Falha ao montar retorno do SEFAZ."
  }

  const {
    "soap:Envelope": {
      "soap:Body": {
        nfeRecepcaoEventoNFResult: {
          retEnvEvento: {
            retEvento: { infEvento = {} } = {},
            ...retEnvEvento
          } = {},
        } = {},
      } = {},
    } = {},
  } = json

  retorno["retEnvEvento"] = {
    idLote: retEnvEvento.idLote || "",
    tpAmb: retEnvEvento.tpAmb || "",
    verAplic: retEnvEvento.verAplic || "",
    cOrgao: retEnvEvento.cOrgao || "",
    cStat: retEnvEvento.cStat || "",
    xMotivo: retEnvEvento.xMotivo || "",
  }

  retorno["infEvento"] = {
    tpAmb: infEvento.tpAmb || "",
    verAplic: infEvento.verAplic || "",
    cOrgao: infEvento.cOrgao || "",
    cStat: infEvento.cStat || "",
    xMotivo: infEvento.xMotivo || "",
    chNFe: infEvento.chNFe || "",
    tpEvento: infEvento.tpEvento || "",
    xEvento: infEvento.xEvento || "",
    nSeqEvento: infEvento.nSeqEvento || "",
    dhRegEvento: infEvento.dhRegEvento || "",
  }

  return retorno
}
