'use strict'

const DistribuicaoNFeController = require('./distribuicaoNFe-controller')
const DistribuicaoCTeController = require('./distribuicaoCTe-controller')
const RecepcaoController = require('./recepcaoEvento-controller')

const controller = Object.freeze({
  DistribuicaoNFeController,
  DistribuicaoCTeController,
  RecepcaoController,
})

module.exports = controller
