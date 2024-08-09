'use strict'

class DistribuicaoCTeSchema {
  static montarSchema(options) {
    const distDFeInt = {
      tpAmb: options.tpAmb,
      cUFAutor: options.cUFAutor,
    }

    if (options.cnpj) {
      distDFeInt['CNPJ'] = options.cnpj
    } else {
      distDFeInt['CPF'] = options.cpf
    }

    if (options.ultNSU) {
      distDFeInt['distNSU'] = {
        ['ultNSU']: options.ultNSU,
      }
    } else if (options.chNFe) {
      distDFeInt['consChCTe'] = {
        ['chNFe']: options.chNFe,
      }
    } else {
      distDFeInt['consNSU'] = {
        ['NSU']: options.nsu,
      }
    }

    distDFeInt['@_versao'] = '1.00'
    distDFeInt['@_xmlns'] = 'http://www.portalfiscal.inf.br/cte'

    return {
      cteDistDFeInteresse: {
        cteDadosMsg: {
          distDFeInt: distDFeInt,
        },
        '@_xmlns': 'http://www.portalfiscal.inf.br/cte/wsdl/CTeDistribuicaoDFe',
      },
    }
  }
}

module.exports = Object.freeze(DistribuicaoCTeSchema)
