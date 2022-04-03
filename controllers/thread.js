import { responseBody } from '../helpers/base_response.js';
import { prisma } from '../index.js'
import { statusCode } from '../helpers/constant.js'
import { getKey } from '../helpers/string_util.js'

const getThreadKey = async (req, res) => {
    const user = await prisma.user.findUnique({
        where: {
            id: req.user.id
        }
    })

    if(!user) return res.status(statusCode.UNAUTHORIZED.code).send(responseBody(statusCode.UNAUTHORIZED.constant, 'User tidak ditemukan'))
    if(user.joined) return res.status(statusCode.BAD_REQUEST.code).send(responseBody(statusCode.BAD_REQUEST.constant, 'User sudah bergabung ke sebuah thread'))
    
    try {
        let thread
        if(user.threadId) {
            thread = await prisma.thread.findUnique({
                where: {
                    id: user.threadId
                }
            })

            return res.status(statusCode.OK.code).send(responseBody(statusCode.OK.constant, 'Key berhasil didapat', thread.key))
        }

        thread = await prisma.thread.findFirst({
            where: {
                memberCounts: {
                    lt: 5
                }
            }
        })

        if(!thread) {
            thread = await prisma.thread.create({
                data: {
                    key: getKey(),
                    memberCounts: 1
                }
            })
        } else {
            await prisma.thread.update({
                where: {
                    id: thread.id
                },
                data: {
                    memberCounts: {
                        increment: 1
                    }
                }
            })
        }

        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                threadId: thread.id
            }
        })

        return res.status(statusCode.OK.code).send(responseBody(statusCode.OK.constant, 'Key berhasil didapat', thread.key))
    } catch(e) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, e.message))
    } 
}

const enrollKey = async(req, res) => {
    const user = await prisma.user.findUnique({
        where: {
            id: req.user.id
        }
    })

    if(!user) return res.status(statusCode.UNAUTHORIZED.code).send(responseBody(statusCode.UNAUTHORIZED.constant, 'User tidak ditemukan'))
    if(!user.threadId) return res.status(statusCode.BAD_REQUEST.code).send(responseBody(statusCode.BAD_REQUEST.constant, 'User belum memiliki enroll key'))
    if(user.joined) return res.status(statusCode.BAD_REQUEST.code).send(responseBody(statusCode.BAD_REQUEST.constant, 'User sudah bergabung ke sebuah thread'))

    const thread = await prisma.thread.findUnique({
        where: {
            id: user.threadId
        }
    })

    if(thread.key != req.params.key) return res.status(statusCode.BAD_REQUEST.code).send(responseBody(statusCode.BAD_REQUEST.constant, 'Enroll key tidak sesuai'))

    try {
        const thread = await prisma.user.update({
            where: {
                id: req.user.id
            }, 
            data: {
                joined: true
            }, 
            select: {
                thread: {
                    select: {
                        id: true,
                        key: true
                    }
                }
            }

        })
        return res.status(statusCode.OK.code).send(responseBody(statusCode.OK.constant, 'Enrollment berhasil', thread))
    } catch(e) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, e.message))
    } 
}

export { getThreadKey, enrollKey }