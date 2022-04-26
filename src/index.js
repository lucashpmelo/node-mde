"use strict"

const DistribuicaoDFe = require("./services/distribuicaoDFe-service")
const RecepcaoEvento = require("./services/recepcaoEvento-service")

const mde = {
  DistribuicaoDFe: DistribuicaoDFe,
  RecepcaoEvento: RecepcaoEvento,
}

module.exports = mde
module.exports.default = mde
module.exports.mde = mde
