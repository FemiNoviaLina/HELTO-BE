import { getThreadKey, enrollKey } from "../controllers/thread.js"
import { enrollKeySchema } from '../schema/thread.js'
import fastifyAuth from 'fastify-auth'
import { validateToken } from '../middlewares/validate_token.js'

export default async (fastify, opts) => {
    fastify.register(fastifyAuth).after(() => privateNewsRoute(fastify))
}

const privateNewsRoute = async fastify => {
    fastify.get('/thread/key', {
        preHandler: fastify.auth([validateToken]),
        handler: getThreadKey
    })
    
    fastify.get('/thread/enrollment/:key', {
        preHandler: fastify.auth([validateToken]),
        schema: enrollKeySchema,
        handler: enrollKey
    })
}