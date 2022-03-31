import { postTipsAndTrick, getTipsAndTrick, getTipsAndTrickById, updateTipsAndTrick, deleteTipsAndTrick } from '../controllers/tips_trick.js'
import fastifyAuth from 'fastify-auth'
import { validateToken } from '../middlewares/validate_token.js'
import { postTipsAndTrickSchema, updateTipsAndTrickSchema, deleteTipsAndTrickSchema, getTipsAndTrickSchema, getTipsAndTrickByIdSchema } from '../schema/tips_trick.js'
import { upload } from "../index.js"

export default async (fastify, opts) => {
    fastify.get('/tips-and-trick', { schema: getTipsAndTrickSchema }, getTipsAndTrick)

    fastify.get('/tips-and-trick/:id', { schema: getTipsAndTrickByIdSchema }, getTipsAndTrickById)

    fastify.register(fastifyAuth).after(() => privateTipsAndTrickRoute(fastify))
}

const privateTipsAndTrickRoute = async fastify => {
    fastify.put('/tips-and-trick/:id', {
        preHandler: fastify.auth([validateToken]),
        preValidation: upload.fields([{ name: 'image', maxCount: 1 }]),
        schema: updateTipsAndTrickSchema,
        handler: updateTipsAndTrick
    })
    
    fastify.post('/tips-and-trick', {
        preHandler: fastify.auth([validateToken]),
        preValidation: upload.fields([{ name: 'image', maxCount: 1 }]),
        schema: postTipsAndTrickSchema,
        handler: postTipsAndTrick
    })

    fastify.delete('/tips-and-trick/:id', {
        preHandler: fastify.auth([validateToken]),
        schema: deleteTipsAndTrickSchema,
        handler: deleteTipsAndTrick
    })
}