"use strict"

const DistribuicaoDFe = require("./services/distribuicaoDFe-service")
const RecepcaoEvento = require("./services/recepcaoEvento-service")

module.exports = {
  DistribuicaoDFe: DistribuicaoDFe,
  RecepcaoEvento: RecepcaoEvento,
}
module.exports.default = {
  DistribuicaoDFe: DistribuicaoDFe,
  RecepcaoEvento: RecepcaoEvento,
}
module.exports.mde = {
  DistribuicaoDFe: DistribuicaoDFe,
  RecepcaoEvento: RecepcaoEvento,
}
