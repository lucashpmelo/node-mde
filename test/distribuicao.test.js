'use strict'

const assert = require('assert')
const fs = require('fs')
const { DistribuicaoDFe } = require('../src')

const certificado = {
  pfx: fs.readFileSync('certs/certificado.pfx'),
  passphrase: fs.readFileSync('certs/passphrase.txt', 'utf8'),
  cert: fs.readFileSync('certs/cert.pem', 'utf8'),
  key: fs.readFileSync('certs/key.pem', 'utf8'),
}

describe('DistribuicaoDFe', function () {
  describe('#constructor()', function () {
    it('Cert não informado', function () {
      const config = {}

      assert.throws(() => {
        new DistribuicaoDFe(config)
      }, /^Error: Cert não informado.$/)
    })

    it('Key não informada', function () {
      const config = {
        cert: certificado.cert,
      }

      assert.throws(() => {
        new DistribuicaoDFe(config)
      }, /^Error: Key não informada.$/)
    })

    it('Ambiente não informado (CERT, KEY)', function () {
      const config = {
        cert: certificado.cert,
        key: certificado.key,
      }

      assert.throws(() => {
        new DistribuicaoDFe(config)
      }, /^Error: Ambiente não informado.$/)
    })

    it('Senha do Certificado não informada', function () {
      const config = {
        pfx: certificado.pfx,
      }

      assert.throws(() => {
        new DistribuicaoDFe(config)
      }, /^Error: Senha do Certificado não informada.$/)
    })

    it('Ambiente não informado (PFX, PASSPHRASE)', function () {
      const config = {
        pfx: certificado.pfx,
        passphrase: certificado.passphrase,
      }

      assert.throws(() => {
        new DistribuicaoDFe(config)
      }, /^Error: Ambiente não informado.$/)
    })

    it('Ambiente com valor inválido', function () {
      const config = {
        pfx: certificado.pfx,
        passphrase: certificado.passphrase,
        tpAmb: '0',
      }

      assert.throws(() => {
        new DistribuicaoDFe(config)
      }, /^Error: Ambiente com valor inválido.$/)
    })

    it('CNPJ/CPF não informado', function () {
      const config = {
        pfx: certificado.pfx,
        passphrase: certificado.passphrase,
        tpAmb: '2',
      }

      assert.throws(() => {
        new DistribuicaoDFe(config)
      }, /^Error: CNPJ\/CPF não informado.$/)
    })

    it('Código UF do Autor não informado (CNPJ)', function () {
      const config = {
        pfx: certificado.pfx,
        passphrase: certificado.passphrase,
        tpAmb: '2',
        cnpj: '12345678901234',
      }

      assert.throws(() => {
        new DistribuicaoDFe(config)
      }, /^Error: Código UF do Autor não informado.$/)
    })

    it('Código UF do Autor não informado (CPF)', function () {
      const config = {
        pfx: certificado.pfx,
        passphrase: certificado.passphrase,
        tpAmb: '2',
        cpf: '12345678901',
      }

      assert.throws(() => {
        new DistribuicaoDFe(config)
      }, /^Error: Código UF do Autor não informado.$/)
    })

    it('Código UF inválido', function () {
      const config = {
        pfx: certificado.pfx,
        passphrase: certificado.passphrase,
        tpAmb: '2',
        cnpj: '12345678901234',
        cUFAutor: '99',
      }

      assert.throws(() => {
        new DistribuicaoDFe(config)
      }, /^Error: Código UF inválido.$/)
    })

    it('Objeto instanciado (CPF = "12345678901")', function () {
      const config = {
        pfx: certificado.pfx,
        passphrase: certificado.passphrase,
        tpAmb: '2',
        cpf: '12345678901',
        cUFAutor: '41',
      }

      const distribuicao = new DistribuicaoDFe(config)

      assert.equal(distribuicao.config.cpf, '12345678901')
    })

    it('Objeto instanciado', function () {
      const config = {
        pfx: certificado.pfx,
        passphrase: certificado.passphrase,
        tpAmb: '2',
        cnpj: '12345678901234',
        cUFAutor: '41',
      }

      const distribuicao = new DistribuicaoDFe(config)

      assert.ok(distribuicao.config)
      assert.ok(distribuicao.consultaChNFe)
      assert.ok(distribuicao.consultaNSU)
      assert.ok(distribuicao.consultaUltNSU)

      assert.equal(distribuicao.config.cnpj, '12345678901234')
      assert.equal(distribuicao.config.tpAmb, '2')
      assert.equal(distribuicao.config.cUFAutor, '41')
      assert.equal(distribuicao.config.cert, certificado.cert)
      assert.equal(distribuicao.config.key, certificado.key)
    })
  })

  describe('#consultaChNFe()', function () {
    it('Chave da NF-e não informada', async function () {
      const config = {
        pfx: certificado.pfx,
        passphrase: certificado.passphrase,
        tpAmb: '2',
        cnpj: '12345678901234',
        cUFAutor: '41',
      }

      const distribuicao = new DistribuicaoDFe(config)

      await assert.rejects(
        async () => {
          distribuicao.consultaChNFe()
        },
        (err) => {
          assert.strictEqual(err.message, 'Chave da NF-e não informada.')
          return true
        }
      )
    })

    it('Chave da NF-e com tamanho incorreto', async function () {
      const config = {
        pfx: certificado.pfx,
        passphrase: certificado.passphrase,
        tpAmb: '2',
        cnpj: '12345678901234',
        cUFAutor: '41',
      }

      const distribuicao = new DistribuicaoDFe(config)

      await assert.rejects(
        async () => {
          distribuicao.consultaChNFe('41')
        },
        (err) => {
          assert.strictEqual(
            err.message,
            'Chave da NF-e com tamanho incorreto.'
          )
          return true
        }
      )
    })
  })

  describe('#consultaNSU()', function () {
    it('NSU não informado', async function () {
      const config = {
        pfx: certificado.pfx,
        passphrase: certificado.passphrase,
        tpAmb: '2',
        cnpj: '12345678901234',
        cUFAutor: '41',
      }

      const distribuicao = new DistribuicaoDFe(config)

      await assert.rejects(
        async () => {
          distribuicao.consultaNSU()
        },
        (err) => {
          assert.strictEqual(err.message, 'NSU não informado.')
          return true
        }
      )
    })

    it('NSU com tamanho incorreto', async function () {
      const config = {
        pfx: certificado.pfx,
        passphrase: certificado.passphrase,
        tpAmb: '2',
        cnpj: '12345678901234',
        cUFAutor: '41',
      }

      const distribuicao = new DistribuicaoDFe(config)

      await assert.rejects(
        async () => {
          distribuicao.consultaNSU('12345678901234567890')
        },
        (err) => {
          assert.strictEqual(err.message, 'NSU com tamanho incorreto.')
          return true
        }
      )
    })
  })

  describe('#consultaUltNSU()', function () {
    it('NSU não informado', async function () {
      const config = {
        pfx: certificado.pfx,
        passphrase: certificado.passphrase,
        tpAmb: '2',
        cnpj: '12345678901234',
        cUFAutor: '41',
      }

      const distribuicao = new DistribuicaoDFe(config)

      await assert.rejects(
        async () => {
          distribuicao.consultaUltNSU()
        },
        (err) => {
          assert.strictEqual(err.message, 'NSU não informado.')
          return true
        }
      )
    })

    it('NSU com tamanho incorreto', async function () {
      const config = {
        pfx: certificado.pfx,
        passphrase: certificado.passphrase,
        tpAmb: '2',
        cnpj: '12345678901234',
        cUFAutor: '41',
      }

      const distribuicao = new DistribuicaoDFe(config)

      await assert.rejects(
        async () => {
          distribuicao.consultaUltNSU('12345678901234567890')
        },
        (err) => {
          assert.strictEqual(err.message, 'NSU com tamanho incorreto.')
          return true
        }
      )
    })
  })
})
