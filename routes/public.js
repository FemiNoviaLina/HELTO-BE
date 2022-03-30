import { getStaticFile } from "../controllers/public.js"

export default async (fastify, opts) => {
    fastify.get("/public/:filename", getStaticFile)
}