'use strict'

class RecepcaoSchema {
  static montarSchema(options) {
    const infEvento = {
      cOrgao: options.cOrgao,
      tpAmb: options.tpAmb,
    }

    if (options.cnpj) {
      infEvento['CNPJ'] = options.cnpj
    } else {
      infEvento['CPF'] = options.cpf
    }

    infEvento['chNFe'] = options.chNFe
    infEvento['dhEvento'] = options.dhEvento
    infEvento['tpEvento'] = options.tpEvento
    infEvento['nSeqEvento'] = options.nSeqEvento
    infEvento['verEvento'] = '1.00'
    infEvento['detEvento'] = {
      descEvento: options.descEvento,
      '@_versao': '1.00',
    }

    if (options.xJust) {
      infEvento.detEvento['xJust'] = options.xJust
    }

    infEvento['@_Id'] = options.infEventoId

    return {
      nfeDadosMsg: {
        envEvento: {
          idLote: options.idLote,
          evento: {
            infEvento: infEvento,
            '@_versao': '1.00',
          },
          '@_xmlns': 'http://www.portalfiscal.inf.br/nfe',
          '@_versao': '1.00',
        },
        '@_xmlns': 'http://www.portalfiscal.inf.br/nfe/wsdl/NFeRecepcaoEvento4',
      },
    }
  }
}

module.exports = Object.freeze(RecepcaoSchema)
