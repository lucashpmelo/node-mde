'use strict'

const assert = require('assert')
const { Gzip } = require('../src/util')

const XML_ZIP =
  'H4sIAAAAAAAEAIVS22qDQBD9FfFdd9Z7ZLKQphosqQ3mQuibMZto8RJcifn8rjG9PZUdZg7DOWeGYbHlIg65cqvKWvg3cZyqedddfEL6vtd7U2/aMzEAKNm/LtdZzqtU/SYX/5O1ohZdWmdcVa68FWkzVakO8PD4o780bZeWp0JkaakX9Uk/tKQ+cZVhlssVmUkNoPLZnjcAGKBtDwVMzzIodak3AIO6HpJRg/N49cL+apDcm3iLm4qz99lKWSSzMJrPlEAJnqPNWyJRlATLCMnIwShgUkqpNLEAHBOJ7OAxD6qCGWCARkEDZwPg30MDU2YkIwG7SxwyiuRe8SqTN3H1iXQZMB6L8y4t2W73sXdtJ+6TUDhGveaLbc9DsXyyt1NpNZLkzIRnh675PZZOfMP2LfNn7IOD9aptOkaHy5meDS44FnWRjG3M1kU3HEmu9gWRjP+BfQI6BY33GAIAAA=='
const XML_UNZIP =
  '<resNFe xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" versao="1.00" xmlns="http://www.portalfiscal.inf.br/nfe"><chNFe>31201010588201000105550010038421171838422178</chNFe><CNPJ>10588201000105</CNPJ><xNome>ZAP GRAFICA E EDITORA EIRELI</xNome><IE>0011182040063</IE><dhEmi>2020-10-06T00:00:00-03:00</dhEmi><tpNF>1</tpNF><vNF>897.93</vNF><digVal>VVjX756NwRFs62nSeGUweFsLB5U=</digVal><dhRecbto>2020-10-06T19:25:43-03:00</dhRecbto><nProt>131203850706417</nProt><cSitNFe>1</cSitNFe></resNFe>'

describe('Gzip', function () {
  describe('#unzip()', function () {
    it('Descompactar XML', async function () {
      const xml = await Gzip.unzip(XML_ZIP)

      assert.equal(xml, XML_UNZIP)
    })

    it('Imutabilidade', function () {
      assert.throws(function () {
        Gzip.unzip = 'subscrever unzip'
      })
    })
  })
})
