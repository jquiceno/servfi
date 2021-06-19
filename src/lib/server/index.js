'use strict'

const Hapi = require('@hapi/hapi')
const glob = require('glob')
const { resolve } = require('path')

class Server {
  constructor ({ port = 3000, host = 'localhost', name = null } = {}) {
    this._server = Hapi.server({ port, host })
    this.port = port
    this.host = host
    this.name = name
    this.routesPaths = [
      '**/routes/*/index.js',
      '**/routes/index.js',
      '**/routes/*.js'
    ]

    this.routes = []
  }

  async start ({ importRoutes = true } = {}) {
    if (importRoutes) this.addRoutes()

    await this._server.start()
    return this.getInfo()
  }

  getInfo () {
    return this._server.info
  }

  addRoutes (routes = false) {
    routes = routes || this.getFromPath(this.routesPaths)
    routes = (typeof routes !== 'string') ? routes : this.getFromPath(routes)
    routes = !Array.isArray(routes) ? [routes] : routes

    this.routes = this.routes.concat(routes)
    return this._server.route(routes)
  }

  resolvePaths (paths) {
    let results = []
    paths = Array.isArray(paths) ? paths : [paths]

    paths.forEach(p => {
      results = results.concat(glob.sync(p, { ignore: '**/node_modules/*' }))
    })

    return [...new Set(results)]
  }

  getFromPath (path) {
    try {
      let routes = []
      const paths = this.resolvePaths(path)

      paths.forEach(p => {
        const route = require(resolve(p))
        if (!Array.isArray(route)) return routes.push(route)

        routes = routes.concat(route)

        return route
      })

      if (!routes.length) throw new Error('Invalid route')

      return routes
    } catch (error) {
      throw new Error(`Invalid route path: ${resolve(path)}`)
    }
  }
}

module.exports = Server
