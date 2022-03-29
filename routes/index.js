import authRoute from './auth.js'
import feedbackRoute from './feedback.js'
import newsRoute from './news.js'

export default async (fastify, opts) => {
    fastify.register(authRoute)
    fastify.register(feedbackRoute)
    fastify.register(newsRoute)
}