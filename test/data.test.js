'use strict'

const assert = require('assert')
const { DateTime } = require('luxon')
const { Data } = require('../src/util')

const TIME_ZONES = [
  'America/Noronha',
  'America/Araguaina',
  'America/Bahia',
  'America/Belem',
  'America/Fortaleza',
  'America/Maceio',
  'America/Recife',
  'America/Sao_Paulo',
  'America/Boa_Vista',
  'America/Campo_Grande',
  'America/Cuiaba',
  'America/Manaus',
  'America/Porto_Velho',
  'America/Rio_Branco',
]

describe('Data', function () {
  describe('#toFormat()', function () {
    describe('Data e hora do evento no formato AAAA-MMDDThh:mm:ssTZD', function () {
      TIME_ZONES.forEach((value) => {
        it(value, function () {
          const format = "yyyy-MM-dd'T'HH:mm:ssZZ"
          const date = new Date()

          const dateTime = DateTime.fromJSDate(date)

          assert.equal(
            Data.toFormat(date, value),
            dateTime.setZone(value).toFormat(format)
          )
        })
      })
    })

    it('Imutabilidade', function () {
      assert.throws(function () {
        Data.toFormat = 'subscrever toFormat'
      })
    })
  })
})
