'use strict'

const { XMLBuilder, XMLParser } = require('fast-xml-parser')

class Xml {
  /**
   *
   * @param {string} xml
   * @returns {string}
   */
  static envelopar(xml) {
    return `<?xml version="1.0" encoding="utf-8"?><soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope"><soap12:Header/><soap12:Body>${xml}</soap12:Body></soap12:Envelope>`
  }

  /**
   *
   * @param {Object} json
   * @returns {string}
   */
  static jsonToXml(json) {
    return new XMLBuilder({
      ignoreAttributes: false,
    }).build(json)
  }

  /**
   *
   * @param {string} xml
   * @returns {Object}
   */
  static xmlToJson(xml) {
    return new XMLParser({
      attributeNamePrefix: '@_',
      textNodeName: 'value',
      ignoreAttributes: false,
      allowBooleanAttributes: false,
      parseAttributeValue: false,
      parseTagValue: false,
      trimValues: true,
    }).parse(xml)
  }
}

module.exports = Object.freeze(Xml)
