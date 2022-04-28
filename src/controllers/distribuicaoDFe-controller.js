"use strict"

const schemaDistribuicaoDFe = require("../schema/distribuicaoDFe")
const Client = require("../services/client-service")
const { enveloparXml, json2xml, unzip, xml2json } = require("../util")

exports.enviar = async (opts) => {
  const { requestOpt, httpsOpt } = opts

  const schema = schemaDistribuicaoDFe.schema(opts)
  const xml = json2xml(schema)
  const data = enveloparXml(xml)

  const options = {
    method: "POST",
    data: data,
  }

  const client = new Client({
    service: "distribuicao",
    tpAmb: opts.tpAmb,
    requestOptions: requestOpt,
    httpsOptions: httpsOpt,
  })

  const consultaRetorno = await client.request(options)

  const json = await montarRetorno(consultaRetorno.data)

  const retorno = {
    ...consultaRetorno,
    data: json,
    xml: consultaRetorno.data,
  }

  return retorno
}

/**
 * @returns {Promise<{retDistDFeInt:{tpAmb: string,verAplic: string,cStat: string,xMotivo: string,dhResp: string,ultNSU: string,maxNSU: string}, docZip:[{xml: string,nsu: string}], error: string}>}
 */
async function montarRetorno(data) {
  const retorno = {
    retDistDFeInt: {},
    docZip: [],
    error: "",
  }

  const json = xml2json(data)

  if (json.error) {
    retorno["error"] = json?.error?.value || "Falha ao montar retorno do SEFAZ."
  }

  const {
    "soap:Envelope": {
      "soap:Body": {
        nfeDistDFeInteresseResponse: {
          nfeDistDFeInteresseResult: { retDistDFeInt = {} } = {},
        } = {},
      } = {},
    } = {},
  } = json

  const { loteDistDFeInt = {} } = retDistDFeInt

  if (loteDistDFeInt.docZip) {
    if (!Array.isArray(loteDistDFeInt.docZip)) {
      loteDistDFeInt["docZip"] = [loteDistDFeInt.docZip]
    }
  } else {
    loteDistDFeInt["docZip"] = []
  }

  const docZip = await Promise.all(
    loteDistDFeInt["docZip"].map(async (doc) => {
      const notaXml = await unzip(doc.value)
      return {
        xml: notaXml,
        nsu: doc?._attributes?.NSU,
      }
    })
  )

  retorno["retDistDFeInt"] = {
    tpAmb: retDistDFeInt?.tpAmb?.value || "",
    verAplic: retDistDFeInt?.verAplic?.value || "",
    cStat: retDistDFeInt?.cStat?.value || "",
    xMotivo: retDistDFeInt?.xMotivo?.value || "",
    dhResp: retDistDFeInt?.dhResp?.value || "",
    ultNSU: retDistDFeInt?.ultNSU?.value || "",
    maxNSU: retDistDFeInt?.maxNSU?.value || "",
  }

  retorno["docZip"] = docZip

  return retorno
}
