'use strict'

const DistribuicaoSchema = require('./distribuicaoDFe-schema')
const RecepcaoSchema = require('./recepcaoEvento-schema')

const schema = Object.freeze({
  DistribuicaoSchema,
  RecepcaoSchema,
})

module.exports = schema
