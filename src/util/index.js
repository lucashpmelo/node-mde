"use strict"

const { XMLBuilder, XMLParser } = require("fast-xml-parser")
const forge = require("node-forge")
const xmlCrypto = require("xml-crypto")
const zlib = require("zlib")

exports.zeroPad = (num, places) => {
  let zero = places - num.toString().length + 1
  return Array(+(zero > 0 && zero)).join("0") + num
}

exports.enveloparXml = (xml) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <soap12:Envelope xmlns:soap12="http://www.w3.org/2003/05/soap-envelope" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        <soap12:Header/>
        <soap12:Body>
            ${xml}
        </soap12:Body>
    </soap12:Envelope>`
}

exports.unzip = async (data) => {
  const buf = new Buffer.from(data, "base64")
  return await new Promise((resolve, reject) => {
    zlib.unzip(buf, function (err, buffer) {
      if (err) reject(err)
      const content = buffer.toString("utf8")
      resolve(content)
    })
  })
}

exports.json2xml = (json) => {
  return new XMLBuilder({
    ignoreAttributes: false,
  }).build(json)
}

exports.xml2json = (xml) => {
  return new XMLParser({
    attributeNamePrefix: "@_",
    textNodeName: "value",
    ignoreAttributes: false,
    allowBooleanAttributes: false,
    parseAttributeValue: false,
    parseTagValue: false,
    trimValues: true,
  }).parse(xml)
}

function _MyKeyInfo(cert) {
  this.getKeyInfo = function () {
    return `<X509Data><X509Certificate>${cert
      .split("-----")[2]
      .replace(/[\r\n]/g, "")}</X509Certificate></X509Data>`
  }
}

exports.assinaturaXml = (cert, key, xml) => {
  const sig = new xmlCrypto.SignedXml()
  sig.keyInfoProvider = new _MyKeyInfo(cert)
  sig.addReference("//*[local-name(.)='infEvento']", [
    "http://www.w3.org/2000/09/xmldsig#enveloped-signature",
    "http://www.w3.org/TR/2001/REC-xml-c14n-20010315",
  ])
  sig.canonicalizationAlgorithm =
    "http://www.w3.org/TR/2001/REC-xml-c14n-20010315"
  sig.signingKey = key
  sig.computeSignature(xml, {
    location: {
      reference: "//*[local-name(.)='infEvento']",
      action: "after",
    },
  })
  return sig.getSignedXml()
}

exports.convertPFX = (pfx, passphrase) => {
  const p12buffer = pfx.toString("base64")

  const asn = forge.asn1.fromDer(forge.util.decode64(p12buffer))
  const p12 = forge.pkcs12.pkcs12FromAsn1(asn, true, passphrase)

  const keyData = p12
    .getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag })
    [forge.pki.oids.pkcs8ShroudedKeyBag].concat(
      p12.getBags({ bagType: forge.pki.oids.keyBag })[forge.pki.oids.keyBag]
    )

  const certBags = p12.getBags({ bagType: forge.pki.oids.certBag })[
    forge.pki.oids.certBag
  ]

  const rsaPrivateKey = forge.pki.privateKeyToAsn1(keyData[0].key)
  const privateKeyInfo = forge.pki.wrapRsaPrivateKey(rsaPrivateKey)
  const cert = forge.pki.certificateToPem(certBags[0].cert)
  const key = forge.pki.privateKeyInfoToPem(privateKeyInfo)

  return {
    cert,
    key,
  }
}
