# Node MD-e

[![npm version](https://img.shields.io/npm/v/node-mde.svg)](https://www.npmjs.com/package/node-mde)
[![npm downloads](https://img.shields.io/npm/dt/node-mde.svg)](https://npm-stat.com/charts.html?package=node-mde)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/lucashpmelo/node-mde/blob/main/LICENSE)
[![Package Quality](https://packagequality.com/shield/node-mde.svg)](https://packagequality.com/#?package=node-mde)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=lucashpmelo_node-mde&metric=alert_status)](https://sonarcloud.io/dashboard?id=lucashpmelo_node-mde)
[![Known Vulnerabilities](https://snyk.io/test/npm/node-mde/badge.svg)](https://snyk.io/test/npm/node-mde)

Biblioteca para consumo dos Web Services da Sefaz de Distribuição de DF-e e Evento de Manifestação do Destinatário.

Essa biblioteca permite consultar a relação das notas fiscais emitidas contra um determinado CNPJ/CPF e realizar o envio do evento de manifestação, podendo assim, baixar o XML da NF-e.

## Índice

1. [Instação](#Instação)
2. [Pré-Requisitos](#Pré-Requisitos)
3. [Funcionalidades](#Funcionalidades)
4. [Distribuição de NF-e](#distribuição-de-nf-e)
   1. [Construtor](#Construtor)
   2. [Consulta por ultNSU](#consulta-por-nsu)
   3. [Consulta por chNFe](#consulta-por-chnfe)
   4. [Consulta por NSU](#consulta-por-nsu)
5. [Distribuição de CT-e](#distribuição-de-ct-e)
   1. [Construtor](#construtor-1)
   2. [Consulta por ultNSU](#consulta-por-ultnsu-1)
   3. [Consulta por chCTe](#consulta-por-chcte)
   4. [Consulta por NSU](#consulta-por-nsu-1)
6. [Manifestação do Destinatário](#manifestação-do-destinatário)
   1. [Construtor](#construtor-2)
   2. [Enviar Lote de Eventos](#enviar-lote-de-eventos)
7. [Tabelas](#tabelas)
   1. [Códigos UF](#códigos-uf)
   2. [Lista de Timezones](#lista-de-timezones)

## Instalação

```sh
$ npm i node-mde
```

## Pré-Requisitos

- Possuir um **Certificado A1** válido emitido por uma Autoridade Certificadora credenciada pela Infraestrutura de Chaves Públicas Brasileira – **ICP-Brasil**.
- O certificado pode ser usando no formato **PFX** e **Senha** _OU_ **cert.pem** e **key.pem**

## Funcionalidades

- Consultar por último NSU
  - Retorna a relação dos Documentos Fiscais (`Resumo da NF-e`, `NF-e`, `Resumo do Evento` ou `Evento`)
- Consultar por chave de acesso
  - Retorna o `XML da NF-e` ou o `Resumo da NF-e`
- Consultar por NSU
  - Retorna o Documento Fiscal referente ao NSU informado, podendo ser um `Resumo`, uma `NF-e` ou um `Evento`
- Envio de evento
  - Registra o evento de manifestação na nota informada (`Confirmação da Operação`, `Ciência da Operação`, `Desconhecimento da Operação` ou `Operação não Realizada`)

## Distribuição de NF-e

### Construtor

```js
new DistribuicaoNFe(config)
```

- `config` `<Object>`
  - `pfx` `<Buffer>` - [OPCIONAL] - Arquivo **.pfx**. Se o `pfx` não for informado, as propriedades `cert` e `key` passam a ser obrigatórias.
  - `passphrase` `<String>` - [OPCIONAL] - Senha do arquivo **.pfx**.
  - `cert` `<Buffer | String>` - [OPCIONAL] - Conteúdo do _cert.pem_. Essa propriedade fica obrigatória se o `pfx` não for informado.
  - `key` `<Buffer | String>` - [OPCIONAL] - Conteúdo do _key.pem_. Essa propriedade fica obrigatória se o `pfx` não for informado.
  - `cUFAutor` `<String>` - [OBRIGATÓRIO] - Código da UF do autor. Consulte a tabela [códigos UF](#códigos-uf).
  - `cnpj` `<String>` - [OPCIONAL] - CNPJ do interessado no DF-e. Se não informado um CNPJ, será obrigatório informar um CPF.
  - `cpf` `<String>` - [OPCIONAL] - CPF do interessado no DF-e. Se não informado um CPF, será obrigatório informar um CNPJ.
  - `tpAmb` `<String>` - [OBRIGATÓRIO] - Identificação de Ambiente. Informar `'1'` para **Produção** ou `'2'` para **Homologação**.
  - `options` `<Object>` - [OPCIONAL]
    - `requestOptions` `<AxiosRequestConfig>` - [OPCIONAL]
    - `httpsOptions` `<AgentOptions>` - [OPCIONAL]

### Consulta por ultNSU

| Campo    |   Tipo   | Tamanho | Descrição                      |
| :------- | :------: | :-----: | :----------------------------- |
| `ultNSU` | _string_ |  1-15   | Último NSU recebido pelo ator. |

#### Exemplo

```js
const { DistribuicaoNFe } = require('node-mde')
const fs = require('fs')

const distribuicao = new DistribuicaoNFe({
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
const { DistribuicaoNFe } = require('node-mde')
const fs = require('fs')

const distribuicao = new DistribuicaoNFe({
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
const { DistribuicaoNFe } = require('node-mde')
const fs = require('fs')

const distribuicao = new DistribuicaoNFe({
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

## Distribuição de CT-e

### Construtor

```js
new DistribuicaoCTe(config)
```

- `config` `<Object>`
  - `pfx` `<Buffer>` - [OPCIONAL] - Arquivo **.pfx**. Se o `pfx` não for informado, as propriedades `cert` e `key` passam a ser obrigatórias.
  - `passphrase` `<String>` - [OPCIONAL] - Senha do arquivo **.pfx**.
  - `cert` `<Buffer | String>` - [OPCIONAL] - Conteúdo do _cert.pem_. Essa propriedade fica obrigatória se o `pfx` não for informado.
  - `key` `<Buffer | String>` - [OPCIONAL] - Conteúdo do _key.pem_. Essa propriedade fica obrigatória se o `pfx` não for informado.
  - `cUFAutor` `<String>` - [OBRIGATÓRIO] - Código da UF do autor. Consulte a tabela [códigos UF](#códigos-uf).
  - `cnpj` `<String>` - [OPCIONAL] - CNPJ do interessado no DF-e. Se não informado um CNPJ, será obrigatório informar um CPF.
  - `cpf` `<String>` - [OPCIONAL] - CPF do interessado no DF-e. Se não informado um CPF, será obrigatório informar um CNPJ.
  - `tpAmb` `<String>` - [OBRIGATÓRIO] - Identificação de Ambiente. Informar `'1'` para **Produção** ou `'2'` para **Homologação**.
  - `options` `<Object>` - [OPCIONAL]
    - `requestOptions` `<AxiosRequestConfig>` - [OPCIONAL]
    - `httpsOptions` `<AgentOptions>` - [OPCIONAL]

### Consulta por ultNSU

| Campo    |   Tipo   | Tamanho | Descrição                      |
| :------- | :------: | :-----: | :----------------------------- |
| `ultNSU` | _string_ |  1-15   | Último NSU recebido pelo ator. |

#### Exemplo

```js
const { DistribuicaoCTe } = require('node-mde')
const fs = require('fs')

const distribuicao = new DistribuicaoCTe({
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
//   "data": {
//     "tpAmb": "1",
//     "verAplic": "2.0.5_2408061805",
//     "cStat": "138",
//     "xMotivo": "documento localizado.",
//     "dhResp": "2024-08-06T18:05:09",
//     "ultNSU": "000000000002211",
//     "maxNSU": "000000000002244",
//     "docZip": [
//       {
//         "xml": "<cteProc versao=\"4.00\" ... </cteProc>",
//         "json": { "cteProc": { ... }},
//         "nsu": "000000000000001",
//         "schema": "procCTe_v4.00.xsd"
//       },
//       {
//         "xml": "<procEventoCTe versao=\"4.00\" ... </procEventoCTe>",
//         "json": { "procEventoCTe": { ... }},
//         "nsu": "00000000000002",
//         "schema": "procEventoCTe_v4.00.xsd"
//       }
//     ]
//   },
//   "status": 200,
//   "reqXml": "<soap:Envelope ... </soap:Envelope>",
//   "resXml": "<?xml version=\"1.0\" encoding=\"utf-8\"?><soap:Envelope ... </soap:Envelope>"
// }
```

### Consulta por chCTe

| Campo   |   Tipo   | Tamanho | Descrição                   |
| :------ | :------: | :-----: | :-------------------------- |
| `chCTe` | _string_ |   44    | Chave de acesso específica. |

#### Exemplo

```js
const { DistribuicaoCTe } = require('node-mde')
const fs = require('fs')

const distribuicao = new DistribuicaoCTe({
  pfx: fs.readFileSync('./certificado.pfx'),
  passphrase: 'senha',
  cnpj: '12345678901234',
  cUFAutor: '41',
  tpAmb: '2',
})

const consulta = await distribuicao.consultaChCTe(
  '41000000000000000000000000000000000000000039'
)

if (consulta.error) {
  throw new Error(consulta.error)
}

console.log(consulta)
// {
//   "data": {
//     "tpAmb": "1",
//     "verAplic": "2.0.5_2408061805",
//     "cStat": "138",
//     "xMotivo": "documento localizado.",
//     "dhResp": "2024-08-06T18:05:09",
//     "ultNSU": "000000000002211",
//     "maxNSU": "000000000002244",
//     "docZip": [
//       {
//         "xml": "<cteProc versao=\"4.00\" ... </cteProc>",
//         "json": { "cteProc": { ... }},
//         "nsu": "000000000000001",
//         "schema": "procCTe_v4.00.xsd"
//       }
//     ]
//   },
//   "status": 200,
//   "reqXml": "<soap:Envelope ... </soap:Envelope>",
//   "resXml": "<?xml version=\"1.0\" encoding=\"utf-8\"?><soap:Envelope ... </soap:Envelope>"
// }
```

### Consulta por NSU

| Campo |   Tipo   | Tamanho | Descrição                           |
| :---- | :------: | :-----: | :---------------------------------- |
| `NSU` | _string_ |  1-15   | Número Sequencial Único específico. |

#### Exemplo

```js
const { DistribuicaoCTe } = require('node-mde')
const fs = require('fs')

const distribuicao = new DistribuicaoCTe({
  pfx: fs.readFileSync('./certificado.pfx'),
  passphrase: 'senha',
  cnpj: '12345678901234',
  cUFAutor: '41',
  tpAmb: '2',
})

const consulta = await distribuicao.consultaNSU('000000000000001')

if (consulta.error) {
  throw new Error(consulta.error)
}

console.log(consulta)
// {
//   "data": {
//     "tpAmb": "1",
//     "verAplic": "2.0.5_2408061805",
//     "cStat": "138",
//     "xMotivo": "documento localizado.",
//     "dhResp": "2024-08-06T18:05:09",
//     "ultNSU": "000000000002211",
//     "maxNSU": "000000000002244",
//     "docZip": [
//       {
//         "xml": "<cteProc versao=\"4.00\" ... </cteProc>",
//         "json": { "cteProc": { ... }},
//         "nsu": "000000000000001",
//         "schema": "procCTe_v4.00.xsd"
//       }
//     ]
//   },
//   "status": 200,
//   "reqXml": "<soap:Envelope ... </soap:Envelope>",
//   "resXml": "<?xml version=\"1.0\" encoding=\"utf-8\"?><soap:Envelope ... </soap:Envelope>"
// }
```

## Manifestação do Destinatário (NF-e)

### Construtor

```js
new RecepcaoEvento(config)
```

- `config` `<Object>`
  - `pfx` `<Buffer>` - [OPCIONAL] - Arquivo **.pfx**. Se o `pfx` não for informado, as propriedades `cert` e `key` passam a ser obrigatórias.
  - `passphrase` `<String>` - [OPCIONAL] - Senha do arquivo **.pfx**.
  - `cert` `<Buffer | String>` - [OPCIONAL] - Conteúdo do _cert.pem_. Essa propriedade fica obrigatória se o `pfx` não for informado.
  - `key` `<Buffer | String>` - [OPCIONAL] - Conteúdo do _key.pem_. Essa propriedade fica obrigatória se o `pfx` não for informado.
  - `cnpj` `<String>` - [OPCIONAL] - CNPJ do interessado no DF-e. Se não informado um CNPJ, será obrigatório informar um CPF.
  - `cpf` `<String>` - [OPCIONAL] - CPF do interessado no DF-e. Se não informado um CPF, será obrigatório informar um CNPJ.
  - `tpAmb` `<String>` - [OBRIGATÓRIO] - Identificação de Ambiente. Informar `'1'` para **Produção** ou `'2'` para **Homologação**.
  - `timezone` `<String>` - [OPCIONAL] - Fuso horário do autor. É utilizado `'America/Sao_Paulo'` como valor padrão. Consulte a tabela [lista de timezones](#lista-de-timezones) válidos para o Brasil.
  - `options` `<Object>` - [OPCIONAL]
    - `requestOptions` `<AxiosRequestConfig>` - [OPCIONAL]
    - `httpsOptions` `<AgentOptions>` - [OPCIONAL]

### Enviar Lote de Eventos

| Campo                |   Tipo   | Tamanho | Descrição                                                                                                                                                |
| :------------------- | :------: | :-----: | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `idLote`             | _string_ |  1-15   | Identificador de controle do Lote de envio do Evento.                                                                                                    |
| `lote`               | _array_  |  1-20   | Lista de eventos para manifestação.                                                                                                                      |
| `lote.chNFe`         | _string_ |   44    | Chave de Acesso da NF-e vinculada ao Evento.                                                                                                             |
| `lote.tpEvento`      | _number_ |    6    | Código do evento: 210200 - Confirmacao da Operacao; 210210 - Ciencia da Operacao; 210220 - Desconhecimento da Operacao; 210240 - Operacao nao Realizada. |
| `lote.justificativa` | _string_ | 15-255  | Informar a justificativa do porque a operação não foi realizada, este campo deve ser informado somente no evento de Operação não Realizada.              |

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

## Tabelas

### Códigos UF

|  UF  | cUF  | Estado                  |
| :--: | :--: | :---------------------- |
| `RO` | _11_ | **Rondônia**            |
| `AC` | _12_ | **Acre**                |
| `AM` | _13_ | **Amazonas**            |
| `RR` | _14_ | **Roraima**             |
| `PA` | _15_ | **Pará**                |
| `AP` | _16_ | **Amapá**               |
| `TO` | _17_ | **Tocantins**           |
| `MA` | _21_ | **Maranhão**            |
| `PI` | _22_ | **Piauí**               |
| `CE` | _23_ | **Ceará**               |
| `RN` | _24_ | **Rio Grande do Norte** |
| `PB` | _25_ | **Paraíba**             |
| `PE` | _26_ | **Pernambuco**          |
| `AL` | _27_ | **Alagoas**             |
| `SE` | _28_ | **Sergipe**             |
| `BA` | _29_ | **Bahia**               |
| `MG` | _31_ | **Minas Gerais**        |
| `ES` | _32_ | **Espírito Santo**      |
| `RJ` | _33_ | **Rio de Janeiro**      |
| `SP` | _35_ | **São Paulo**           |
| `PR` | _41_ | **Paraná**              |
| `SC` | _42_ | **Santa Catarina**      |
| `RS` | _43_ | **Rio Grande do Sul**   |
| `MS` | _50_ | **Mato Grosso do Sul**  |
| `MT` | _51_ | **Mato Grosso**         |
| `GO` | _52_ | **Goiás**               |
| `DF` | _53_ | **Distrito Federal**    |

### Lista de Timezones

|        timezone        | Estado                                 |   UTC    |
| :--------------------: | :------------------------------------- | :------: |
|   `America/Noronha`    | **Fernando de Noronha**                | _−02:00_ |
|  `America/Araguaina`   | **TO**                                 | _−03:00_ |
|    `America/Bahia`     | **BA**                                 | _−03:00_ |
|    `America/Belem`     | **AP, PA (leste)**                     | _−03:00_ |
|  `America/Fortaleza`   | **CE, MA, PB, PI, RN**                 | _−03:00_ |
|    `America/Maceio`    | **AL, SE**                             | _−03:00_ |
|    `America/Recife`    | **PE**                                 | _−03:00_ |
|   `America/Santarem`   | **PA (oeste)**                         | _−03:00_ |
|  `America/Sao_Paulo`   | **DF, ES, GO, MG, PR, RJ, RS, SC, SP** | _−03:00_ |
|  `America/Boa_Vista`   | **RR**                                 | _−04:00_ |
| `America/Campo_Grande` | **MS**                                 | _−04:00_ |
|    `America/Cuiaba`    | **MT**                                 | _−04:00_ |
|    `America/Manaus`    | **AM (leste)**                         | _−04:00_ |
| `America/Porto_Velho`  | **RO**                                 | _−04:00_ |
|   `America/Eirunepe`   | **AM (oeste)**                         | _−05:00_ |
|  `America/Rio_Branco`  | **AC**                                 | _−05:00_ |
