# Node MD-e

Biblioteca para consumo dos Web Services da Sefaz de Distribuição de DF-e e Evento de Manifestação do Destinatário.

## Instalação

```sh
$ npm i node-mde
```

## Pré-Requisitos

- Possuir um _Certificado A1_ válido podendo ser no formato PFX e Senha _OU_ cert.pem e key.pem

## Exemplo

### Distribuição de DF-e

```js
const { DistribuicaoDFe } = require('node-mde')
const fs = require('fs')

const pfx = fs.readFileSync('./certificado.pfx')
const passphrase = 'senha'
const cnpj = '12345678901234'
const cUFAutor = '41' //PR
const tpAmb = '2' //Produção="1"/Homologação="2"

const distribuicao = new DistribuicaoDFe({
  pfx: pfx,
  passphrase: passphrase,
  cnpj: cnpj,
  cUFAutor: cUFAutor,
  tpAmb: tpAmb,
})

/**
 * ultNSU: Último NSU recebido pelo ator.
 */
const consultaUltNSU = await distribuicao.consultaUltNSU('000000000000000')

if (consultaUltNSU.error) {
  throw new Error(consultaUltNSU.error)
}

console.log(consultaUltNSU)
// {
//   data: {
//     tpAmb: '2',
//     verAplic: '1.5.11',
//     cStat: '138',
//     xMotivo: 'Documento(s) localizado(s)',
//     dhResp: '2022-06-21T10:48:14-03:00',
//     ultNSU: '000000000000050',
//     maxNSU: '000000000000212',
//     docZip: [
//       {
//         xml: '<resNFe xmlns:xsd="http://www.w3.org/2001/XMLSchema" ... </resNFe>',
//         json: { resNFe: { ... } },
//         nsu: '000000000000049',
//         schema: 'resNFe_v1.01.xsd',
//       },
//       {
//         xml: '<nfeProc versao="4.00" xmlns="http://www.portalfiscal.inf.br/nfe"> ... </nfeProc>',
//         json: { nfeProc: { ... } },
//         nsu: '000000000000050',
//         schema: 'procNFe_v4.00.xsd',
//       },
//     ],
//   },
//   reqXml: '<?xml version="1.0" encoding="utf-8"?> ... </soap12:Body></soap12:Envelope>',
//   resXml: '<?xml version="1.0" encoding="utf-8"?> ... </soap:Body></soap:Envelope>',
//   status: 200,
// }

/**
 * chNFe: Chave de acesso específica.
 */
const consultaChNFe = await distribuicao.consultaChNFe(
  '41000000000000000000000000000000000000000039'
)

if (consultaChNFe.error) {
  throw new Error(consultaChNFe.error)
}

console.log(consultaChNFe)
// {
//   data: {
//     tpAmb: '2',
//     verAplic: '1.5.11',
//     cStat: '138',
//     xMotivo: 'Documento localizado',
//     dhResp: '2022-06-21T10:49:21-03:00',
//     ultNSU: '',
//     maxNSU: '',
//     docZip: [
//       {
//         xml: '<nfeProc versao="4.00" xmlns="http://www.portalfiscal.inf.br/nfe"> ... </nfeProc>',
//         json: { nfeProc: { ... } },
//         nsu: '000000000000050',
//         schema: 'procNFe_v4.00.xsd',
//       },
//     ],
//   },
//   reqXml: '<?xml version="1.0" encoding="utf-8"?> ... </soap12:Body></soap12:Envelope>',
//   resXml: '<?xml version="1.0" encoding="utf-8"?> ... </soap:Body></soap:Envelope>',
//   status: 200,
// }

/**
 * NSU: Número Sequencial Único.
 */
const consultaNSU = await distribuicao.consultaNSU('000000000000049')

if (consultaNSU.error) {
  throw new Error(consultaNSU.error)
}

console.log(consultaNSU)
// {
//   data: {
//     tpAmb: '2',
//     verAplic: '1.5.11',
//     cStat: '138',
//     xMotivo: 'Documento localizado',
//     dhResp: '2022-06-21T10:50:46-03:00',
//     ultNSU: '000000000000049',
//     maxNSU: '000000000000212',
//     docZip: [
//       {
//         xml: '<resNFe xmlns:xsd="http://www.w3.org/2001/XMLSchema" ... </resNFe>',
//         json: { resNFe: { ... } },
//         nsu: '000000000000049',
//         schema: 'resNFe_v1.01.xsd',
//       },
//     ],
//   },
//   reqXml: '<?xml version="1.0" encoding="utf-8"?> ... </soap12:Body></soap12:Envelope>',
//   resXml: '<?xml version="1.0" encoding="utf-8"?> ... </soap:Body></soap:Envelope>',
//   status: 200,
// }
```

### Manifestação do Destinatário

```js
const { RecepcaoEvento } = require('node-mde')
const fs = require('fs')

const pfx = fs.readFileSync('./certificado.pfx')
const passphrase = 'senha'
const cnpj = '12345678901234'
const tpAmb = '2' //Produção="1"/Homologação="2"

const recepcao = new RecepcaoEvento({
  pfx: pfx,
  passphrase: passphrase,
  cnpj: cnpj,
  tpAmb: tpAmb,
})

/**
 * chNFe: Chave de Acesso da NF-e vinculada ao Evento
 * tpEvento: Código do evento: 210200 - Confirmacao da Operacao, 210210 - Ciencia da Operacao, 210220 - Desconhecimento da Operacao, 210240 - Operacao nao Realizada
 * justificativa: Informar a justificativa porque a operação não foi realizada, este campo deve ser informado somente no evento de Operação não Realizada.
 */
const lote = [
  {
    chNFe: '41000000000000000000000000000000000000000040',
    tipoEvento: 210210,
  },
  {
    chNFe: '41000000000000000000000000000000000000000041',
    tipoEvento: 210240,
    justificativa: 'Não foi realizado a entrega correta dos itens da nota.',
  },
]

const manifestacao = await recepcao.enviarEvento({
  idLote: '1337',
  lote: lote,
})

if (manifestacao.error) {
  throw new Error(manifestacao.error)
}

console.log(manifestacao)
// {
//   data: {
//     idLote: '1337',
//     tpAmb: '2',
//     verAplic: 'AN_1.4.3',
//     cOrgao: '91',
//     cStat: '128',
//     xMotivo: 'Lote de evento processado',
//     infEvento: [
//       {
//         tpAmb: '2',
//         verAplic: 'AN_1.4.3',
//         cOrgao: '91',
//         cStat: '596',
//         xMotivo: 'Rejeicao: Evento apresentado apos o prazo permitido para o evento: [10 dias]',
//         chNFe: '41000000000000000000000000000000000000000040',
//         tpEvento: '210210',
//         xEvento: 'Ciencia da Operacao',
//         nSeqEvento: '1',
//         CNPJDest: '',
//         dhRegEvento: '2022-06-21T11:20:10-03:00',
//         nProt: ''
//       },
//       {
//         tpAmb: '2',
//         verAplic: 'AN_1.4.3',
//         cOrgao: '91',
//         cStat: '135',
//         xMotivo: 'Evento registrado e vinculado a NF-e',
//         chNFe: '41000000000000000000000000000000000000000041',
//         tpEvento: '210240',
//         xEvento: 'Operacao nao Realizada',
//         nSeqEvento: '1',
//         CNPJDest: '12345678901234',
//         dhRegEvento: '2022-06-21T11:20:10-03:00',
//         nProt: '891220000003301'
//       },
//     ],
//   },
//   reqXml: '<?xml version="1.0" encoding="utf-8"?> ... </soap12:Body></soap12:Envelope>',
//   resXml: '<?xml version="1.0" encoding="utf-8"?> ... </soap:Body></soap:Envelope>',
//   status: 200,
// }
```
