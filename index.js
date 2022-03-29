import { fastify } from 'fastify'
import Prisma from '@prisma/client'
import 'dotenv/config'
import fastifyCors from 'fastify-cors'
import route from './routes/index.js'
import Ajv from 'ajv'
import ajvErrors from 'ajv-errors'
import addFormats from 'ajv-formats'
import multer from 'fastify-multer'
import fastifyStatic from 'fastify-static'
import path from 'path'
import { dirname } from 'path';
import { fileURLToPath } from 'url';

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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public'))
  },
  filename: (req, file, cb) =>  {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
export const upload = multer({ storage })

const server = fastify({ 
  logger: true,
})

server.register(fastifyCors)

const __dirname = dirname(fileURLToPath(import.meta.url));
console.log(__dirname)
server.register(fastifyStatic, { root: path.join(__dirname, 'public') })

server.register(multer.contentParser)

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