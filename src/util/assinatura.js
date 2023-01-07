'use strict'

const SignedXml = require('xml-crypto').SignedXml

class InfoProvider {
  /**
   *
   * @param {string} cert
   */
  constructor(cert) {
    this.getKeyInfo = function () {
      return `<X509Data><X509Certificate>${cert
        .split('-----')[2]
        .replace(/[\r\n]/g, '')}</X509Certificate></X509Data>`
    }
  }
}

class Assinatura {
  /**
   *
   * @param {string} cert
   * @param {string} key
   * @param {string} xml
   * @returns {string}
   */
  static assinarXml(cert, key, xml) {
    const xpath = "//*[local-name(.)='infEvento']"
    const transforms = [
      'http://www.w3.org/2000/09/xmldsig#enveloped-signature',
      'http://www.w3.org/TR/2001/REC-xml-c14n-20010315',
    ]
    const sig = new SignedXml()

    sig.keyInfoProvider = new InfoProvider(cert)

    sig.addReference(xpath, transforms)
    sig.canonicalizationAlgorithm = transforms[1]
    sig.signingKey = key

    sig.computeSignature(xml, {
      location: {
        reference: xpath,
        action: 'after',
      },
    })

    return sig.getSignedXml()
  }
}

module.exports = Object.freeze(Assinatura)
