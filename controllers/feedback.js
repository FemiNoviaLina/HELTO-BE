import { errorResponse, successResponseNoData } from '../helpers/base_response.js';
import { prisma } from '../index.js'

export const postFeedback = async (req, res) => {
    const { name, email, feedback } = req.body

    try {
        await prisma.feedback.create({
            data: {
                name, email, feedback
            }
        })
    } catch (e) {  
        console.log(e)
        return res.status(400).send(errorResponse(e.message))
    }

    return res.status(200).send(successResponseNoData('Feedback submitted successfully'))
}