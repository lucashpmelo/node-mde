"use strict"

const https = require("https")

const schemaDistribuicaoDFe = require("../schema/distribuicaoDFe")
const Client = require("../services/client-service")
const { enveloparXml, json2xml, unzip, xml2json } = require("../util")

const URL = {
  1: "https://www1.nfe.fazenda.gov.br/NFeDistribuicaoDFe/NFeDistribuicaoDFe.asmx?wsdl",
  2: "https://hom1.nfe.fazenda.gov.br/NFeDistribuicaoDFe/NFeDistribuicaoDFe.asmx?wsdl",
}

exports.enviar = async (opts) => {
  const { requestOpt, httpsOpt } = opts
  const baseURL = URL[opts.tpAmb]

  const AgentOptions = Object.assign(
    {
      cert: opts.cert,
      key: opts.key,
    },
    { ...httpsOpt }
  )

  const httpsAgent = new https.Agent(AgentOptions)

  const requestOptions = Object.assign(
    {
      baseURL: baseURL,
      headers: {
        "User-Agent": `node-mde`,
        "Content-Type": "text/xml;charset=utf-8",
      },
      httpsAgent: httpsAgent,
      timeout: 60000,
    },
    { ...requestOpt }
  )

  const schema = schemaDistribuicaoDFe.schema(opts)
  const xml = json2xml(schema)
  const data = enveloparXml(xml)

  const options = {
    method: "POST",
    data: data,
  }

  const client = new Client({ requestOptions: requestOptions })

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
 * @returns {{retDistDFeInt:{tpAmb: string,verAplic: string,cStat: string,xMotivo: string,dhResp: string,ultNSU: string,maxNSU: string}, docZip:[{xml: string,nsu: string}]} | {error: string}}
 */
async function montarRetorno(data) {
  try {
    const json = xml2json(data)

    if (json.error) {
      throw new Error(json?.error?.value || "Falha ao montar retorno do SEFAZ.")
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

    const retorno = {
      retDistDFeInt: {
        tpAmb: retDistDFeInt?.tpAmb?.value || "",
        verAplic: retDistDFeInt?.verAplic?.value || "",
        cStat: retDistDFeInt?.cStat?.value || "",
        xMotivo: retDistDFeInt?.xMotivo?.value || "",
        dhResp: retDistDFeInt?.dhResp?.value || "",
        ultNSU: retDistDFeInt?.ultNSU?.value || "",
        maxNSU: retDistDFeInt?.maxNSU?.value || "",
      },
      docZip: docZip,
    }

    return retorno
  } catch (e) {
    return { error: `${e.message || e}` }
  }
}
