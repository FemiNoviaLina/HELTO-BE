const fastify = require('fastify')({ logger: true })
require('dotenv').config()

fastify.get('/', () => {
    return { hello: 'world' }
})

const start = async () => {
    try {
      await fastify.listen(process.env.PORT? process.env.PORT : 3000)
    } catch (err) {
      fastify.log.error(err)
      process.exit(1)
    }
}

start()