import jwt from 'jsonwebtoken'
import { responseBody } from '../helpers/base_response.js'
import { statusCode } from '../helpers/constant.js'

export const validateToken = async (req, res, done) => {
    const auth =  req.headers['x-access-token'] || req.headers['authorization'] || req.query.token

    if(!auth) return res.status(statusCode.UNAUTHORIZED.code).send(responseBody(statusCode.UNAUTHORIZED.constant, 'Token tidak dapat ditemukan'))

    const token = auth.split(' ')[1]

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err) return res.status(statusCode.UNAUTHORIZED.code).send(responseBody(statusCode.UNAUTHORIZED.constant, 'Token Invalid'))

        req.user = user
    })
}