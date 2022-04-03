import { responseBody } from '../helpers/base_response.js';
import { prisma } from '../index.js'
import { statusCode } from '../helpers/constant.js'

const createPost = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            }, 
            include: {
                thread: {
                    select: {
                        id: true,
                        key: true
                   }
                }
            }
        })

        if(!user) return res.status(statusCode.UNAUTHORIZED.code).send(responseBody(statusCode.UNAUTHORIZED.constant, 'User tidak ditemukan'))
        
        if(req.params.key !== 'community') {
            if(user.thread.key !== req.params.key) return res.status(statusCode.FORBIDDEN.code).send(responseBody(statusCode.FORBIDDEN.constant, 'User tidak diizinkan untuk mengakses thread ini'))
        }

        const content = req.body.content
        const replyToId = req.body.replyToId ? req.body.replyToId : null
        const threadId = req.params.key !== 'community' ? user.thread.id : null
        const authorId = user.id

        console.log(threadId)

        const post = await prisma.post.create({
            data: {
                content, replyToId, 
                threadId, authorId
            }, 
            include: {
                thread: {
                    select: {
                        id: true,
                        key: true
                    }
                },
                author: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        region: true
                    }
                }
            }
        })

        if(replyToId) {
            await prisma.post.update({
                where: {
                    id: replyToId
                },
                data: {
                    replyCount: { increment : 1 }
                }
            })
        }

        return res.status(statusCode.OK.code).send(responseBody(statusCode.OK.constant, 'Post berhasil dibuat', post))
    } catch (e) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, e.message))
    }
}

// cari user => cek key, if !community => check key, set threadId, 
const getPostById = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            }, 
            include: {
                thread: {
                    select: {
                        id: true,
                        key: true
                   }
                }
            }
        })

        if(!user) return res.status(statusCode.UNAUTHORIZED.code).send(responseBody(statusCode.UNAUTHORIZED.constant, 'User tidak ditemukan'))
        
        if(req.params.key !== 'community') {
            if(user.thread.key !== req.params.key) return res.status(statusCode.FORBIDDEN.code).send(responseBody(statusCode.FORBIDDEN.constant, 'User tidak diizinkan untuk mengakses thread ini'))
        }
        
        const post = await prisma.post.findUnique({
            where: {
                id: req.params.id
            }, 
            include: {
                thread: {
                    select: {
                        id: true,
                        key: true
                    }
                },
                author: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        region: true
                    }
                }, 
                likes: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                username: true,
                            }
                        }
                    }
                },
                repliedBy: {
                    select: {
                        content: true,
                        author: {
                            select: {
                                id: true,
                                name: true,
                                username: true,
                                region: true
                            }
                        },
                        likesCount: true,
                        replyCount: true,
                        createdAt: true
                    }
                }
            }
        })

        return res.status(statusCode.OK.code).send(responseBody(statusCode.OK.constant, 'Post berhasil ditemukan', post))
    } catch (e) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, e.message))
    }
}

const getPostsByThreadKey = async (req, res) => {
    const take = req.query.limit ? parseInt(req.query.limit) : 10
    const skip = req.query.offset ? parseInt(req.query.offset) : 0
    const region = req.query.region ? req.query.region : ''

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            }, 
            include: {
                thread: {
                    select: {
                        id: true,
                        key: true
                   }
                }
            }
        })

        if(!user) return res.status(statusCode.UNAUTHORIZED.code).send(responseBody(statusCode.UNAUTHORIZED.constant, 'User tidak ditemukan'))
        
        if(req.params.key !== 'community') {
            if(user.thread.key !== req.params.key) return res.status(statusCode.FORBIDDEN.code).send(responseBody(statusCode.FORBIDDEN.constant, 'User tidak diizinkan untuk mengakses thread ini'))
        }

        const threadId = req.params.key !== 'community' ? user.thread.id : null

        const posts = await prisma.post.findMany({
            where: {
                threadId,
                OR: [{
                    author: {
                        region: {
                            contains: region,
                            mode: 'insensitive'
                        }
                    },
                }, {
                    content: {
                        contains: region,
                        mode: 'insensitive'
                    }
                }]
            }, 
            include: {
                thread: {
                    select: {
                        id: true,
                        key: true
                    }
                },
                author: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        region: true
                    }
                }
            }
        })

        if(posts.length === 0) return res.status(statusCode.NOT_FOUND.code).send(responseBody(statusCode.NOT_FOUND.constant, 'Post tidak ditemukan'))

        return res.status(statusCode.OK.code).send(responseBody(statusCode.OK.constant, 'Post berhasil ditemukan', posts))
    } catch (e) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, e.message))
    }
}

const likePost = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            }, 
            include: {
                thread: {
                    select: {
                        id: true,
                        key: true
                   }
                }
            }
        })

        if(!user) return res.status(statusCode.UNAUTHORIZED.code).send(responseBody(statusCode.UNAUTHORIZED.constant, 'User tidak ditemukan'))
        
        if(req.params.key !== 'community') {
            if(user.thread.key !== req.params.key) return res.status(statusCode.FORBIDDEN.code).send(responseBody(statusCode.FORBIDDEN.constant, 'User tidak diizinkan untuk mengakses thread ini'))
        }

        const postLikes = await prisma.postLikes.findMany({
            where: {
                postId: req.params.id,
                userId: req.user.id
            }
        })

        if(postLikes.length > 0) {
            await prisma.postLikes.deleteMany({
                where: {
                    postId: req.params.id,
                    userId: req.user.id
                }
            })
            
            await prisma.post.update({
                where: {
                    id: req.params.id
                },
                data: {
                    likesCount: { increment: -1 }
                }
            })
            res.status(statusCode.OK.code).send(responseBody(statusCode.OK.constant, 'Post berhasil batal disukai'))
        } else {
            await prisma.postLikes.create({
                data: {
                    postId: req.params.id,
                    userId: req.user.id
                }
            })

            await prisma.post.update({
                where: {
                    id: req.params.id
                },
                data: {
                    likesCount: { increment: 1 }
                }
            })
    
            return res.status(statusCode.OK.code).send(responseBody(statusCode.OK.constant, 'Post berhasil disukai'))
        }
    } catch (e) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, e.message))
    }
}

export { createPost, getPostById, getPostsByThreadKey, likePost }