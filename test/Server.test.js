'use strict'

const test = require('ava')
const { Server } = require(process.env.PWD)
// const request = require('supertest')
const routes = require('./fixtures/routes')
const routesProducts = require('./fixtures/routes/products')
const routesUsers = require('./fixtures/routes/users')

test.before(t => {
  const server = new Server()
  t.context.server = server
})

test('Server intance', async t => {
  const { server } = t.context

  t.is(typeof server.start, 'function')
  t.is(typeof server.getInfo, 'function')
  t.is(typeof server.start, 'function')
})

test('Server default info', async t => {
  const { server } = t.context

  const serverInfo = server.getInfo()

  t.deepEqual(typeof serverInfo.created, 'number')
  t.deepEqual(serverInfo.port, 3000)
  t.deepEqual(server.host, 'localhost')
})

test('Add server routes from array', async t => {
  const server = new Server()
  server.addRoutes(routes)

  t.is(server.routes.length, routes.length)
})

test('Add server routes from object', async t => {
  const server = new Server()
  server.addRoutes(routesUsers)

  t.is(server.routes.length, routes.length)
})

test('Add server routes from path', async t => {
  const server = new Server()
  server.addRoutes('**/fixtures/routes/products')

  t.is(server.routes.length, routesProducts.length)
})

test('Start server with auto import routes', async t => {
  const port = 5000
  const server = new Server({ port })

  const serverInfo = await server.start()

  t.deepEqual(typeof serverInfo.created, 'number')
  t.deepEqual(typeof serverInfo.started, 'number')
  t.deepEqual(serverInfo.port, port)
  t.true(server.routes.length > 0)
})

test('Start server without auto import routes', async t => {
  const port = 6000
  const server = new Server({ port })

  const serverInfo = await server.start({ importRoutes: false })

  t.deepEqual(serverInfo.port, port)
  t.is(server.routes.length, 0)
})

test('Error, invalid route path', async t => {
  const server = new Server()
  const error = t.throws(() => server.addRoutes('./invalid', true))

  t.regex(error.message, /Invalid route/)
})
/*
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
*/
