'use strict'

const assert = require('assert')
const fs = require('fs')
const { RecepcaoEvento } = require('../src')

const certificado = {
  pfx: fs.readFileSync('certs/certificado.pfx'),
  passphrase: fs.readFileSync('certs/passphrase.txt', 'utf8'),
  cert: fs.readFileSync('certs/cert.pem', 'utf8'),
  key: fs.readFileSync('certs/key.pem', 'utf8'),
}

describe('RecepcaoEvento', function () {
  describe('#constructor()', function () {
    it('Cert não informado', function () {
      const config = {}

      assert.throws(() => {
        new RecepcaoEvento(config)
      }, /^Error: Cert não informado.$/)
    })

    it('Key não informada', function () {
      const config = {
        cert: certificado.cert,
      }

      assert.throws(() => {
        new RecepcaoEvento(config)
      }, /^Error: Key não informada.$/)
    })

    it('Ambiente não informado (CERT, KEY)', function () {
      const config = {
        cert: certificado.cert,
        key: certificado.key,
      }

      assert.throws(() => {
        new RecepcaoEvento(config)
      }, /^Error: Ambiente não informado.$/)
    })

    it('Senha do Certificado não informada', function () {
      const config = {
        pfx: certificado.pfx,
      }

      assert.throws(() => {
        new RecepcaoEvento(config)
      }, /^Error: Senha do Certificado não informada.$/)
    })

    it('Ambiente não informado (PFX, PASSPHRASE)', function () {
      const config = {
        pfx: certificado.pfx,
        passphrase: certificado.passphrase,
      }

      assert.throws(() => {
        new RecepcaoEvento(config)
      }, /^Error: Ambiente não informado.$/)
    })

    it('Ambiente com valor inválido', function () {
      const config = {
        pfx: certificado.pfx,
        passphrase: certificado.passphrase,
        tpAmb: '0',
      }

      assert.throws(() => {
        new RecepcaoEvento(config)
      }, /^Error: Ambiente com valor inválido.$/)
    })

    it('CNPJ/CPF não informado', function () {
      const config = {
        pfx: certificado.pfx,
        passphrase: certificado.passphrase,
        tpAmb: '2',
      }

      assert.throws(() => {
        new RecepcaoEvento(config)
      }, /^Error: CNPJ\/CPF não informado.$/)
    })

    it('Timezone inválido (CNPJ)', function () {
      const config = {
        pfx: certificado.pfx,
        passphrase: certificado.passphrase,
        tpAmb: '2',
        cnpj: '12345678901234',
        timezone: 'America/Teste',
      }

      assert.throws(() => {
        new RecepcaoEvento(config)
      }, /^Error: Timezone inválido.$/)
    })

    it('Timezone inválido (CPF)', function () {
      const config = {
        pfx: certificado.pfx,
        passphrase: certificado.passphrase,
        tpAmb: '2',
        cpf: '12345678901',
        timezone: 'America/Teste',
      }

      assert.throws(() => {
        new RecepcaoEvento(config)
      }, /^Error: Timezone inválido.$/)
    })

    it('Objeto instanciado (CPF = "12345678901")', function () {
      const config = {
        pfx: certificado.pfx,
        passphrase: certificado.passphrase,
        tpAmb: '2',
        cpf: '12345678901',
      }

      const recepcao = new RecepcaoEvento(config)

      assert.equal(recepcao.config.cpf, '12345678901')
    })

    it('Objeto instanciado (Timezone = "America/Campo_Grande")', function () {
      const config = {
        pfx: certificado.pfx,
        passphrase: certificado.passphrase,
        tpAmb: '2',
        cnpj: '12345678901234',
        timezone: 'America/Campo_Grande',
      }

      const recepcao = new RecepcaoEvento(config)

      assert.equal(recepcao.config.timezone, 'America/Campo_Grande')
    })

    it('Objeto instanciado', function () {
      const config = {
        pfx: certificado.pfx,
        passphrase: certificado.passphrase,
        tpAmb: '2',
        cnpj: '12345678901234',
      }

      const recepcao = new RecepcaoEvento(config)

      assert.ok(recepcao.config)
      assert.ok(recepcao.enviarEvento)

      assert.equal(recepcao.config.cnpj, '12345678901234')
      assert.equal(recepcao.config.tpAmb, '2')
      assert.equal(recepcao.config.timezone, 'America/Sao_Paulo')
      assert.equal(recepcao.config.cert, certificado.cert)
      assert.equal(recepcao.config.key, certificado.key)
    })
  })

  describe('#enviarEvento()', function () {
    it('Lote não informado', async function () {
      const config = {
        pfx: certificado.pfx,
        passphrase: certificado.passphrase,
        tpAmb: '2',
        cnpj: '12345678901234',
      }

      const recepcao = new RecepcaoEvento(config)

      await assert.rejects(
        async () => {
          recepcao.enviarEvento({ idLote: '1337' })
        },
        (err) => {
          assert.strictEqual(err.message, 'Lote não informado.')
          return true
        }
      )
    })

    it('Um lote deve possuir no mínimo 1 e no máximo 20 eventos (0 Eventos)', async function () {
      const config = {
        pfx: certificado.pfx,
        passphrase: certificado.passphrase,
        tpAmb: '2',
        cnpj: '12345678901234',
      }

      const recepcao = new RecepcaoEvento(config)
      const lote = []

      await assert.rejects(
        async () => {
          recepcao.enviarEvento({ idLote: '1337', lote: lote })
        },
        (err) => {
          assert.strictEqual(
            err.message,
            'Um lote deve possuir no mínimo 1 e no máximo 20 eventos.'
          )
          return true
        }
      )
    })

    it('Um lote deve possuir no mínimo 1 e no máximo 20 eventos (30 Eventos)', async function () {
      const config = {
        pfx: certificado.pfx,
        passphrase: certificado.passphrase,
        tpAmb: '2',
        cnpj: '12345678901234',
      }

      const recepcao = new RecepcaoEvento(config)
      const lote = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3,
        4, 5, 6, 7, 8, 9, 10,
      ]

      await assert.rejects(
        async () => {
          recepcao.enviarEvento({ idLote: '1337', lote: lote })
        },
        (err) => {
          assert.strictEqual(
            err.message,
            'Um lote deve possuir no mínimo 1 e no máximo 20 eventos.'
          )
          return true
        }
      )
    })

    it('Chave da NF-e não informada', async function () {
      const config = {
        pfx: certificado.pfx,
        passphrase: certificado.passphrase,
        tpAmb: '2',
        cnpj: '12345678901234',
      }

      const recepcao = new RecepcaoEvento(config)
      const lote = [{}]

      await assert.rejects(
        async () => {
          recepcao.enviarEvento({ idLote: '1337', lote: lote })
        },
        (err) => {
          assert.strictEqual(err.message, 'Chave da NF-e não informada.')
          return true
        }
      )
    })

    it('Tipo Evento não informado', async function () {
      const config = {
        pfx: certificado.pfx,
        passphrase: certificado.passphrase,
        tpAmb: '2',
        cnpj: '12345678901234',
      }

      const recepcao = new RecepcaoEvento(config)
      const lote = [
        {
          chNFe: '41000000000000000000000000000000000000000041',
        },
      ]

      await assert.rejects(
        async () => {
          recepcao.enviarEvento({ idLote: '1337', lote: lote })
        },
        (err) => {
          assert.strictEqual(err.message, 'Tipo Evento não informado.')
          return true
        }
      )
    })

    it('Tipo Evento deve conter um dos valores: 210200, 210210, 210220 ou 210240', async function () {
      const config = {
        pfx: certificado.pfx,
        passphrase: certificado.passphrase,
        tpAmb: '2',
        cnpj: '12345678901234',
      }

      const recepcao = new RecepcaoEvento(config)
      const lote = [
        {
          chNFe: '41000000000000000000000000000000000000000041',
          tipoEvento: 999999,
        },
      ]

      await assert.rejects(
        async () => {
          recepcao.enviarEvento({ idLote: '1337', lote: lote })
        },
        (err) => {
          assert.strictEqual(
            err.message,
            'Tipo Evento deve conter um dos valores: 210200, 210210, 210220 ou 210240'
          )
          return true
        }
      )
    })

    it('Justificativa não informada', async function () {
      const config = {
        pfx: certificado.pfx,
        passphrase: certificado.passphrase,
        tpAmb: '2',
        cnpj: '12345678901234',
      }

      const recepcao = new RecepcaoEvento(config)
      const lote = [
        {
          chNFe: '41000000000000000000000000000000000000000041',
          tipoEvento: 210240,
        },
      ]

      await assert.rejects(
        async () => {
          recepcao.enviarEvento({ idLote: '1337', lote: lote })
        },
        (err) => {
          assert.strictEqual(err.message, 'Justificativa não informada.')
          return true
        }
      )
    })

    it('Justificativa com tamanho incorreto', async function () {
      const config = {
        pfx: certificado.pfx,
        passphrase: certificado.passphrase,
        tpAmb: '2',
        cnpj: '12345678901234',
      }

      const recepcao = new RecepcaoEvento(config)
      const lote = [
        {
          chNFe: '41000000000000000000000000000000000000000041',
          tipoEvento: 210240,
          justificativa: 'TESTE.',
        },
      ]

      await assert.rejects(
        async () => {
          recepcao.enviarEvento({ idLote: '1337', lote: lote })
        },
        (err) => {
          assert.strictEqual(
            err.message,
            'Justificativa com tamanho incorreto.'
          )
          return true
        }
      )
    })
  })
})
