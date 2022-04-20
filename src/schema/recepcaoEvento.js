"use strict"

exports.schema = (options) => {
  const detEvento = [
    {
      type: "element",
      name: "descEvento",
      elements: [
        {
          type: "text",
          text: options.descEvento,
        },
      ],
    },
  ]

  if (options.xJust) {
    detEvento.push({
      type: "element",
      name: "xJust",
      elements: [
        {
          type: "text",
          text: options.xJust,
        },
      ],
    })
  }

  return {
    elements: [
      {
        type: "element",
        name: "nfeDadosMsg",
        attributes: {
          xmlns: "http://www.portalfiscal.inf.br/nfe/wsdl/NFeRecepcaoEvento4",
        },
        elements: [
          {
            type: "element",
            name: "envEvento",
            attributes: {
              xmlns: "http://www.portalfiscal.inf.br/nfe",
              versao: "1.00",
            },
            elements: [
              {
                type: "element",
                name: "idLote",
                elements: [
                  {
                    type: "text",
                    text: options.idLote,
                  },
                ],
              },
              {
                type: "element",
                name: "evento",
                attributes: { versao: "1.00" },
                elements: [
                  {
                    type: "element",
                    name: "infEvento",
                    attributes: { Id: options.infEventoId },
                    elements: [
                      {
                        type: "element",
                        name: "cOrgao",
                        elements: [
                          {
                            type: "text",
                            text: options.cOrgao,
                          },
                        ],
                      },
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
                        name: "chNFe",
                        elements: [
                          {
                            type: "text",
                            text: options.chNFe,
                          },
                        ],
                      },
                      {
                        type: "element",
                        name: "dhEvento",
                        elements: [
                          {
                            type: "text",
                            text: options.dhEvento,
                          },
                        ],
                      },
                      {
                        type: "element",
                        name: "tpEvento",
                        elements: [
                          {
                            type: "text",
                            text: options.tpEvento,
                          },
                        ],
                      },
                      {
                        type: "element",
                        name: "nSeqEvento",
                        elements: [
                          {
                            type: "text",
                            text: options.nSeqEvento,
                          },
                        ],
                      },
                      {
                        type: "element",
                        name: "verEvento",
                        elements: [
                          {
                            type: "text",
                            text: "1.00",
                          },
                        ],
                      },
                      {
                        type: "element",
                        name: "detEvento",
                        attributes: { versao: "1.00" },
                        elements: detEvento,
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
