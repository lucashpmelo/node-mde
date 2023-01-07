'use strict'

const DistribuicaoHelper = require('./distribuicaoDFe-helper')
const RecepcaoHelper = require('./recepcaoEvento-helper')
const RetornoHelper = require('./retorno-helper')

const helper = Object.freeze({
  DistribuicaoHelper,
  RecepcaoHelper,
  RetornoHelper,
})

module.exports = helper
