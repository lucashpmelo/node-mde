'use strict'

const { DateTime } = require('luxon')

class Data {
  /**
   *
   * @param {Date} date
   * @param {string} zone
   * @returns {string}
   */
  static toFormat(date, zone) {
    const fmt = "yyyy-MM-dd'T'HH:mm:ssZZ"
    return DateTime.fromJSDate(date).setZone(zone).toFormat(fmt)
  }
}

module.exports = Object.freeze(Data)
