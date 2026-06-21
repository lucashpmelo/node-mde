'use strict'

/**
 * Golden, fixture-driven tests for the *version-sensitive* response helpers
 * (`DistribuicaoHelper.montarResponse` / `RecepcaoHelper.montarResponse`).
 *
 * These are the only paths whose output shape depends on how
 * `fast-xml-parser` parses a real SEFAZ SOAP envelope (text-node key,
 * attribute prefix, single-vs-array coercion, string preservation, entity
 * decoding). The app's `SefazClientService` is stubbed in the consumer's CI,
 * so this fork is the only place that exercises the real parse path — these
 * tests are the regression bar that would catch any shape break introduced by
 * the fast-xml-parser 4.5.3 -> 5.9.3 bump (verified byte-identical across both
 * versions for node-mde's exact `XMLParser` options).
 *
 * Fixtures are constructed to match the structure the helpers actually
 * destructure (the same structure the library already parses successfully in
 * production), and the `docZip` payloads are *really* gzipped so `Gzip.unzip`
 * plus the inner `Xml.xmlToJson` run for real.
 */

const assert = require('assert')
const zlib = require('zlib')
const { DistribuicaoHelper, RecepcaoHelper } = require('../src/helpers')

const CHAVE = '41000000000000000000000000000000000000000041'

// --- Inner documents carried (gzipped) inside <docZip> ---------------------
const PROC_NFE =
  '<procNFe xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">' +
  '<NFe><infNFe Id="NFe' +
  CHAVE +
  '" versao="4.00"><ide><cUF>41</cUF><nNF>12345</nNF></ide>' +
  '<emit><CNPJ>99999999999999</CNPJ><xNome>EMPRESA TESTE LTDA</xNome></emit>' +
  '</infNFe></NFe></procNFe>'

const RES_NFE =
  '<resNFe xmlns="http://www.portalfiscal.inf.br/nfe" versao="1.01">' +
  '<chNFe>' +
  CHAVE +
  '</chNFe><cSitNFe>1</cSitNFe><dhEmi>2026-06-20T08:00:00-03:00</dhEmi></resNFe>'

const PROC_NFE_JSON = {
  procNFe: {
    NFe: {
      infNFe: {
        ide: { cUF: '41', nNF: '12345' },
        emit: { CNPJ: '99999999999999', xNome: 'EMPRESA TESTE LTDA' },
        '@_Id': 'NFe' + CHAVE,
        '@_versao': '4.00',
      },
    },
    '@_xmlns': 'http://www.portalfiscal.inf.br/nfe',
    '@_versao': '4.00',
  },
}

const RES_NFE_JSON = {
  resNFe: {
    chNFe: CHAVE,
    cSitNFe: '1',
    dhEmi: '2026-06-20T08:00:00-03:00',
    '@_xmlns': 'http://www.portalfiscal.inf.br/nfe',
    '@_versao': '1.01',
  },
}

const gzip = (str) => zlib.gzipSync(Buffer.from(str, 'utf8')).toString('base64')

// --- SOAP envelope builders -------------------------------------------------
const distEnvelope = (innerRetDistDFeInt) =>
  '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"><soap:Body>' +
  '<nfeDistDFeInteresseResponse xmlns="http://www.portalfiscal.inf.br/nfe/wsdl/NFeDistribuicaoDFe">' +
  '<nfeDistDFeInteresseResult>' +
  innerRetDistDFeInt +
  '</nfeDistDFeInteresseResult></nfeDistDFeInteresseResponse>' +
  '</soap:Body></soap:Envelope>'

const docZipTag = (nsu, schema, conteudo) =>
  '<docZip NSU="' + nsu + '" schema="' + schema + '">' + conteudo + '</docZip>'

const eventoEnvelope = (innerRetEnvEvento) =>
  '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"><soap:Body>' +
  '<nfeRecepcaoEventoNFResult>' +
  innerRetEnvEvento +
  '</nfeRecepcaoEventoNFResult>' +
  '</soap:Body></soap:Envelope>'

const retEventoTag = (cStat, xMotivo, nProt) =>
  '<retEvento versao="1.00"><infEvento Id="ID2102001">' +
  '<tpAmb>2</tpAmb><verAplic>1.0.0</verAplic><cOrgao>91</cOrgao>' +
  '<cStat>' +
  cStat +
  '</cStat><xMotivo>' +
  xMotivo +
  '</xMotivo><chNFe>' +
  CHAVE +
  '</chNFe><tpEvento>210200</tpEvento><xEvento>Confirmacao da Operacao</xEvento>' +
  '<nSeqEvento>1</nSeqEvento><CNPJDest>99999999999999</CNPJDest>' +
  '<dhRegEvento>2026-06-21T10:00:00-03:00</dhRegEvento>' +
  (nProt ? '<nProt>' + nProt + '</nProt>' : '') +
  '</infEvento></retEvento>'

// --- Fixtures ---------------------------------------------------------------
// cStat 138 with TWO docZip -> exercises the array path + the real gzip/parse.
// xMotivo carries `&amp;` (must decode to `&`) and a literal accented char.
const DIST_138_DUAS =
  distEnvelope(
    '<retDistDFeInt versao="1.01" xmlns="http://www.portalfiscal.inf.br/nfe">' +
      '<tpAmb>2</tpAmb><verAplic>1.0.0</verAplic><cStat>138</cStat>' +
      '<xMotivo>Documento(s) localizado(s) &amp; disponível</xMotivo>' +
      '<dhResp>2026-06-21T10:00:00-03:00</dhResp>' +
      '<ultNSU>000000000000002</ultNSU><maxNSU>000000000000050</maxNSU>' +
      '<loteDistDFeInt>' +
      docZipTag('000000000000001', 'procNFe_v4.00.xsd', gzip(PROC_NFE)) +
      docZipTag('000000000000002', 'resNFe_v1.01.xsd', gzip(RES_NFE)) +
      '</loteDistDFeInt>' +
      '</retDistDFeInt>'
  )

// cStat 138 with a SINGLE docZip -> exercises the single-object -> array coercion.
const DIST_138_UMA =
  distEnvelope(
    '<retDistDFeInt versao="1.01" xmlns="http://www.portalfiscal.inf.br/nfe">' +
      '<tpAmb>2</tpAmb><verAplic>1.0.0</verAplic><cStat>138</cStat>' +
      '<xMotivo>Documento(s) localizado(s)</xMotivo>' +
      '<dhResp>2026-06-21T10:00:00-03:00</dhResp>' +
      '<ultNSU>000000000000001</ultNSU><maxNSU>000000000000050</maxNSU>' +
      '<loteDistDFeInt>' +
      docZipTag('000000000000001', 'procNFe_v4.00.xsd', gzip(PROC_NFE)) +
      '</loteDistDFeInt>' +
      '</retDistDFeInt>'
  )

// cStat 137 (nothing new) -> no loteDistDFeInt -> docZip must be [].
const DIST_137 =
  distEnvelope(
    '<retDistDFeInt versao="1.01" xmlns="http://www.portalfiscal.inf.br/nfe">' +
      '<tpAmb>2</tpAmb><verAplic>1.0.0</verAplic><cStat>137</cStat>' +
      '<xMotivo>Nenhum documento localizado</xMotivo>' +
      '<dhResp>2026-06-21T10:00:00-03:00</dhResp>' +
      '<ultNSU>000000000000050</ultNSU><maxNSU>000000000000050</maxNSU>' +
      '</retDistDFeInt>'
  )

// Transport sentinel emitted by SefazService on a connection/cert error.
const ERROR_SENTINEL = '<error>unable to get local issuer certificate</error>'

// RecepcaoEvento: single event, cStat 135 (registered) -> single -> array coercion.
const EVT_135 =
  eventoEnvelope(
    '<retEnvEvento versao="1.00" xmlns="http://www.portalfiscal.inf.br/nfe">' +
      '<idLote>1337</idLote><tpAmb>2</tpAmb><verAplic>1.0.0</verAplic><cOrgao>91</cOrgao>' +
      '<cStat>128</cStat><xMotivo>Lote de Evento Processado</xMotivo>' +
      retEventoTag('135', 'Evento registrado e vinculado a NF-e', '141250000000001') +
      '</retEnvEvento>'
  )

// RecepcaoEvento: single event, cStat 573 (duplicate event).
const EVT_573 =
  eventoEnvelope(
    '<retEnvEvento versao="1.00" xmlns="http://www.portalfiscal.inf.br/nfe">' +
      '<idLote>1338</idLote><tpAmb>2</tpAmb><verAplic>1.0.0</verAplic><cOrgao>91</cOrgao>' +
      '<cStat>128</cStat><xMotivo>Lote de Evento Processado</xMotivo>' +
      retEventoTag('573', 'Rejeição: Duplicidade de evento', '') +
      '</retEnvEvento>'
  )

// RecepcaoEvento: TWO events -> exercises the array path.
const EVT_DUPLO =
  eventoEnvelope(
    '<retEnvEvento versao="1.00" xmlns="http://www.portalfiscal.inf.br/nfe">' +
      '<idLote>1339</idLote><tpAmb>2</tpAmb><verAplic>1.0.0</verAplic><cOrgao>91</cOrgao>' +
      '<cStat>128</cStat><xMotivo>Lote de Evento Processado</xMotivo>' +
      retEventoTag('135', 'Evento registrado e vinculado a NF-e', '141250000000001') +
      retEventoTag('573', 'Rejeição: Duplicidade de evento', '') +
      '</retEnvEvento>'
  )

describe('DistribuicaoHelper.montarResponse()', function () {
  it('cStat 138 com dois docZip -> snapshot completo (array path)', async function () {
    const result = await DistribuicaoHelper.montarResponse(DIST_138_DUAS)

    assert.deepStrictEqual(result, {
      tpAmb: '2',
      verAplic: '1.0.0',
      cStat: '138',
      // `&amp;` decodes to `&`; the literal accented char survives untouched.
      xMotivo: 'Documento(s) localizado(s) & disponível',
      dhResp: '2026-06-21T10:00:00-03:00',
      ultNSU: '000000000000002',
      maxNSU: '000000000000050',
      docZip: [
        {
          xml: PROC_NFE,
          json: PROC_NFE_JSON,
          nsu: '000000000000001',
          schema: 'procNFe_v4.00.xsd',
        },
        {
          xml: RES_NFE,
          json: RES_NFE_JSON,
          nsu: '000000000000002',
          schema: 'resNFe_v1.01.xsd',
        },
      ],
    })
  })

  it('cStat 138 -> escalares permanecem STRING (parseTagValue:false invariante)', async function () {
    const result = await DistribuicaoHelper.montarResponse(DIST_138_DUAS)

    assert.strictEqual(typeof result.cStat, 'string')
    assert.strictEqual(typeof result.ultNSU, 'string')
    assert.strictEqual(typeof result.maxNSU, 'string')
    // 15-digit zero-padded NSU must keep its leading zeros (not numericized).
    assert.strictEqual(result.ultNSU.length, 15)
    assert.strictEqual(result.ultNSU, '000000000000002')
  })

  it('cStat 138 com um único docZip -> coerção single -> array (1 elemento)', async function () {
    const result = await DistribuicaoHelper.montarResponse(DIST_138_UMA)

    assert.ok(Array.isArray(result.docZip))
    assert.strictEqual(result.docZip.length, 1)
    assert.strictEqual(result.docZip[0].nsu, '000000000000001')
    assert.strictEqual(result.docZip[0].schema, 'procNFe_v4.00.xsd')
    assert.strictEqual(result.docZip[0].xml, PROC_NFE)
    assert.deepStrictEqual(result.docZip[0].json, PROC_NFE_JSON)
  })

  it('cStat 137 (nada novo) -> docZip vazio', async function () {
    const result = await DistribuicaoHelper.montarResponse(DIST_137)

    assert.strictEqual(result.cStat, '137')
    assert.deepStrictEqual(result.docZip, [])
    assert.strictEqual(result.ultNSU, '000000000000050')
  })

  it('sentinela <error> -> propaga error e não lança', async function () {
    const result = await DistribuicaoHelper.montarResponse(ERROR_SENTINEL)

    assert.strictEqual(result.error, 'unable to get local issuer certificate')
    assert.deepStrictEqual(result.docZip, [])
    assert.strictEqual(result.cStat, '')
  })
})

describe('RecepcaoHelper.montarResponse()', function () {
  it('cStat 135 (registrado) -> snapshot completo (single -> array)', function () {
    const result = RecepcaoHelper.montarResponse(EVT_135)

    assert.deepStrictEqual(result, {
      idLote: '1337',
      tpAmb: '2',
      verAplic: '1.0.0',
      cOrgao: '91',
      cStat: '128',
      xMotivo: 'Lote de Evento Processado',
      infEvento: [
        {
          tpAmb: '2',
          verAplic: '1.0.0',
          cOrgao: '91',
          cStat: '135',
          xMotivo: 'Evento registrado e vinculado a NF-e',
          chNFe: CHAVE,
          tpEvento: '210200',
          xEvento: 'Confirmacao da Operacao',
          nSeqEvento: '1',
          CNPJDest: '99999999999999',
          dhRegEvento: '2026-06-21T10:00:00-03:00',
          nProt: '141250000000001',
        },
      ],
    })
    assert.strictEqual(typeof result.infEvento[0].nProt, 'string')
  })

  it('cStat 573 (duplicidade) -> infEvento mapeado, nProt vazio', function () {
    const result = RecepcaoHelper.montarResponse(EVT_573)

    assert.strictEqual(result.infEvento.length, 1)
    assert.strictEqual(result.infEvento[0].cStat, '573')
    assert.strictEqual(result.infEvento[0].xMotivo, 'Rejeição: Duplicidade de evento')
    assert.strictEqual(result.infEvento[0].nProt, '')
  })

  it('dois eventos -> array path (infEvento com 2 elementos)', function () {
    const result = RecepcaoHelper.montarResponse(EVT_DUPLO)

    assert.strictEqual(result.infEvento.length, 2)
    assert.strictEqual(result.infEvento[0].cStat, '135')
    assert.strictEqual(result.infEvento[1].cStat, '573')
  })

  it('sentinela <error> -> propaga error e não lança', function () {
    const result = RecepcaoHelper.montarResponse(ERROR_SENTINEL)

    assert.strictEqual(result.error, 'unable to get local issuer certificate')
    assert.deepStrictEqual(result.infEvento, [])
    assert.strictEqual(result.cStat, '')
  })
})
