// import { responseBody } from '../helpers/base_response.js';
// import { prisma } from '../index.js'
// import { statusCode } from '../helpers/constant.js'

// const createPost = async (req, res) => {
//     // check belonging to thread
//     const user = await prisma.user.findUnique({
//         where: {
//             id: req.user.id
//         }, 
//         include: {
//             thread: true
//         }
//     })

//     if(!user) return res.status(statusCode.UNAUTHORIZED.code).send(responseBody(statusCode.UNAUTHORIZED.constant, 'User tidak ditemukan'))
//     if(user.thread.key !== req.params.key) 
// }