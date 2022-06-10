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
const { DistribuicaoDFe } = require("node-mde")
const fs = require("fs")

const pfx = fs.readFileSync("./certificado.pfx")
const passphrase = "senha"
const cnpj = "12345678901234"
const cUFAutor = "41" //PR
const tpAmb = "2" //Produção="1"/Homologação="2"

const distribuicao = new DistribuicaoDFe({
  pfx: pfx,
  passphrase: passphrase,
  cnpj: cnpj,
  cUFAutor: cUFAutor,
  tpAmb: tpAmb,
})

const retorno = await distribuicao.consultaUltNSU("000000000000000")

if (retorno.data.error) {
  throw new Error(retorno.data.error)
}

console.log(retorno.data)
console.log(retorno.xml)
```

### Manifestação do Destinatário

```js
const { RecepcaoEvento } = require("node-mde")
const fs = require("fs")

const pfx = fs.readFileSync("./certificado.pfx")
const passphrase = "senha"
const cnpj = "12345678901234"
const tpAmb = "2" //Produção="1"/Homologação="2"

const recepcao = new RecepcaoEvento({
  pfx: pfx,
  passphrase: passphrase,
  cnpj: cnpj,
  tpAmb: tpAmb,
})

const retorno = await recepcao.enviarEvento({
  chNFe: "41000000000000000000000000000000000000000040",
  tipoEvento: 210210,
})

if (retorno.data.error) {
  throw new Error(retorno.data.error)
}

console.log(retorno.data)
console.log(retorno.xml)
```
