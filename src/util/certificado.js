'use strict'

const forge = require('node-forge')

class Certificado {
  /**
   *
   * @param {Buffer} pfx
   * @param {string} passphrase
   * @returns {{cert: string, key: string}}
   */
  static p12ToPem(pfx, passphrase) {
    const p12buffer = pfx.toString('base64')

    const asn = forge.asn1.fromDer(forge.util.decode64(p12buffer))
    const p12 = forge.pkcs12.pkcs12FromAsn1(asn, true, passphrase)

    const keyData = p12
      .getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag })
      [forge.pki.oids.pkcs8ShroudedKeyBag].concat(
        p12.getBags({ bagType: forge.pki.oids.keyBag })[forge.pki.oids.keyBag]
      )

    const certBags = p12
      .getBags({ bagType: forge.pki.oids.certBag })
      [forge.pki.oids.certBag].sort(
        (a, b) =>
          new Date(a.cert.validity.notAfter) -
          new Date(b.cert.validity.notAfter)
      )

    const rsaPrivateKey = forge.pki.privateKeyToAsn1(keyData[0].key)
    const privateKeyInfo = forge.pki.wrapRsaPrivateKey(rsaPrivateKey)
    const cert = forge.pki.certificateToPem(certBags[0].cert)
    const key = forge.pki.privateKeyInfoToPem(privateKeyInfo)

    return {
      cert,
      key,
    }
  }
}

module.exports = Object.freeze(Certificado)
