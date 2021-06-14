'use strict'

// const good = require('@hapi/good')
// const defaults = require('defaults')
// const logger = require('./lib/logger')
const Server = require('./lib/server')

module.exports = {
  Server
}

/*
module.exports = {
  async server ({ routes, config, register, logs, name }) {
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

    const server = Hapi.server(config)

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

    return server
  },

  async start ({ config, routes, register, logs, name }) {
    const server = await this.server({
      config,
      routes,
      register,
      logs
    })

    await server.start()

    return server
  }
} */
