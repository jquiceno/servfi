'use strict'

const Stream = require('stream')
const Hoek = require('@hapi/hoek')
const Format = require('./format')

const defaults = {
  format: 'YYMMDD/HHmmss.SSS',
  utc: true,
  color: true,
  events: '*',
  id: false,
  name: ''
}

class Logger extends Stream.Transform {
  constructor (config) {
    super({ objectMode: true })

    config = config || {}
    this._settings = Hoek.applyToDefaults(defaults, config)
  }

  _transform (data, enc, next) {
    const eventName = data.event
    let tags = []

    const events = this._settings.events

    if (Array.isArray(data.tags)) {
      tags = data.tags.concat([])
    } else if (data.tags) {
      tags = [data.tags]
    }

    tags.unshift(eventName)

    const vTags = tags.filter(t => {
      return events[t]
    })

    if (events !== '*' && vTags.length < 1) {
      return next(null)
    }

    if (eventName === 'error' || data.error instanceof Error) {
      return next(null, Format.error(data, tags, this._settings))
    }

    if (eventName === 'ops') {
      return next(null, Format.ops(data, tags, this._settings))
    }

    if (eventName === 'response') {
      if (events.response && events.response.statusCode.indexOf(data.statusCode) < 0) {
        return next(null)
      }

      return next(null, Format.response(data, tags, this._settings))
    }

    if (!data.data) {
      data.data = '(none)'
    }

    return next(null, Format.default(data, tags, this._settings))
  }
}

module.exports = Logger
