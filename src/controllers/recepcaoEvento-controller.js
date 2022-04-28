"use strict"

const schemaRecepcaoEvento = require("../schema/recepcaoEvento")
const Client = require("../services/client-service")
const { assinaturaXml, enveloparXml, json2xml, xml2json } = require("../util")

exports.enviar = async (opts) => {
  const { requestOpt, httpsOpt } = opts

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
    requestOptions: requestOpt,
    httpsOptions: httpsOpt,
  })

  const eventoRetorno = await client.request(options)

  const json = montarRetorno(eventoRetorno.data)

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
    retorno["error"] = json?.error?.value || "Falha ao montar retorno do SEFAZ."
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
    idLote: retEnvEvento?.idLote?.value || "",
    tpAmb: retEnvEvento?.tpAmb?.value || "",
    verAplic: retEnvEvento?.verAplic?.value || "",
    cOrgao: retEnvEvento?.cOrgao?.value || "",
    cStat: retEnvEvento?.cStat?.value || "",
    xMotivo: retEnvEvento?.xMotivo?.value || "",
  }

  retorno["infEvento"] = {
    tpAmb: infEvento?.tpAmb?.value || "",
    verAplic: infEvento?.verAplic?.value || "",
    cOrgao: infEvento?.cOrgao?.value || "",
    cStat: infEvento?.cStat?.value || "",
    xMotivo: infEvento?.xMotivo?.value || "",
    chNFe: infEvento?.chNFe?.value || "",
    tpEvento: infEvento?.tpEvento?.value || "",
    xEvento: infEvento?.xEvento?.value || "",
    nSeqEvento: infEvento?.nSeqEvento?.value || "",
    dhRegEvento: infEvento?.dhRegEvento?.value || "",
  }

  return retorno
}
