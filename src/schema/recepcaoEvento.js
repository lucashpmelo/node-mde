'use strict'

exports.schema = (options) => {
  options['detEvento'] = {
    descEvento: options.descEvento,
    '@_versao': '1.00',
  }

  if (options.xJust) {
    options.detEvento['xJust'] = options.xJust
  }

  return {
    nfeDadosMsg: {
      envEvento: {
        idLote: options.idLote,
        evento: {
          infEvento: {
            cOrgao: options.cOrgao,
            tpAmb: options.tpAmb,
            CNPJ: options.cnpj,
            chNFe: options.chNFe,
            dhEvento: options.dhEvento,
            tpEvento: options.tpEvento,
            nSeqEvento: options.nSeqEvento,
            verEvento: '1.00',
            detEvento: options.detEvento,
            '@_Id': options.infEventoId,
          },
          '@_versao': '1.00',
        },
        '@_xmlns': 'http://www.portalfiscal.inf.br/nfe',
        '@_versao': '1.00',
      },
      '@_xmlns': 'http://www.portalfiscal.inf.br/nfe/wsdl/NFeRecepcaoEvento4',
    },
  }
}

exports.schemaLote = (options) => {
  const { idLote, eventosXML } = options

  return `<nfeDadosMsg xmlns="http://www.portalfiscal.inf.br/nfe/wsdl/NFeRecepcaoEvento4"><envEvento xmlns="http://www.portalfiscal.inf.br/nfe" versao="1.00"><idLote>${idLote}</idLote>${eventosXML.reduce(
    (acc, cur) => {
      acc += cur.substring(
        cur.indexOf('<evento versao="1.00">'),
        cur.indexOf('</envEvento>')
      )

      return acc
    },
    ''
  )}</envEvento></nfeDadosMsg>`
}
