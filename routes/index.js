import authRoute from './auth.js'
import feedbackRoute from './feedback.js'
import newsRoute from './news.js'
import publicRoute from './public.js'
import mediaRoute from './media.js'
import threadRoute from './thread.js'
import agendaRoute from './agenda.js'

export default async (fastify, opts) => {
    fastify.register(authRoute)
    fastify.register(feedbackRoute)
    fastify.register(newsRoute)
    fastify.register(publicRoute)
    fastify.register(mediaRoute)
    fastify.register(threadRoute)
    fastify.register(agendaRoute)
}