import { postFeedback } from "../controllers/feedback.js"

export default async function(fastify, opts) {
    fastify.route({
        method: 'POST',
        url: '/feedback',
        handler: postFeedback
    })
}