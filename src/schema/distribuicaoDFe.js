"use strict"

exports.schema = (options) => {
  return {
    nfeDistDFeInteresse: {
      nfeDadosMsg: {
        distDFeInt: {
          tpAmb: options.tpAmb,
          cUFAutor: options.cUFAutor,
          CNPJ: options.cnpj,
          [options.pesquisa.grupo]: {
            [options.pesquisa.consulta]: options.pesquisa.valor,
          },
          "@_xmlns": "http://www.portalfiscal.inf.br/nfe",
          "@_versao": "1.01",
        },
      },
      "@_xmlns": "http://www.portalfiscal.inf.br/nfe/wsdl/NFeDistribuicaoDFe",
    },
  }
}
