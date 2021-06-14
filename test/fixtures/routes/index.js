'use strict'

const pkg = require(`${process.cwd()}/package.json`)

const routes = [
  /**
   * GET /
   */
  {
    method: 'GET',
    path: '/',
    handler: async (request, h) => {
      return h.response({
        data: {
          version: pkg.version,
          service: 'PMX data exporter',
          status: 'ok'
        },
        statusCode: 200
      })
    }
  }]

module.exports = routes
