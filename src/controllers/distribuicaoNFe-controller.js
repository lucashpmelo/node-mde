'use strict'

const { DistribuicaoNFeHelper, RetornoHelper } = require('../helpers')

class DistribuicaoNFeController {
  /**
   *
   * @param {Object} opts
   * @returns {Promise<{data:{tpAmb: string,verAplic: string,cStat: string,xMotivo: string,dhResp: string,ultNSU: string,maxNSU: string, docZip:[{xml: string,json: Object,nsu: string,schema: string}]}, error: string, reqXml: string, resXml: string, status: number}>}
   */
  static async enviar(opts) {
    return this.enviarInterno(opts)
  }

  static async enviarInterno(opts) {
    let temMais = true
    const retornos = []
    while (temMais) {
      const data = DistribuicaoNFeHelper.montarRequest(opts)
      const retornoSefaz = await DistribuicaoNFeHelper.enviarConsulta(
        data,
        opts
      )
      const json = await DistribuicaoNFeHelper.montarResponse(retornoSefaz.data)
      const retorno = RetornoHelper.montarRetorno({
        json: json,
        data: data,
        retornoSefaz: retornoSefaz,
      })
      if (retorno) {
        retornos.push(retorno)
      }

      temMais =
        String(process.env.DEBUG || 'false').toLowerCase() === 'true'
          ? false
          : retorno.data.cStat === '138' &&
            Number(retorno.data.ultNSU) < Number(retorno.data.maxNSU)
    }
    const retornosUnidos = RetornoHelper.juntarRetornos(retornos)
    return retornosUnidos
  }
}

module.exports = Object.freeze(DistribuicaoNFeController)
