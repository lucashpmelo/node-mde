'use strict'

exports.schema = (options) => {
  const distDFeInt = {
    tpAmb: options.tpAmb,
    cUFAutor: options.cUFAutor,
  }

  if (options.cnpj) {
    distDFeInt['CNPJ'] = options.cnpj
  } else {
    distDFeInt['CPF'] = options.cpf
  }

  distDFeInt[options.pesquisa.grupo] = {
    [options.pesquisa.consulta]: options.pesquisa.valor,
  }

  distDFeInt['@_xmlns'] = 'http://www.portalfiscal.inf.br/nfe'
  distDFeInt['@_versao'] = '1.01'

  return {
    nfeDistDFeInteresse: {
      nfeDadosMsg: {
        distDFeInt: distDFeInt,
      },
      '@_xmlns': 'http://www.portalfiscal.inf.br/nfe/wsdl/NFeDistribuicaoDFe',
    },
  }
}
