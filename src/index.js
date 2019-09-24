'use strict'

const Hapi = require('@hapi/hapi')
const good = require('@hapi/good')
const defaults = require('defaults')
const logger = require('./lib/logger')

module.exports = {
  server (config = { port: null, host: null }) {
    config = defaults(config, {
      router: {
        stripTrailingSlash: true
      }
    })

    const server = new Hapi.Server(config)

    return server
  },

  async start ({ config = {}, name = null, register = null, routes = null, logs }) {
    if (!routes || !Array.isArray(routes)) throw new Error('Routes not is Array')

    logs = defaults(logs, {
      ops: false,
      config: {}
    })

    logs.config.name = name

    const server = this.server(config)

    try {
      if (register) {
        await server.register(register)
      }

      server.route(routes)

      if (logs) {
        await server.register({
          plugin: good,
          options: {
            ops: logs.ops || false,
            reporters: {
              console: [{
                module: logger,
                args: (logs.config) ? [logs.config] : []
              },
              'stdout'
              ]
            }
          }
        })
      }

      await server.start()

      server.log('info', `${name || ''} server start in port: ${server.info.port}`)

      return Promise.resolve(server.info)
    } catch (e) {
      server.log('error', e)
      return Promise.reject(e)
    }
  }
}
