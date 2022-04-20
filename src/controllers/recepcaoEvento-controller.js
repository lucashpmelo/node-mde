"use strict"

const https = require("https")

const schemaRecepcaoEvento = require("../schema/recepcaoEvento")
const Client = require("../services/client-service")
const { assinaturaXml, enveloparXml, json2xml, xml2json } = require("../util")

const URL = {
  1: "https://www.nfe.fazenda.gov.br/NFeRecepcaoEvento4/NFeRecepcaoEvento4.asmx?wsdl",
  2: "https://hom.nfe.fazenda.gov.br/NFeRecepcaoEvento4/NFeRecepcaoEvento4.asmx?wsdl",
}

exports.enviar = async (opt, requestOpt, httpsOpt) => {
  const baseURL = URL[opt.tpAmb]

  const AgentOptions = Object.assign(
    {
      cert: opt.cert,
      key: opt.key,
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

  const schema = schemaRecepcaoEvento.schema(opt)
  const xml = json2xml(schema)
  const xmlSign = assinaturaXml(opt.cert, opt.key, xml)
  const data = enveloparXml(xmlSign)

  const options = {
    method: "POST",
    data: data,
  }

  const client = new Client({ requestOptions: requestOptions })

  const eventoRetorno = await client.request(options)

  const json = montarRetorno(eventoRetorno.data)

  const retorno = {
    ...eventoRetorno,
    data: json,
    xml: eventoRetorno.data,
  }

  return retorno
}

function montarRetorno(data) {
  try {
    const json = xml2json(data)

    if (json.error) {
      throw new Error(json?.error?.value || "Falha ao montar retorno do SEFAZ.")
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

    const retorno = {
      retEnvEvento: {
        idLote: retEnvEvento?.idLote?.value || "",
        tpAmb: retEnvEvento?.tpAmb?.value || "",
        verAplic: retEnvEvento?.verAplic?.value || "",
        cOrgao: retEnvEvento?.cOrgao?.value || "",
        cStat: retEnvEvento?.cStat?.value || "",
        xMotivo: retEnvEvento?.xMotivo?.value || "",
      },
      infEvento: {
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
      },
    }

    return retorno
  } catch (e) {
    return { error: `${e.message || e}` }
  }
}
