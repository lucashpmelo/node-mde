# Node MD-e

Biblioteca para consumo dos Web Services da Sefaz de Distribuição de DF-e e Evento de Manifestação do Destinatário.

## Instalação

```sh
$ npm i node-mde
```

## Pré-Requisitos

- Possuir um **Certificado A1** válido emitido por uma Autoridade Certificadora credenciada pela Infraestrutura de Chaves Públicas Brasileira – **ICP-Brasil**.
- O certificado pode ser usando no formato **PFX** e **Senha** _OU_ **cert.pem** e **key.pem**

## Distribuição de DF-e

### Consulta por ultNSU

| Campo    |   Tipo   | Tamanho | Descrição                      |
| :------- | :------: | :-----: | :----------------------------- |
| `ultNSU` | _string_ |  1-15   | Último NSU recebido pelo ator. |

#### Exemplo

```js
const { DistribuicaoDFe } = require('node-mde')
const fs = require('fs')

const distribuicao = new DistribuicaoDFe({
  pfx: fs.readFileSync('./certificado.pfx'),
  passphrase: 'senha',
  cnpj: '12345678901234',
  cUFAutor: '41',
  tpAmb: '2',
})

const consulta = await distribuicao.consultaUltNSU('000000000000000')

if (consulta.error) {
  throw new Error(consulta.error)
}

console.log(consulta)
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
```

### Consulta por chNFe

| Campo   |   Tipo   | Tamanho | Descrição                   |
| :------ | :------: | :-----: | :-------------------------- |
| `chNFe` | _string_ |   44    | Chave de acesso específica. |

#### Exemplo

```js
const { DistribuicaoDFe } = require('node-mde')
const fs = require('fs')

const distribuicao = new DistribuicaoDFe({
  pfx: fs.readFileSync('./certificado.pfx'),
  passphrase: 'senha',
  cnpj: '12345678901234',
  cUFAutor: '41',
  tpAmb: '2',
})

const consulta = await distribuicao.consultaChNFe(
  '41000000000000000000000000000000000000000039'
)

if (consulta.error) {
  throw new Error(consulta.error)
}

console.log(consulta)
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
```

### Consulta por NSU

| Campo |   Tipo   | Tamanho | Descrição                           |
| :---- | :------: | :-----: | :---------------------------------- |
| `NSU` | _string_ |  1-15   | Número Sequencial Único específico. |

#### Exemplo

```js
const { DistribuicaoDFe } = require('node-mde')
const fs = require('fs')

const distribuicao = new DistribuicaoDFe({
  pfx: fs.readFileSync('./certificado.pfx'),
  passphrase: 'senha',
  cnpj: '12345678901234',
  cUFAutor: '41',
  tpAmb: '2',
})

const consulta = await distribuicao.consultaNSU('000000000000049')

if (consulta.error) {
  throw new Error(consulta.error)
}

console.log(consulta)
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

## Manifestação do Destinatário

| Campo                |   Tipo   | Tamanho | Descrição                                                                                                                                                |
| :------------------- | :------: | :-----: | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `idLote`             | _string_ |  1-15   | Identificador de controle do Lote de envio do Evento.                                                                                                    |
| `lote`               | _array_  |  1-20   | Lista de eventos para manifestação.                                                                                                                      |
| `lote.chNFe`         | _string_ |   44    | Chave de Acesso da NF-e vinculada ao Evento.                                                                                                             |
| `lote.tpEvento`      | _number_ |    6    | Código do evento: 210200 - Confirmacao da Operacao; 210210 - Ciencia da Operacao; 210220 - Desconhecimento da Operacao; 210240 - Operacao nao Realizada. |
| `lote.justificativa` | _string_ | 15-255  | Informar a justificativa porque a operação não foi realizada, este campo deve ser informado somente no evento de Operação não Realizada.                 |

#### Exemplo

```js
const { RecepcaoEvento } = require('node-mde')
const fs = require('fs')

const recepcao = new RecepcaoEvento({
  pfx: fs.readFileSync('./certificado.pfx'),
  passphrase: 'senha',
  cnpj: '12345678901234',
  tpAmb: '2',
})

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
