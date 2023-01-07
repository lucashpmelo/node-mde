'use strict'

const AmbienteValidator = require('./ambiente-validator')
const CertificadoValidator = require('./certificado-validator')
const ChaveValidator = require('./chave-validator')
const CnpjCpfValidator = require('./cnpjCpf-validator')
const EventoValidator = require('./evento-validator')
const LoteValidator = require('./lote-validator')
const NsuValidator = require('./nsu-validator')
const UfValidator = require('./uf-validator')
const ZoneValidator = require('./zone-validator')

const validator = Object.freeze({
  AmbienteValidator,
  CertificadoValidator,
  ChaveValidator,
  CnpjCpfValidator,
  EventoValidator,
  LoteValidator,
  NsuValidator,
  UfValidator,
  ZoneValidator,
})

module.exports = validator
