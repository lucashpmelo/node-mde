'use strict'

const DistribuicaoController = require('./distribuicaoDFe-controller')
const RecepcaoController = require('./recepcaoEvento-controller')

const controller = Object.freeze({
  DistribuicaoController,
  RecepcaoController,
})

module.exports = controller
