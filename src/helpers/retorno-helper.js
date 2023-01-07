'use strict'

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
      retorno['error'] = json.error
    }

    if (Math.floor(retornoSefaz.status / 100) > 2 && !json.error) {
      retorno['data'] = {}
      retorno['error'] = retornoSefaz.data
    }

    return retorno
  }
}

module.exports = Object.freeze(RetornoHelper)
