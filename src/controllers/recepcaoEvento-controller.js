'use strict'

const { RecepcaoHelper, RetornoHelper } = require('../helpers')

class RecepcaoController {
  /**
   *
   * @param {Object} opts
   * @returns {Promise<{data:{idLote: string,tpAmb: string,verAplic: string,cOrgao: string,cStat: string,xMotivo: string, infEvento:[{tpAmb: string,verAplic: string,cOrgao: string,cStat: string,xMotivo: string,chNFe: string,tpEvento: string,xEvento: string,nSeqEvento: string,CNPJDest: string,dhRegEvento: string,nProt: string}]}, error: string, reqXml: string, resXml: string, status: number}>}
   */
  static async enviar(opts) {
    const data = RecepcaoHelper.montarRequest(opts)

    const retornoSefaz = await RecepcaoHelper.enviarEvento(data, opts)

    const json = RecepcaoHelper.montarResponse(retornoSefaz.data)

    const retorno = RetornoHelper.montarRetorno({
      json: json,
      data: data,
      retornoSefaz: retornoSefaz,
    })

    return retorno
  }
}

module.exports = Object.freeze(RecepcaoController)
