import authRoute from './auth.js'
import feedbackRoute from './feedback.js'

export default async (fastify, opts) => {
    fastify.register(authRoute)
    fastify.register(feedbackRoute)
}