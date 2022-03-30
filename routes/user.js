import { getUser } from '../controllers/user.js'
import fastifyAuth from 'fastify-auth'
import { validateToken } from '../middlewares/validate_token.js'

export default async (fastify, opts) => {
    fastify.register(fastifyAuth).after(() => privateUserRoute(fastify))
}

const privateUserRoute = async fastify => {
    fastify.get('/user/:id', {
        preHandler: fastify.auth([validateToken]),
        schema: {
            params: {
                id: {
                    type: 'number'
                }
            }
        },
        handler: getUser
    })
}