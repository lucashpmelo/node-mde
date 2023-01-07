'use strict'

const Assinatura = require('./assinatura')
const Certificado = require('./certificado')
const Data = require('./data')
const Gzip = require('./gzip')
const Xml = require('./xml')
const ZeroPad = require('./zeroPad')

const util = Object.freeze({
  Assinatura,
  Certificado,
  Data,
  Gzip,
  Xml,
  ZeroPad,
})

module.exports = util
