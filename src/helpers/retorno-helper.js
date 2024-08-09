'use strict'
const { Xml } = require('../util')
class RetornoHelper {
  /**
   *
   * @param {Object} options
   * @param {Object} options.json
   * @param {string} options.data
   * @param {Object} options.retornoSefaz
   * @param {string} options.retornoSefaz.data
   * @param {number} options.retornoSefaz.status
   * @returns
   */
  static montarRetorno(options) {
    const { json, data, retornoSefaz } = options

    const retorno = {
      data: json,
      reqXml: data,
      resXml: retornoSefaz.data,
      status: retornoSefaz.status,
    }

    if (json.error) {
      retorno['data'] = {}
      retorno['error'] = {
        xml: json.error,
        json: Xml.xmlToJson(json.error),
      }
    }

    if (Math.floor(retornoSefaz.status / 100) > 2 && !json.error) {
      retorno['data'] = {}
      retorno['error'] = {
        xml: retornoSefaz.data,
        json: Xml.xmlToJson(retornoSefaz.data),
      }
    }

    return retorno
  }

  static juntarRetornos(retornos) {
    let retorno = {
      data: {
        tpAmb: '',
        verAplic: '',
        cStat: '',
        xMotivo: '',
        dhResp: '',
        ultNSU: '000000000000000',
        maxNSU: '000000000000000',
        docZip: [],
      },
      status: 0,
    }
    if (!Array.isArray(retornos)) retornos = [retornos]

    retornos.forEach((ret, index) => {
      if (index === 0) {
        retorno = Object.assign(retorno, ret)
      }
      if (retorno.data && ret.data) {
        if (retorno.data.cStat !== '138') {
          retorno.data.cStat = ret.data.cStat
          retorno.data.xMotivo = ret.data.xMotivo
          retorno.data.dhResp = ret.data.dhResp
          // retorno.resXml = ret.resXml
        }
        if (retorno.data.ultNSU > ret.data.ultNSU) {
          retorno.data.ultNSU = ret.data.ultNSU
        }
        if (retorno.data.ultNSU > ret.data.maxNSU) {
          retorno.data.ultNSU = ret.data.maxNSU
        }
        if (retorno.data.maxNSU < ret.data.ultNSU) {
          retorno.data.maxNSU = ret.data.ultNSU
        }
        if (retorno.data.maxNSU < ret.data.maxNSU) {
          retorno.data.maxNSU = ret.data.maxNSU
        }
        if (index > 0 && retorno.data.docZip && ret.data.docZip) {
          retorno.data.docZip = retorno.data.docZip.concat(ret.data.docZip)
        }
      }
    })

    // let menor = '999999999999999',
    //   maior = '000000000000000'
    // retorno.data.docZip.forEach((dz) => {
    //   if (menor > dz.nsu) menor = dz.nsu
    //   if (maior < dz.nsu) maior = dz.nsu
    // })
    // console.log('menor', menor)
    // console.log('maior', maior)
    if (retornos.length > 1) {
      retorno.resXml = 'united'
      retorno.reqXml = 'united'
    }
    return retorno
  }
}

module.exports = Object.freeze(RetornoHelper)
