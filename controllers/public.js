import { supabase } from "../index.js"
import { statusCode } from "../helpers/constant.js"
import { responseBody } from "../helpers/base_response.js"

export const getStaticFile = async (req, res) => {
    const filename = req.params.filename
    const { data, error } = await supabase.storage.from('helto-storage').download('public/'  + filename)
    if(!data) return res.status(statusCode.NOT_FOUND.code).send(responseBody(statusCode.NOT_FOUND.constant, 'File tidak ditemukan'))
    const buffer = Buffer.from( await data.arrayBuffer(), 'base64')
    const contentType = filename.split('.').pop() == 'jpg' ? 'jpeg' :  filename.split('.').pop();
    res.header('Content-Type', 'image/' + contentType)
    res.send(buffer)
} 