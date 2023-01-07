'use strict'

const assert = require('assert')
const fs = require('fs')
const { Certificado } = require('../src/util')

const certificado = {
  pfx: fs.readFileSync('certs/certificado.pfx'),
  passphrase: fs.readFileSync('certs/passphrase.txt', 'utf8'),
  cert: fs.readFileSync('certs/cert.pem', 'utf8'),
  key: fs.readFileSync('certs/key.pem', 'utf8'),
}

describe('Certificado', function () {
  describe('#p12ToPem()', function () {
    it('Converter pfx para pem', function () {
      const { cert, key } = Certificado.p12ToPem(
        certificado.pfx,
        certificado.passphrase
      )

      assert.equal(cert, certificado.cert)
      assert.equal(key, certificado.key)
    })

    it('Imutabilidade', function () {
      assert.throws(function () {
        Certificado.p12ToPem = 'subscrever p12ToPem'
      })
    })
  })
})
