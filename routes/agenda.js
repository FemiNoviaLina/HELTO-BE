import { postAgendaSchema, updateAgendaSchema, deleteAgendaSchema, getAgendaByIdSchema } from '../schema/agenda.js'
import { postAgenda, getAgenda, getAgendaById, updateAgenda, deleteAgenda } from '../controllers/agenda.js'
import fastifyAuth from 'fastify-auth'
import { validateToken } from '../middlewares/validate_token.js'

export default async (fastify, opts) => {
    fastify.get('/agenda', getAgenda)

    fastify.get('/agenda/:id', { schema: getAgendaByIdSchema }, getAgendaById)

    fastify.register(fastifyAuth).after(() => privateMediaRoute(fastify))
}

const privateMediaRoute = async fastify => {
    fastify.put('/agenda/:id', {
        preHandler: fastify.auth([validateToken]),
        schema: updateAgendaSchema,
        handler: updateAgenda
    })
    
    fastify.post('/agenda', {
        preHandler: fastify.auth([validateToken]),
        schema: postAgendaSchema,
        handler: postAgenda
    })

    fastify.delete('/agenda/:id', {
        preHandler: fastify.auth([validateToken]),
        schema: deleteAgendaSchema,
        handler: deleteAgenda
    })
}