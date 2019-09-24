'use strict'

const Moment = require('moment')
const SafeStringify = require('json-stringify-safe')

module.exports = {
  output (event, settings) {
    let timestamp = Moment(parseInt(event.timestamp, 10))

    if (settings.utc) {
      timestamp = timestamp.utc()
    }

    timestamp = timestamp.format(settings.format)

    event.tags = event.tags.toString()
    const tags = ` [${event.tags}] `

    // Add event id information if available, typically for 'request' events

    const id = settings.id && event.id ? ` (${event.id})` : ''
    const name = settings.name ? `\x1b[36m${settings.name}\x1b[0m${id} -> ` : ''

    return `${name}${timestamp},${tags}${event.data}\n`
  },

  method (method, settings) {
    const methodColors = {
      get: 32,
      delete: 31,
      put: 36,
      post: 33
    }

    let formattedMethod = method.toLowerCase()
    if (settings.color) {
      const color = methodColors[method.toLowerCase()] || 34
      formattedMethod = `\x1b[1${color}m${formattedMethod}\x1b[0m`
    }

    return formattedMethod
  },

  statusCode (statusCode, settings) {
    let color
    if (statusCode && settings.color) {
      color = 32
      if (statusCode >= 500) {
        color = 31
      } else if (statusCode >= 400) {
        color = 33
      } else if (statusCode >= 300) {
        color = 36
      }

      return `\x1b[${color}m${statusCode}\x1b[0m`
    }

    return statusCode
  },

  response (event, tags, settings) {
    const query = event.query ? SafeStringify(event.query) : ''
    const method = this.method(event.method, settings)
    const statusCode = this.statusCode(event.statusCode, settings) || ''

    // event, timestamp, id, instance, labels, method, path, query, responseTime,
    // statusCode, pid, httpVersion, source, remoteAddress, userAgent, referer, log
    // method, pid, error

    const output = `${event.instance}: ${method} ${event.path} ${query} ${statusCode} (${event.responseTime}ms)`

    const response = {
      id: event.id,
      timestamp: event.timestamp,
      tags,
      data: output
    }

    return this.output(response, settings)
  },

  error (event, tags, settings) {
    const output = `message: ${event.error.message}, stack: ${event.error.stack}`

    const error = {
      id: event.id,
      timestamp: event.timestamp,
      tags,
      data: output
    }

    return this.output(error, settings)
  },

  default (event, tags, settings) {
    const data = typeof event.data === 'object' ? SafeStringify(event.data) : event.data
    const output = `data: ${data}`

    const defaults = {
      timestamp: event.timestamp,
      id: event.id,
      tags,
      data: output
    }

    return this.output(defaults, settings)
  }
}
