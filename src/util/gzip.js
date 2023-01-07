'use strict'

const zlib = require('zlib')

class Gzip {
  /**
   *
   * @param {string} str
   * @returns {Promise<string>}
   */
  static unzip(str) {
    const buf = Buffer.from(str, 'base64')
    return new Promise((resolve, reject) => {
      zlib.unzip(buf, function (err, buffer) {
        if (err) reject(err)
        const content = buffer.toString('utf8')
        resolve(content)
      })
    })
  }
}

module.exports = Object.freeze(Gzip)
