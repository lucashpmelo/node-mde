'use strict'

const DistribuicaoNFe = require('./apis/distribuicaoNFe-api')
const DistribuicaoCTe = require('./apis/distribuicaoCTe-api')
const RecepcaoEvento = require('./apis/recepcaoEvento-api')

module.exports = { DistribuicaoNFe, RecepcaoEvento, DistribuicaoCTe }
module.exports.default = { DistribuicaoNFe, RecepcaoEvento, DistribuicaoCTe }
module.exports.mde = { DistribuicaoNFe, RecepcaoEvento, DistribuicaoCTe }
