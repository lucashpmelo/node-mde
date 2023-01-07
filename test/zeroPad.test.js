'use strict'

const assert = require('assert')
const { ZeroPad } = require('../src/util')

describe('ZeroPad', function () {
  describe('#padNsu()', function () {
    it('Adicionar zeros a esquerda do NSU', function () {
      assert.equal(ZeroPad.padNsu(''), '000000000000000')
      assert.equal(ZeroPad.padNsu('0'), '000000000000000')
      assert.equal(ZeroPad.padNsu('01'), '000000000000001')
      assert.equal(ZeroPad.padNsu('1337'), '000000000001337')
      assert.equal(ZeroPad.padNsu('000000000001337'), '000000000001337')
      assert.equal(ZeroPad.padNsu('330100000000000'), '330100000000000')
      assert.equal(ZeroPad.padNsu('330100000001337'), '330100000001337')
      assert.equal(ZeroPad.padNsu('123456789123456'), '123456789123456')
    })

    it('Imutabilidade', function () {
      assert.throws(function () {
        ZeroPad.padNsu = 'subscrever padNsu'
      })
    })
  })
})
