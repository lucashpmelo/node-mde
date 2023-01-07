'use strict'

class ZeroPad {
  /**
   *
   * @param {string} str
   * @returns {string}
   */
  static padNsu(str) {
    return str.padStart(15, '0')
  }
}

module.exports = Object.freeze(ZeroPad)
