'use strict'

const schemaDistribuicaoDFe = require('../schema/distribuicaoDFe')
const Client = require('../services/client-service')
const { enveloparXml, json2xml, unzip, xml2json } = require('../util')

/**
 * @returns {Promise<{data:{tpAmb: string,verAplic: string,cStat: string,xMotivo: string,dhResp: string,ultNSU: string,maxNSU: string, docZip:[{xml: string,json: Object,nsu: string,schema: string}]}, error: string, reqXml: string, resXml: string, status: number}>}
 */
exports.enviar = async (opts) => {
  const schema = schemaDistribuicaoDFe.schema(opts)
  const xml = json2xml(schema)
  const data = enveloparXml(xml)

  const options = {
    method: 'POST',
    data: data,
  }

  const client = new Client({
    service: 'distribuicao',
    tpAmb: opts.tpAmb,
    cert: opts.cert,
    key: opts.key,
    requestOptions: opts.requestOptions,
    httpsOptions: opts.httpsOptions,
  })

  const consultaRetorno = await client.request(options)

  const json = await montarRetorno(consultaRetorno.data)

  const retorno = {
    data: json,
    reqXml: data,
    resXml: consultaRetorno.data,
    status: consultaRetorno.status,
  }

  if (json.error) {
    retorno['data'] = {}
    retorno['error'] = json.error
  }

  if (Math.floor(consultaRetorno.status / 100) > 2 && !json.error) {
    retorno['data'] = {}
    retorno['error'] = consultaRetorno.data
  }

  return retorno
}

/**
 * @returns {Promise<{tpAmb: string,verAplic: string,cStat: string,xMotivo: string,dhResp: string,ultNSU: string,maxNSU: string, docZip:[{xml: string,json: Object,nsu: string,schema: string}], error: string}>}
 */
async function montarRetorno(data) {
  const retorno = {}

  const json = xml2json(data)

  if (json.error) {
    retorno['error'] = json.error
  }

  const {
    'soap:Envelope': {
      'soap:Body': {
        nfeDistDFeInteresseResponse: {
          nfeDistDFeInteresseResult: { retDistDFeInt = {} } = {},
        } = {},
      } = {},
    } = {},
  } = json

  const { loteDistDFeInt = {} } = retDistDFeInt

  if (loteDistDFeInt.docZip) {
    if (!Array.isArray(loteDistDFeInt.docZip)) {
      loteDistDFeInt['docZip'] = [loteDistDFeInt.docZip]
    }
  } else {
    loteDistDFeInt['docZip'] = []
  }

  const docZip = await Promise.all(
    loteDistDFeInt['docZip'].map(async (doc) => {
      const notaXml = await unzip(doc.value)
      const notaJson = xml2json(notaXml)
      return {
        xml: notaXml,
        json: notaJson,
        nsu: doc['@_NSU'],
        schema: doc['@_schema'],
      }
    })
  )

  retorno['tpAmb'] = retDistDFeInt.tpAmb || ''
  retorno['verAplic'] = retDistDFeInt.verAplic || ''
  retorno['cStat'] = retDistDFeInt.cStat || ''
  retorno['xMotivo'] = retDistDFeInt.xMotivo || ''
  retorno['dhResp'] = retDistDFeInt.dhResp || ''
  retorno['ultNSU'] = retDistDFeInt.ultNSU || ''
  retorno['maxNSU'] = retDistDFeInt.maxNSU || ''

  retorno['docZip'] = docZip

  return retorno
}
