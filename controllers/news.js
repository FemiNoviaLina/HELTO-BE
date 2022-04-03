import { responseBody } from "../helpers/base_response.js"
import { statusCode } from "../helpers/constant.js"
import { prisma } from '../index.js'
import path from 'path'
import { supabase } from "../index.js"

const getNews = async(req, res) => {
    const skip = req.query.offset ? parseInt(req.query.offset) : 0
    const take = req.query.limit ? parseInt(req.query.limit) : 10
    const keyword = req.query.keyword

    try {
        const where = {
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

        const [ news, totalData ] = await prisma.$transaction([
            prisma.news.findMany({
                orderBy: { createdAt: "desc"}, skip, take,
                where,
                include: { 
                    author: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            }),
            prisma.news.count({ where })
        ])
    
        if(news.length === 0) return res.status(statusCode.NOT_FOUND.code).send(responseBody(statusCode.NOT_FOUND.constant, 'Tidak ada berita untuk ditampilkan'))
    
        return res.status(statusCode.OK.code).send(responseBody(statusCode.OK.constant, 'Berita berhasil ditampilkan', { news, totalData }))
    } catch(e) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, 'Tidak dapat meraih database'))
    }
}

const getNewsById = async(req, res) => {
    const news = await prisma.news.findUnique({
        where: {
            id: req.params.id
        },
        include: {
            author: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    })

    if(!news) return res.status(statusCode.NOT_FOUND.code).send(responseBody(statusCode.NOT_FOUND.constant, 'Berita tidak ditemukan'))

    return res.status(statusCode.OK.code).send(responseBody(statusCode.OK.constant, 'Berita berhasil ditampilkan', { news }))
}

const postNews = async(req, res) => {
    if(!req.user.isAdmin) {
        return res.status(statusCode.FORBIDDEN.code).send(responseBody(statusCode.FORBIDDEN.constant, 'User tidak diizinkan mengakses resource ini'))
    }

    const { title, content } = req.body
    const author = req.user.id
    const image = req.files['image'][0]
    const filename = 'image' + Date.now() + path.extname(image.originalname)

    const { data, error } = await supabase.storage.from('helto-storage')
        .upload('public/' + filename, image.buffer, { contentType: image.mimetype })

    if(error) return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, 'Tidak dapat menghubungi storage'))

    let news

    try {
        news = await prisma.news.create({
            data: {
                title, content, author: {
                    connect: {
                        id: author
                    }
                }, image: filename
            }
        })

    } catch (e) {
        if(e.code === 'P1001') return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, 'Tidak dapat meraih database'))
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, e.message))
    }
    
    return res.status(statusCode.CREATED.code).send(responseBody(statusCode.CREATED.constant, 'Berita berhasil ditambahkan', news))
}

const updateNews = async(req, res) => {
    if(!req.user.isAdmin) {
        return res.status(statusCode.FORBIDDEN.code).send(responseBody(statusCode.FORBIDDEN.constant, 'User tidak diizinkan mengakses resource ini'))
    }

    const { title, content } = req.body
    const author = req.user.id

    let news

    try {
        let filename, oldImage
        if(req.file) {
            const image = req.file
            filename = 'image' + Date.now() + path.extname(image.originalname)

            const { data, error } = await supabase.storage.from('helto-storage')
                .upload('public/' + filename, image.buffer, { contentType: image.mimetype })

            if(error) return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, 'Tidak dapat menghubungi storage'))
            oldImage = await prisma.news.findUnique({
                where: {
                    id: req.params.id
                }, 
                select: {
                    image: true
                }
            })
        }

        news = await prisma.news.update({
            where: {
                id: req.params.id
            },
            data: {
                title, content, author: {
                    connect: {
                        id: author
                    }
                }, image: filename
            }
        })

        if(oldImage) {
            const { data, error } = await supabase.storage.from('helto-storage')
                .remove(['public/' + oldImage.image])

            if(error) return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, 'Tidak dapat menghubungi storage'))
        }

    } catch (e) {
        if(e.code === 'P1001') return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, 'Tidak dapat meraih database'))
        if(e.code === 'P2025') return res.status(statusCode.NOT_FOUND.code).send(responseBody(statusCode.NOT_FOUND.constant, 'Berita tidak ditemukan'))
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, e.message))
    }
    
    return res.status(statusCode.OK.code).send(responseBody(statusCode.OK.constant, 'Berita berhasil diupdate', news))
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

        if(news) {
            await supabase.storage.from('helto-storage')
                .remove(['public/' + news.image])
        }
    } catch (e) {
        if(e.code === 'P1001') return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, 'Tidak dapat meraih database'))
        if(e.code === 'P2025') return res.status(statusCode.NOT_FOUND.code).send(responseBody(statusCode.NOT_FOUND.constant, 'Berita tidak ditemukan'))
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, e.message))
    }

    return res.status(statusCode.OK.code).send(responseBody(statusCode.OK.constant, 'Berita berhasil dihapus'))
}

export { getNews, getNewsById, postNews, updateNews, deleteNews }