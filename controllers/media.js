import { responseBody } from "../helpers/base_response.js"
import { statusCode } from "../helpers/constant.js"
import { prisma } from '../index.js'

const getMedia = async (req, res) => {
    const skip = req.query.offset ? parseInt(req.query.offset) : 0
    const take = req.query.limit ? parseInt(req.query.limit) : 10

    const media = await prisma.media.findMany({
        orderBy: { createdAt: "desc" }, skip, take
    })

    if(media.length === 0) return res.status(statusCode.NOT_FOUND.code).send(responseBody(statusCode.NOT_FOUND.constant, 'Tidak ada media untuk ditampilkan'))

    return res.status(statusCode.OK.code).send(responseBody(statusCode.OK.constant, 'Media berhasil ditampilkan', { media }))
}

const getMediaById = async (req, res) => {
    const media = await prisma.media.findUnique({
        where: {
            id: req.params.id
        }
    })

    if(!media) return res.status(statusCode.NOT_FOUND.code).send(responseBody(statusCode.NOT_FOUND.constant, 'Media tidak ditemukan'))

    return res.status(statusCode.OK.code).send(responseBody(statusCode.OK.constant, 'Media berhasil ditampilkan', { media }))
}

const postMedia = async (req, res) => {
    if(!req.user.isAdmin) {
        return res.status(statusCode.FORBIDDEN.code).send(responseBody(statusCode.FORBIDDEN.constant, 'User tidak diizinkan mengakses resource ini'))
    }

    const { link, description } = req.body
    let media

    try {
        media = await prisma.media.create({
            data: {
                link, description
            }
        })
    } catch(e) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, e.message))
    }

    return res.status(statusCode.CREATED.code).send(responseBody(statusCode.CREATED.constant, 'Media created', media))
}

const updateMedia = async (req, res) => {
    if(!req.user.isAdmin) {
        return res.status(statusCode.FORBIDDEN.code).send(responseBody(statusCode.FORBIDDEN.constant, 'User tidak diizinkan mengakses resource ini'))
    }

    const description = req.body.description
    const link = req.body.link

    try {
        await prisma.media.update({
            where: {
                id: req.params.id
            },
            data: {
                description, link
            }
        }) 
    } catch(e) {
        if(e.code === 'P2025') return res.status(statusCode.NOT_FOUND.code).send(responseBody(statusCode.NOT_FOUND.constant, 'Berita tidak ditemukan'))
        if(e.code === 'P1001') return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, 'Tidak dapat meraih database'))
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, e.message))
    }

    return res.status(statusCode.OK.code).send(responseBody(statusCode.OK.constant, 'Media updated'))
}

const deleteMedia = async (req, res) => {
    if(!req.user.isAdmin) {
        return res.status(statusCode.FORBIDDEN.code).send(errorResponseBody(statusCode.FORBIDDEN.constant, 'User tidak diizinkan mengakses resource ini'))
    }

    try {
        await prisma.media.delete({
            where: {
                id: req.params.id
            }
        })

    } catch (e) {
        if(e.code === 'P1001') return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, 'Tidak dapat meraih database'))
        if(e.code === 'P2025') return res.status(statusCode.NOT_FOUND.code).send(responseBody(statusCode.NOT_FOUND.constant, 'Media tidak ditemukan'))
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, e.message))
    }

    return res.status(statusCode.OK.code).send(responseBody(statusCode.OK.constant, 'Media berhasil dihapus'))
}

export { getMedia, getMediaById, postMedia, updateMedia, deleteMedia }