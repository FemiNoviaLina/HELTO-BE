import { fastify } from 'fastify'
import Prisma from '@prisma/client'
import 'dotenv/config'
import authRoute from './routes/auth.js'
import fastifyCors from 'fastify-cors'

const { PrismaClient } = Prisma;
export const prisma = new PrismaClient()

const server = fastify({ logger: true })

server.register(fastifyCors)

server.register(authRoute)

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