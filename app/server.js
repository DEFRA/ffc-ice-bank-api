require('./insights').setup()
const Hapi = require('@hapi/hapi')
const Boom = require('@hapi/boom')
require('dotenv').config()

const server = Hapi.server({
  port: process.env.PORT
})

const routes = [].concat(
  require('./routes/healthy'),
  require('./routes/healthz'),
  require('./routes/d365')
)

const apiKeyScheme = () => {
  return {
    authenticate: async (request, h) => {
      const apiKey = request.headers['x-api-key']
      if (!apiKey) {
        throw Boom.unauthorized('Missing API key')
      }

      if (apiKey !== process.env.API_KEY) {
        throw Boom.unauthorized('Invalid API key')
      }

      const credentials = { apiKey }
      return h.authenticated({ credentials })
    }
  }
}

server.auth.scheme('api-key', apiKeyScheme)
server.auth.strategy('apiKey', 'api-key')

server.route(routes)

module.exports = server
