'use strict'

const schemaRecepcaoEvento = require('../schema/recepcaoEvento')
const Client = require('../services/client-service')
const { assinaturaXml, enveloparXml, json2xml, xml2json } = require('../util')

/**
 * @returns {Promise<{data:{idLote: string,tpAmb: string,verAplic: string,cOrgao: string,cStat: string,xMotivo: string, infEvento:[{tpAmb: string,verAplic: string,cOrgao: string,cStat: string,xMotivo: string,chNFe: string,tpEvento: string,xEvento: string,nSeqEvento: string,CNPJDest: string,dhRegEvento: string,nProt: string}]}, error: string, reqXml: string, resXml: string, status: number}>}
 */
exports.enviar = async (opts) => {
  const eventosXML = opts.eventos.map((evento) => {
    const schema = schemaRecepcaoEvento.schema(evento)
    const xml = json2xml(schema)
    const xmlSign = assinaturaXml(opts.cert, opts.key, xml)

    return xmlSign
  })

  const xml = schemaRecepcaoEvento.schemaLote({
    idLote: opts.idLote,
    eventosXML: eventosXML,
  })

  const data = enveloparXml(xml)

  const options = {
    method: 'POST',
    data: data,
  }

  const client = new Client({
    service: 'recepcao',
    tpAmb: opts.tpAmb,
    cert: opts.cert,
    key: opts.key,
    requestOptions: opts.requestOptions,
    httpsOptions: opts.httpsOptions,
  })

  const eventoRetorno = await client.request(options)

  const json = montarRetorno(eventoRetorno.data)

  const retorno = {
    data: json,
    reqXml: data,
    resXml: eventoRetorno.data,
    status: eventoRetorno.status,
  }

  if (json.error) {
    retorno['data'] = {}
    retorno['error'] = json.error
  }

  if (Math.floor(eventoRetorno.status / 100) > 2 && !json.error) {
    retorno['data'] = {}
    retorno['error'] = eventoRetorno.data
  }

  return retorno
}

/**
 * @returns {{idLote: string,tpAmb: string,verAplic: string,cOrgao: string,cStat: string,xMotivo: string, infEvento:[{tpAmb: string,verAplic: string,cOrgao: string,cStat: string,xMotivo: string,chNFe: string,tpEvento: string,xEvento: string,nSeqEvento: string,CNPJDest: string,dhRegEvento: string,nProt: string}], error: string}}
 */
function montarRetorno(data) {
  const retorno = {}

  const json = xml2json(data)

  if (json.error) {
    retorno['error'] = json.error
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
