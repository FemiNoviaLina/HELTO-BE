import { registerUser, getToken } from '../controllers/auth.js'
import { loginSchema, registerSchema } from '../schema/auth.js'

export default async function(fastify, opts) {
    fastify.route({
        method: 'POST',
        url: '/user',
        handler: registerUser,
        schema: { body: registerSchema }
    })

    fastify.route({
        method: 'POST',
        url: '/token',
        handler: getToken,
        schema: { body: loginSchema }
    })
}