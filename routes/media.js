import { getMedia, getMediaById, postMedia, updateMedia, deleteMedia } from '../controllers/media.js'
import { getMediaSchema, getMediaByIdSchema, postMediaSchema, updateMediaSchema, deleteMediaSchema } from '../schema/media.js'
import fastifyAuth from "fastify-auth"
import { validateToken } from '../middlewares/validate_token.js'

export default async (fastify, opts) => {
    fastify.get('/media', { schema: getMediaSchema }, getMedia)

    fastify.get('/media/:id', { schema: getMediaByIdSchema }, getMediaById)

    fastify.register(fastifyAuth).after(() => privateMediaRoute(fastify))
}

const privateMediaRoute = async fastify => {
    fastify.put('/media/:id', {
        preHandler: fastify.auth([validateToken]),
        schema: updateMediaSchema,
        handler: updateMedia
    })
    
    fastify.post('/media', {
        preHandler: fastify.auth([validateToken]),
        schema: postMediaSchema,
        handler: postMedia
    })

    fastify.delete('/media/:id', {
        preHandler: fastify.auth([validateToken]),
        schema: deleteMediaSchema,
        handler: deleteMedia
    })
}