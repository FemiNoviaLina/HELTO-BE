import { postFeedback } from "../controllers/feedback.js"
import { feedbackSchema } from "../schema/feedback.js"

export default async (fastify, opts) => {
    fastify.post("/feedback", { schema: feedbackSchema }, postFeedback)
}