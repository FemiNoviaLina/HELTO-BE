import { responseBody } from '../helpers/base_response.js';
import { prisma } from '../index.js'
import { statusCode } from '../helpers/constant.js'

export const postFeedback = async (req, res) => {
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

    return res.status(statusCode.CREATED.code).send(responseBody(statusCode.CREATED.constant, 'Feedback submitted successfully'))
}