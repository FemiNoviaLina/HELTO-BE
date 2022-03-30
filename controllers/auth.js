import bcrypt from 'bcryptjs'
import { prisma } from '../index.js'
import { responseBody } from '../helpers/base_response.js'
import jwt from 'jsonwebtoken'
import { getUsername } from '../helpers/string_util.js'
import { statusCode } from '../helpers/constant.js'

const registerUser = async (req, res) => {
    const { name, email, phone, region, isAdmin, password } = req.body
    const username = getUsername(email)
    let user

    try {
        user = await prisma.user.create({
            data: {
                name, username, email, phone, region, isAdmin, password: await bcrypt.hash(password, 10)
            }
        })
    } catch (e) {
        if(e.code === 'P2002') return res.status(statusCode.BAD_REQUEST.code).send(responseBody(statusCode.BAD_REQUEST.constant, 'Email sudah terdaftar'))
        
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, e.message))
    }

    const payload = { id: user.id, email, isAdmin: user.isAdmin }

    const token = jwt.sign(payload, process.env.JWT_SECRET)

    return res.status(statusCode.CREATED.code).send(responseBody(statusCode.CREATED.constant, 'Pendaftaran akun berhasil', { 
        user: { id : user.id, name, username, email, phone, region }, token 
    }))
}

const getToken = async (req, res) => {
    const { email, password } = req.body
    let user

    try {
        user = await prisma.user.findUnique({
            where: {
                email
            }
        })
    }
    catch (e) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, e.message))
    }

    if(!user) return res.status(statusCode.UNAUTHORIZED.code).send(responseBody(statusCode.UNAUTHORIZED.constant, 'Email atau password invalid'))

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) return res.status(statusCode.UNAUTHORIZED.code).send(responseBody(statusCode.UNAUTHORIZED.constant, 'Email atau password invalid'))

    const payload = { id: user.id, email, isAdmin: user.isAdmin }

    const token = await jwt.sign(payload, process.env.JWT_SECRET)

    return res.status(statusCode.OK.code).send(responseBody(statusCode.OK.constant, 'Token berhasil didapat', {
        user: { id : user.id, name: user.name, username: user.username, email: user.email, phone: user.phone, region: user.region }, token 
    }))
}

export { registerUser, getToken }