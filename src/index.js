'use strict'

const Hapi = require('@hapi/hapi')
const good = require('@hapi/good')
const defaults = require('defaults')
const logger = require('./lib/logger')

module.exports = {
  async server ({ routes, config, register, logs, name }) {
    try {
      if (!routes || !Array.isArray(routes)) throw new Error('Routes not is Array')

      logs = (logs === true) ? {} : logs

      logs = defaults(logs, {
        ops: false,
        config: {}
      })

      config = defaults(config, {
        router: {
          stripTrailingSlash: true
        }
      })

      logs.config.name = name || null

      const server = new Hapi.Server(config)

      server.route(routes)

      register && await server.register(register)

      logs && await server.register({
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

      server.info.name = name || null

      return Promise.resolve(server)
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async start ({ config, routes, register, logs, name }) {
    try {
      const server = await this.server({
        config,
        routes,
        register,
        logs
      })

      await server.start()

      server.log('info', `${name || ''} server start in port: ${server.info.port}`)

      return Promise.resolve(server)
    } catch (err) {
      console.error(err)
      return Promise.reject(err)
    }
  }
}

process.on('unhandledRejection', (err) => {
  console.error(err)
  process.exit(1)
})
