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
    if(user.key) return res.status(statusCode.BAD_REQUEST.code).send(responseBody(statusCode.BAD_REQUEST.constant, 'User sudah memiliki enroll key'))
    
    let thread

    try {
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
    } catch(e) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, e.message))
    } 
    
    return res.status(statusCode.OK.code).send(responseBody(statusCode.OK.constant, 'Key berhasil didapat', thread.key))

    // try {
    //     thread = await prisma.thread.upsert({
    //         where: {
    //             memberCounts: {
    //                 lt: 5
    //             }
    //         }, 
    //         update: {
    //             memberCounts: {
    //                 increment: 1
    //             }
    //         },
    //         create: {
    //             key: getKey(),
    //             memberCounts: 1
    //         }
    //     })
    
    //     await prisma.user.update({
    //         where: {
    //             id: req.user.id
    //         }, data: {
    //             key: thread.key
    //         }
    //     })
    // } catch(e) {
    //     return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, e.message))
    // } 
    // return res.status(statusCode.OK.code).send(responseBody(statusCode.OK.constant, 'Key berhasil didapat', thread.key))
}

const enrollKey = async(req, res) => {
    const user = await prisma.user.findUnique({
        where: {
            id: req.user.id
        }
    })

    if(!user) return res.status(statusCode.UNAUTHORIZED.code).send(responseBody(statusCode.UNAUTHORIZED.constant, 'User tidak ditemukan'))
    if(!user.id) return res.status(statusCode.BAD_REQUEST.code).send(responseBody(statusCode.BAD_REQUEST.constant, 'User belum memiliki enroll key'))
    if(user.joined) return res.status(statusCode.BAD_REQUEST.code).send(responseBody(statusCode.BAD_REQUEST.constant, 'User sudah bergabung ke sebuah thread'))

    const thread = await prisma.thread.findUnique({
        where: {
            id: user.threadId
        }
    })

    if(thread.key != req.params.key) return res.status(statusCode.BAD_REQUEST.code).send(responseBody(statusCode.BAD_REQUEST.constant, 'Enroll key tidak sesuai'))

    try {
        await prisma.user.update({
            where: {
                id: req.user.id
            }, 
            data: {
                joined: true
            }
        })
    } catch(e) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, e.message))
    } 
    return res.status(statusCode.OK.code).send(responseBody(statusCode.OK.constant, 'Enrollment berhasil'))
}

export { getThreadKey, enrollKey }