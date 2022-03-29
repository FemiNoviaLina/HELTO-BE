import { responseBody } from "../helpers/base_response.js"
import { statusCode } from "../helpers/constant.js"
import { prisma } from '../index.js'


const getNews = async(req, res) => {
    const skip = req.query.offset ? parseInt(req.query.offset) : 0
    const take = req.query.limit ? parseInt(req.query.limit) : 10

    const news = await prisma.news.findMany({
        orderBy: { createdAt: "desc"}, skip, take
    })

    if(news.length === 0) return res.status(statusCode.NOT_FOUND.code).send(responseBody(statusCode.NOT_FOUND.constant, 'Tidak ada berita untuk ditampilkan'))

    return res.status(statusCode.OK.code).send(responseBody(statusCode.OK.constant, 'Berita berhasil ditampilkan', { news }))
}

const getNewsById = async(req, res) => {
    const news = await prisma.news.findUnique({
        where: {
            id: req.params.id
        }
    })

    if(!news) return res.status(statusCode.NOT_FOUND.code).send(responseBody(statusCode.NOT_FOUND.constant, 'Berita tidak ditemukan'))

    return res.status(statusCode.OK.code).send(responseBody(statusCode.OK.constant, 'Berita berhasil ditampilkan', { news }))
}

const postNews = async(req, res) => {
    if(!req.user.isAdmin) {
        return res.status(statusCode.FORBIDDEN.code).send(responseBody(statusCode.FORBIDDEN.constant, 'User tidak diizinkan mengakses resource ini'))
    }

    const { title, content, image } = req.body
    const authorId = req.user.id
    let news

    try {
        news = await prisma.news.create({
            data: {
                title, content, authorId, image
            }
        })
    } catch (e) {
        if(e.code === '5432') return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, 'Tidak dapat menghubungi database')) 
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, e.message))
    }
    
    return res.status(statusCode.CREATED.code).send(responseBody(statusCode.CREATED.constant, 'Berita berhasil ditambahkan', news))
}

const updateNews = async(req, res) => {
    if(!req.user.isAdmin) {
        return res.status(statusCode.FORBIDDEN.code).send(errorResponseBody(statusCode.FORBIDDEN.constant, 'User tidak diizinkan mengakses resource ini'))
    }

    const { title, content, author, image } = req.body
    let news

    try {
        news = await prisma.news.update({
            where: {
                id: req.params.id
            },
            data: {
                title, content, author, image
            }
        })
    } catch (e) {
        if(e.code === '5432') return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, 'Tidak dapat menghubungi database')) 
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, e.message))
    }

    if(!news) return res.status(statusCode.NOT_FOUND.code).send(responseBody(statusCode.NOT_FOUND.constant, 'Berita tidak ditemukan'))

    return res.status(statusCode.OK.code).send(responseBody(statusCode.OK.constant, 'Berita berhasil diubah'))
}

const deleteNews = async(req, res) => {
    if(!req.user.isAdmin) {
        return res.status(statusCode.FORBIDDEN.code).send(errorResponseBody(statusCode.FORBIDDEN.constant, 'User tidak diizinkan mengakses resource ini'))
    }

    let news

    try {
        news = await prisma.news.delete({
            where: {
                id: req.params.id
            }
        })
    } catch (e) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, e.message))
    }

    if(!news) return res.status(statusCode.NOT_FOUND.code).send(responseBody(statusCode.NOT_FOUND.constant, 'Berita tidak ditemukan'))

    return res.status(statusCode.OK.code).send(responseBody(statusCode.OK.constant, 'Berita berhasil dihapus'))
}

export { getNews, getNewsById, postNews, updateNews, deleteNews }