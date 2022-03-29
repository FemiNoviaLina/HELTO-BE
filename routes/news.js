import { getNewsSchema, getNewsByIdSchema, postNewsSchema, updateNewsSchema, deleteNewsSchema } from "../schema/news.js"
import { getNews, getNewsById, postNews, updateNews, deleteNews } from "../controllers/news.js"
import fastifyAuth from "fastify-auth"
import { validateToken } from '../middlewares/validate_token.js'
import { upload } from "../index.js"

export default async (fastify, opts) => {
    fastify.get('/news', { schema: getNewsSchema }, getNews)

    fastify.get('/news/:id', { schema: getNewsByIdSchema }, getNewsById)

    fastify.register(fastifyAuth).after(() => privateNewsRoute(fastify))
}

const privateNewsRoute = async fastify => {
    fastify.post('/news', {
        preHandler: fastify.auth([validateToken]),
        preValidation: upload.fields([{ name: 'image', maxCount: 1 }]),
        schema: postNewsSchema,
        handler: postNews
    })

    fastify.put('/news/:id', {
        preHandler: fastify.auth([validateToken]),
        preValidation: upload.fields([{ name: 'image', maxCount: 1 }]),
        schema: updateNewsSchema,
        handler: updateNews
    })

    fastify.delete('/news/:id', {
        preHandler: fastify.auth([validateToken]),
        schema: deleteNewsSchema,
        handler: deleteNews
    })
}