'use strict'

const DistribuicaoNFeSchema = require('./distribuicaoNFe-schema')
const DistribuicaoCTeSchema = require('./distribuicaoCTe-schema')
const RecepcaoSchema = require('./recepcaoEvento-schema')

const schema = Object.freeze({
  DistribuicaoNFeSchema,
  DistribuicaoCTeSchema,
  RecepcaoSchema,
})

module.exports = schema
