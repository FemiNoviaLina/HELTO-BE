import { registerUser, getToken } from '../controllers/auth.js'

export default async function(fastify, opts) {
    fastify.route({
        method: 'POST',
        url: '/user',
        handler: registerUser
    })

    fastify.route({
        method: 'POST',
        url: '/token',
        handler: getToken
    })
}