import { createPostSchema, getPostByIdSchema, getPostSchema, likePostSchema, getAllPostSchema } from '../schema/post.js'
import { createPost, getPostById, getPostsByThreadKey, likePost, getAllPost } from '../controllers/post.js'
import fastifyAuth from 'fastify-auth'
import { validateToken } from '../middlewares/validate_token.js'

export default async (fastify, opts) => {
    fastify.register(fastifyAuth).after(() => privatePostRoute(fastify))
}

const privatePostRoute = async fastify => {
    fastify.post('/post/:key', {
        preHandler: fastify.auth([validateToken]),
        handler: createPost,
        schema: createPostSchema
    })
    
    fastify.get('/post/:key/:id', {
        preHandler: fastify.auth([validateToken]),
        schema: getPostByIdSchema,
        handler: getPostById
    })

    fastify.get('/post/:key', {
        preHandler: fastify.auth([validateToken]),
        schema: getPostSchema,
        handler: getPostsByThreadKey
    })

    fastify.post('/post/:key/:id/like', {
        preHandler: fastify.auth([validateToken]),
        schema: likePostSchema,
        handler: likePost
    })

    fastify.get('/post', {
        preHandler: fastify.auth([validateToken]),
        schema: getAllPostSchema,
        handler: getAllPost
    })
}
