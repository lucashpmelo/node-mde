'use strict'

const { CA, DISTRIBUICAOCTE } = require('../env')
const { DistribuicaoCTeSchema } = require('../schemas')
const SefazService = require('../services/sefaz-service')
const { Gzip, Xml } = require('../util')

class DistribuicaoCTeHelper {
  /**
   *
   * @param {string} data
   * @param {Object} opts
   * @returns
   */
  static async enviarConsulta(data, opts) {
    const baseURL = DISTRIBUICAOCTE[opts.tpAmb]
    const options = {
      method: 'POST',
      data: data,
    }

    const client = new SefazService({
      baseURL: baseURL,
      ca: CA,
      cert: opts.cert,
      key: opts.key,
      requestOptions: opts.requestOptions,
      httpsOptions: opts.httpsOptions,
    })

    const retorno = await client.request(options)

    return retorno
  }

  /**
   *
   * @param {Object} opts
   * @returns {string}
   */
  static montarRequest(opts) {
    const schema = DistribuicaoCTeSchema.montarSchema(opts)
    const xml = Xml.jsonToXml(schema)
    const data = Xml.envelopar(xml)

    return data
  }

  /**
   *
   * @param {string} data
   * @returns {Promise<{tpAmb: string,verAplic: string,cStat: string,xMotivo: string,dhResp: string,ultNSU: string,maxNSU: string, docZip:[{xml: string,json: Object,nsu: string,schema: string}], error: string}>}
   */
  static async montarResponse(data) {
    const retorno = {}

    const json = Xml.xmlToJson(data)

    if (json.error) {
      retorno['error'] = {
        xml: json.error,
        json: Xml.xmlToJson(json.error),
      }
    }

    const {
      'soap:Envelope': {
        'soap:Body': {
          cteDistDFeInteresseResponse: {
            cteDistDFeInteresseResult: { retDistDFeInt = {} } = {},
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
        const notaXml = await Gzip.unzip(doc.value)
        const notaJson = Xml.xmlToJson(notaXml)
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
}

module.exports = Object.freeze(DistribuicaoCTeHelper)
