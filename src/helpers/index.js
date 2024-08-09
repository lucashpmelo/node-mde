'use strict'

const DistribuicaoNFeHelper = require('./distribuicaoNFe-helper')
const DistribuicaoCTeHelper = require('./distribuicaoCTe-helper')
const RecepcaoHelper = require('./recepcaoEvento-helper')
const RetornoHelper = require('./retorno-helper')

const helper = Object.freeze({
  DistribuicaoNFeHelper,
  DistribuicaoCTeHelper,
  RecepcaoHelper,
  RetornoHelper,
})

module.exports = helper
