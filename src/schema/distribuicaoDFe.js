"use strict"

exports.schema = (options) => {
  return {
    elements: [
      {
        type: "element",
        name: "nfeDistDFeInteresse",
        attributes: {
          xmlns: "http://www.portalfiscal.inf.br/nfe/wsdl/NFeDistribuicaoDFe",
        },
        elements: [
          {
            type: "element",
            name: "nfeDadosMsg",
            elements: [
              {
                type: "element",
                name: "distDFeInt",
                attributes: {
                  xmlns: "http://www.portalfiscal.inf.br/nfe",
                  versao: "1.01",
                },
                elements: [
                  {
                    type: "element",
                    name: "tpAmb",
                    elements: [
                      {
                        type: "text",
                        text: options.tpAmb,
                      },
                    ],
                  },
                  {
                    type: "element",
                    name: "cUFAutor",
                    elements: [
                      {
                        type: "text",
                        text: options.cUFAutor,
                      },
                    ],
                  },
                  {
                    type: "element",
                    name: "CNPJ",
                    elements: [
                      {
                        type: "text",
                        text: options.cnpj,
                      },
                    ],
                  },
                  {
                    type: "element",
                    name: options.pesquisa.grupo,
                    elements: [
                      {
                        type: "element",
                        name: options.pesquisa.consulta,
                        elements: [
                          {
                            type: "text",
                            text: options.pesquisa.valor,
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  }
}
