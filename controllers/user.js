import { responseBody } from '../helpers/base_response.js';
import { prisma } from '../index.js'
import { statusCode } from '../helpers/constant.js'

export const getUser = async (req, res) => {
    if(!req.user.isAdmin && req.user.id != req.params.id) return res.status(statusCode.FORBIDDEN.code).send(responseBody(statusCode.FORBIDDEN.constant, 'User tidak diizinkan mengakses resource ini'))

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.params.id
            }, 
            select: {
                id: true,
                username: true, 
                name: true,
                email: true,
                phone: true,
                region: true,
                isAdmin: true,
                joined: true,
                thread: {
                    select: {
                        id: true,
                        key: true
                    }
                }
            }
        })

        if(!user) res.status(statusCode.NOT_FOUND.code).send(responseBody(statusCode.NOT_FOUND.constant, "User tidak ditemukan"))

        return res.status(statusCode.OK.code).send(responseBody(statusCode.OK.constant, 'User berhasil ditampilkan', user))
    } catch (e) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, e.message))
    }
}