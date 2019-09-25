'use strict'

const test = require('ava')
const servfi = require(process.env.PWD)
const request = require('supertest')

const routes = [{
  method: 'GET',
  path: '/',
  handler (req, h) {
    return h.response({
      data: {
        ok: 1
      },
      statusCode: 200
    }).code(200)
  }
}]

test('Server intance', async t => {
  const server = await servfi.server({
    routes
  })

  t.is(typeof server.start, 'function')
  t.is(typeof server.info, 'object')
  t.deepEqual(server.info.started, 0)
})

test('Server start', async t => {
  const server = await servfi.start({
    routes
  })

  t.is(typeof server.start, 'function')
  t.is(typeof server.info, 'object')
  t.true(server.info.started > 0)
})

test('Request rute GET /', async t => {
  const server = await servfi.start({
    routes,
    logs: true
  })

  const { body } = await request(server.listener)
    .get('/')
    .set('Accept', 'application/json')
    .expect(200)

  t.is(typeof body.data, 'object')
})
