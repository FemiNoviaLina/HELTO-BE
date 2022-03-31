import { responseBody } from "../helpers/base_response.js"
import { statusCode } from "../helpers/constant.js"
import { prisma } from '../index.js'
import path from 'path'
import { supabase } from "../index.js"

const postTipsAndTrick = async (req, res) => {
    if(!req.user.isAdmin) {
        return res.status(statusCode.FORBIDDEN.code).send(responseBody(statusCode.FORBIDDEN.constant, 'User tidak diizinkan mengakses resource ini'))
    }

    const { title, content } = req.body
    const image = req.files['image'][0]
    const filename = 'image' + Date.now() + path.extname(image.originalname)
    const { data, error } = await supabase.storage.from('helto-storage')
        .upload('public/' + filename, image.buffer, { contentType: image.mimetype })

    if(error) return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, 'Tidak dapat menghubungi storage'))

    let tipsTrick

    try {
        tipsTrick = await prisma.tipsTrick.create({
            data: {
                title, content, image: filename
            }
        })

    } catch (e) {
        if(e.code === 'P1001') return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, 'Tidak dapat meraih database'))
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, e.message))
    }

    return res.status(statusCode.CREATED.code).send(responseBody(statusCode.CREATED.constant, 'Tips and tricks berhasil ditambahkan', tipsTrick))
}

const getTipsAndTrick = async (req, res) => {
    const skip = req.query.offset ? parseInt(req.query.offset) : 0
    const take = req.query.limit ? parseInt(req.query.limit) : 10
    const keyword = req.query.keyword

    let tipsTrick

    try {
        tipsTrick = await prisma.tipsTrick.findMany({
            skip,
            take,
            orderBy: {
                createdAt: 'desc',
            },
            where: {
                OR: [{
                    content: {
                        contains: keyword ? keyword : "",
                        mode: 'insensitive'
                    },
                }, {
                    title: {
                        contains: keyword ? keyword : "",
                        mode: 'insensitive'
                    },
                }]
            }
        })

    } catch (e) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, e.message))
    }

    if(tipsTrick.length === 0) return res.status(statusCode.NOT_FOUND.code).send(responseBody(statusCode.NOT_FOUND.constant, 'Tips and tricks tidak ditemukan'))

    return res.status(statusCode.OK.code).send(responseBody(statusCode.OK.constant, 'Tips and tricks berhasil didapat', tipsTrick))
}

const getTipsAndTrickById = async (req, res) => {
    const { id } = req.params

    let tipsTrick

    try {
        tipsTrick = await prisma.tipsTrick.findUnique({
            where: {
                id
            }
        })
    } catch (e) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, e.message))
    }

    if(!tipsTrick) return res.status(statusCode.NOT_FOUND.code).send(responseBody(statusCode.NOT_FOUND.constant, 'Tips and tricks tidak ditemukan'))

    return res.status(statusCode.OK.code).send(responseBody(statusCode.OK.constant, 'Tips and tricks berhasil didapat', tipsTrick))
}

const updateTipsAndTrick = async (req, res) => {
    if(!req.user.isAdmin) {
        return res.status(statusCode.FORBIDDEN.code).send(responseBody(statusCode.FORBIDDEN.constant, 'User tidak diizinkan mengakses resource ini'))
    }

    const { id } = req.params
    const { title, content } = req.body
    let filename
    if(req.files['image']) {
        const image = req.files['image'][0]
        filename = 'image' + Date.now() + path.extname(image.originalname)
        const { data, error } = await supabase.storage.from('helto-storage')
            .upload('public/' + filename, image.buffer, { contentType: image.mimetype })

        if(error) return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, 'Tidak dapat menghubungi storage'))

    }
    
    let data = { }
    if(title) data.title = title
    if(content) data.content = content
    if(filename) data.image = filename

    try {
        const tipsTrick = await prisma.tipsTrick.update({
            where: {
                id
            },
            data
        })

        if(!tipsTrick) return res.status(statusCode.NOT_FOUND.code).send(responseBody(statusCode.NOT_FOUND.constant, 'Tips and tricks tidak ditemukan'))
        
    } catch (e) {
        if(e.code === 'P1001') return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, 'Tidak dapat meraih database'))
        if(e.code === 'P2025') return res.status(statusCode.NOT_FOUND.code).send(responseBody(statusCode.NOT_FOUND.constant, 'Tips and trick tidak ditemukan'))
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, e.message))
    }

    return res.status(statusCode.OK.code).send(responseBody(statusCode.OK.constant, 'Tips and tricks berhasil diupdate'))
}

const deleteTipsAndTrick = async (req, res) => {
    if(!req.user.isAdmin) {
        return res.status(statusCode.FORBIDDEN.code).send(errorResponseBody(statusCode.FORBIDDEN.constant, 'User tidak diizinkan mengakses resource ini'))
    }

    const { id } = req.params

    let tipsTrick

    try {
        tipsTrick = await prisma.tipsTrick.delete({
            where: {
                id
            }
        })

        if(tipsTrick) {
            await supabase.storage.from('helto-storage')
                .remove(tipsTrick.image)
        }
    }
    catch (e) {
        if(e.code === 'P1001') return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, 'Tidak dapat meraih database'))
        if(e.code === 'P2025') return res.status(statusCode.NOT_FOUND.code).send(responseBody(statusCode.NOT_FOUND.constant, 'Tips and trick tidak ditemukan'))
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, e.message))
    }
    return res.status(statusCode.OK.code).send(responseBody(statusCode.OK.constant, 'Tips and tricks berhasil dihapus'))
}

export { postTipsAndTrick, getTipsAndTrick, getTipsAndTrickById, updateTipsAndTrick, deleteTipsAndTrick }