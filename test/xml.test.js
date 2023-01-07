'use strict'

const assert = require('assert')
const { Xml } = require('../src/util')

const XML_TESTE =
  '<nfeDistDFeInteresse xmlns="http://www.portalfiscal.inf.br/nfe/wsdl/NFeDistribuicaoDFe"><nfeDadosMsg><distDFeInt xmlns="http://www.portalfiscal.inf.br/nfe" versao="1.01"><tpAmb>2</tpAmb><cUFAutor>29</cUFAutor><CNPJ>99999999999999</CNPJ><distNSU><ultNSU>000000000000001</ultNSU></distNSU></distDFeInt></nfeDadosMsg></nfeDistDFeInteresse>'
const JSON_TESTE = {
  nfeDistDFeInteresse: {
    nfeDadosMsg: {
      distDFeInt: {
        tpAmb: '2',
        cUFAutor: '29',
        CNPJ: '99999999999999',
        distNSU: {
          ultNSU: '000000000000001',
        },
        '@_xmlns': 'http://www.portalfiscal.inf.br/nfe',
        '@_versao': '1.01',
      },
    },
    '@_xmlns': 'http://www.portalfiscal.inf.br/nfe/wsdl/NFeDistribuicaoDFe',
  },
}
const ENVELOPAR_TESTE = `<?xml version="1.0" encoding="utf-8"?><soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope"><soap12:Body>${XML_TESTE}</soap12:Body></soap12:Envelope>`

describe('Xml', function () {
  describe('#jsonToXml()', function () {
    it('Converter JSON para XML', function () {
      assert.equal(Xml.jsonToXml(JSON_TESTE), XML_TESTE)
    })

    it('Imutabilidade', function () {
      assert.throws(function () {
        Xml.jsonToXml = 'subscrever jsonToXml'
      })
    })
  })

  describe('#xmlToJson()', function () {
    it('Converter XML para JSON', function () {
      const json_retorno = Xml.xmlToJson(XML_TESTE)

      assert.equal(
        json_retorno.nfeDistDFeInteresse.nfeDadosMsg.distDFeInt.tpAmb,
        JSON_TESTE.nfeDistDFeInteresse.nfeDadosMsg.distDFeInt.tpAmb
      )
      assert.equal(
        json_retorno.nfeDistDFeInteresse.nfeDadosMsg.distDFeInt.cUFAutor,
        JSON_TESTE.nfeDistDFeInteresse.nfeDadosMsg.distDFeInt.cUFAutor
      )
      assert.equal(
        json_retorno.nfeDistDFeInteresse.nfeDadosMsg.distDFeInt.CNPJ,
        JSON_TESTE.nfeDistDFeInteresse.nfeDadosMsg.distDFeInt.CNPJ
      )
      assert.equal(
        json_retorno.nfeDistDFeInteresse.nfeDadosMsg.distDFeInt.distNSU.ultNSU,
        JSON_TESTE.nfeDistDFeInteresse.nfeDadosMsg.distDFeInt.distNSU.ultNSU
      )
    })

    it('Imutabilidade', function () {
      assert.throws(function () {
        Xml.xmlToJson = 'subscrever xmlToJson'
      })
    })
  })

  describe('#envelopar()', function () {
    it('Envelopar XML', function () {
      assert.equal(Xml.envelopar(XML_TESTE), ENVELOPAR_TESTE)
    })

    it('Imutabilidade', function () {
      assert.throws(function () {
        Xml.envelopar = 'subscrever envelopar'
      })
    })
  })
})
