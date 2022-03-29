import { postFeedback } from "../controllers/feedback.js"
import { feedbackSchema } from "../schema/feedback.js"

export default async function(fastify, opts) {
    fastify.post("/feedback", { schema: feedbackSchema }, postFeedback)
}