import { postFeedback, getFeedback } from "../controllers/feedback.js"
import { feedbackSchema } from "../schema/feedback.js"
import fastifyAuth from "fastify-auth"
import { validateToken } from '../middlewares/validate_token.js'

export default async (fastify, opts) => {
    fastify.post("/feedback", { schema: feedbackSchema }, postFeedback)

    fastify.register(fastifyAuth).after(() => privateFeedbackRoute(fastify))
}

const privateFeedbackRoute = async fastify => {
    fastify.get("/feedback", {
        preHandler: fastify.auth([validateToken]),
        handler: getFeedback
    })
}