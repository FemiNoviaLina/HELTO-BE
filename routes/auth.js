import { registerUser, getToken } from '../controllers/auth.js'
import { loginSchema, registerSchema } from '../schema/auth.js'

export default async (fastify, opts) => {
    fastify.post('/user', { schema: registerSchema }, registerUser)

    fastify.post('/token', { schema: loginSchema }, getToken)
}