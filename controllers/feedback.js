import { responseBody } from '../helpers/base_response.js';
import { prisma } from '../index.js'
import { statusCode } from '../helpers/constant.js'

const postFeedback = async (req, res) => {
    const { name, email, feedback } = req.body

    try {
        await prisma.feedback.create({
            data: {
                name, email, feedback
            }
        })
    } catch (e) {  
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, e.message))
    }

    return res.status(statusCode.CREATED.code).send(responseBody(statusCode.CREATED.constant, 'Feedback berhasil dikirim'))
}

const getFeedback = async (req, res) => {
    const skip = req.query.offset ? parseInt(req.query.offset) : 0
    const take = req.query.limit ? parseInt(req.query.limit) : 10

    try {
        const [ feedback, totalData ] = await prisma.$transaction([
            prisma.feedback.findMany({
                skip,
                take,
                orderBy: {
                    createdAt: 'desc'
                }
            }), 
            prisma.feedback.count()
        ])

        if(feedback.length === 0) return res.status(statusCode.NOT_FOUND.code).send(responseBody(statusCode.NOT_FOUND.constant, 'Tidak ada feedback ditemukan'))
        
        return res.status(statusCode.OK.code).send(responseBody(statusCode.OK.constant, 'Feedback berhasil ditampilkan', {feedback, totalData}))
    } catch(e) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).send(responseBody(statusCode.INTERNAL_SERVER_ERROR.constant, e.message))
    }
}

export { postFeedback, getFeedback }
