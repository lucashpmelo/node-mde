'use strict'

const axios = require('axios').default
const https = require('https')

const ENV = require('../env')

class Instance {
  constructor(opts) {
    const baseURL = ENV[opts.service][opts.tpAmb]
    const ca = ENV['ca']

    const AgentOptions = Object.assign(
      {
        cert: opts.cert,
        key: opts.key,
        ca: ca,
      },
      { ...opts.httpsOptions }
    )

    const httpsAgent = new https.Agent(AgentOptions)

    const requestOptions = Object.assign(
      {
        baseURL: baseURL,
        headers: {
          'User-Agent': `node-mde/${ENV.version}`,
          'Content-Type': 'application/soap+xml; charset=utf-8',
        },
        httpsAgent: httpsAgent,
        timeout: 60000,
      },
      { ...opts.requestOptions }
    )

    const instance = axios.create({
      ...requestOptions,
    })

    this.instance = instance
  }

  /**
   * @returns {Promise<{status: number, data: string}>}
   */
  async request(options) {
    try {
      const response = await this.instance(options)

      const { status, data } = response

      return { status, data }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response

        return { status, data }
      } else if (error.request) {
        if (error.code === 'ECONNABORTED') {
          const retorno = {
            status: 504,
            data: `<error>${error.message || error}</error>`,
          }

          return retorno
        }

        const retorno = {
          status: 502,
          data: `<error>${error.message || error}</error>`,
        }

        return retorno
      } else {
        const retorno = {
          status: 500,
          data: `<error>${error.message || error}</error>`,
        }

        return retorno
      }
    }
  }
}

module.exports = Instance
