'use strict'

const { CA, RECEPCAO } = require('../env')
const { RecepcaoSchema } = require('../schemas')
const SefazService = require('../services/sefaz-service')
const { Assinatura, Xml } = require('../util')

class RecepcaoHelper {
  /**
   *
   * @param {string} data
   * @param {Object} opts
   * @returns
   */
  static async enviarEvento(data, opts) {
    const baseURL = RECEPCAO[opts.tpAmb]
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
    const eventosXML = opts.eventos.map((evento) => {
      const schema = RecepcaoSchema.montarSchema(evento)
      const xml = Xml.jsonToXml(schema)
      const xmlSign = Assinatura.assinarXml(opts.cert, opts.key, xml)

      return xmlSign
    })

    const xml = `<nfeDadosMsg xmlns="http://www.portalfiscal.inf.br/nfe/wsdl/NFeRecepcaoEvento4"><envEvento xmlns="http://www.portalfiscal.inf.br/nfe" versao="1.00"><idLote>${
      opts.idLote
    }</idLote>${eventosXML.reduce((acc, cur) => {
      acc += cur.substring(
        cur.indexOf('<evento versao="1.00">'),
        cur.indexOf('</envEvento>')
      )

      return acc
    }, '')}</envEvento></nfeDadosMsg>`

    const data = Xml.envelopar(xml)

    return data
  }

  /**
   *
   * @param {string} data
   * @returns {{idLote: string,tpAmb: string,verAplic: string,cOrgao: string,cStat: string,xMotivo: string, infEvento:[{tpAmb: string,verAplic: string,cOrgao: string,cStat: string,xMotivo: string,chNFe: string,tpEvento: string,xEvento: string,nSeqEvento: string,CNPJDest: string,dhRegEvento: string,nProt: string}], error: string}}
   */
  static montarResponse(data) {
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
          nfeRecepcaoEventoNFResult: { retEnvEvento = {} } = {},
        } = {},
      } = {},
    } = json

    if (retEnvEvento.retEvento) {
      if (!Array.isArray(retEnvEvento.retEvento)) {
        retEnvEvento['retEvento'] = [retEnvEvento.retEvento]
      }
    } else {
      retEnvEvento['retEvento'] = []
    }

    retorno['idLote'] = retEnvEvento.idLote || ''
    retorno['tpAmb'] = retEnvEvento.tpAmb || ''
    retorno['verAplic'] = retEnvEvento.verAplic || ''
    retorno['cOrgao'] = retEnvEvento.cOrgao || ''
    retorno['cStat'] = retEnvEvento.cStat || ''
    retorno['xMotivo'] = retEnvEvento.xMotivo || ''

    retorno['infEvento'] = retEnvEvento.retEvento.map(({ infEvento }) => {
      return {
        tpAmb: infEvento.tpAmb || '',
        verAplic: infEvento.verAplic || '',
        cOrgao: infEvento.cOrgao || '',
        cStat: infEvento.cStat || '',
        xMotivo: infEvento.xMotivo || '',
        chNFe: infEvento.chNFe || '',
        tpEvento: infEvento.tpEvento || '',
        xEvento: infEvento.xEvento || '',
        nSeqEvento: infEvento.nSeqEvento || '',
        CNPJDest: infEvento.CNPJDest || '',
        dhRegEvento: infEvento.dhRegEvento || '',
        nProt: infEvento.nProt || '',
      }
    })

    return retorno
  }
}

module.exports = Object.freeze(RecepcaoHelper)
