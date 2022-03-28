import { fastify } from 'fastify'
import Prisma from '@prisma/client'
import 'dotenv/config'
import fastifyCors from 'fastify-cors'
import route from './routes/index.js'
import Ajv from 'ajv'
import ajvErrors from 'ajv-errors'
import addFormats from 'ajv-formats'

const { PrismaClient } = Prisma;
export const prisma = new PrismaClient()

const ajv = new Ajv({ 
  allErrors: true, 
  removeAdditional: true, 
  useDefaults: true, 
  coerceTypes: true,
  unicodeRegExp: false
})

ajvErrors(ajv)
addFormats(ajv)

const server = fastify({ 
  logger: true,
})

server.register(fastifyCors)
server.setValidatorCompiler(({ schema }) => { return ajv.compile(schema) })
server.register(route)

const start = async () => {
  await prisma.$connect().then(() => {
    server.log.info('Database connected')
  }).catch((err) => {
    server.log.error('Database connection failed')
    server.log.error(err)
  })

  try {
    await server.listen(process.env.PORT? process.env.PORT : 3000)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()