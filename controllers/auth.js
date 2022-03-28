import bcrypt from 'bcryptjs'
import { prisma } from '../index.js'
import { errorResponse, successResponse } from '../helpers/base_response.js'
import jwt from 'jsonwebtoken'
import { getUsername } from '../helpers/string_util.js'

const registerUser = async (req, res) => {
    const { name, email, phone, region, password } = req.body
    const username = getUsername(email)
    let user

    try {
        user = await prisma.user.create({
            data: {
                name, username, email, phone, region, password: await bcrypt.hash(password, 10)
            }
        })
    } catch (e) {
        console.log(e)
        return res.status(400).send(errorResponse(e.message))
    }

    const payload = { id: user.id, email }

    const token = jwt.sign(payload, process.env.JWT_SECRET)

    return res.status(200).send(successResponse({ user: {
        id : user.id, name, username, email, phone, region
    }, token }, 'User registered successfully'))
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
    } catch (e) {
        console.log(e)
        return res.status(400).send(errorResponse('email not found'))
    }

    if (!bcrypt.compare(password, user.password)) {
        return res.status(400).send(errorResponse('Invalid email or password'))
    }

    const payload = { id: user.id, email }

    const token = jwt.sign(payload, process.env.JWT_SECRET)

    return res.status(200).send(successResponse({ user: {
        id : user.id, name: user.name, username: user.username, email: user.email, phone: user.phone, region: user.region
    }, token }, 'User logged in successfully'))
}

export { registerUser, getToken }